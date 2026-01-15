require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Security / warnings
mongoose.set('strictQuery', false);
if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET === 'replace_with_strong_secret') {
  console.warn('\x1b[33m%s\x1b[0m', 'WARNING: SESSION_SECRET is not set or is using the default value. Set a strong SESSION_SECRET in .env for production.');
}


const servicesRouter = require('./routes/services');
const carsRouter = require('./routes/cars');
const recordsRouter = require('./routes/servicerecords');
const paymentsRouter = require('./routes/payments');
const reportsRouter = require('./routes/reports');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/crpms';

// Track DB connection status and add TLS options for Atlas compatibility.
let dbConnected = false;
const tlsInsecure = process.env.MONGO_TLS_INSECURE === 'true';
const isSrv = (process.env.MONGO_URI || '').startsWith('mongodb+srv://');
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ...(isSrv || tlsInsecure ? { tls: true } : {}),
  ...(tlsInsecure ? { tlsAllowInvalidCertificates: true } : {}),
  serverSelectionTimeoutMS: 10000
};

console.log('Mongo connect config:', { mongoUri: mongoUri.slice(0,200), isSrv, tlsInsecure, mongooseOptions });


mongoose.connect(mongoUri, mongooseOptions)
  .then(() => { dbConnected = true; console.log('MongoDB connected') })
  .catch(async (err) => {
    dbConnected = false;
    console.error('MongoDB connection error:', err);
    // Try a local fallback if allowed and not already targeting localhost
    const allowFallback = process.env.MONGO_FALLBACK_LOCAL !== 'false';
    const localUri = 'mongodb://localhost:27017/crpms';
    if (allowFallback && !mongoUri.startsWith('mongodb://127.0.0.1') && !mongoUri.startsWith('mongodb://localhost')) {
      console.warn('Attempting fallback to local MongoDB at', localUri);
      try {
        // Local Mongo usually doesn't use TLS, so try without TLS options
        const localOptions = { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 };
        await mongoose.connect(localUri, localOptions);
        dbConnected = true;
        console.log('Fallback: connected to local MongoDB');
      } catch (err2) {
        console.error('Fallback local MongoDB connection failed:', err2);
      }
    }
  });

mongoose.connection.on('disconnected', () => { dbConnected = false; console.warn('MongoDB disconnected') });
mongoose.connection.on('connected', () => { dbConnected = true; console.log('MongoDB connected (reconnected)') });

// If DB is not connected, return 503 for API calls so client gets JSON error instead of hanging.
app.use((req, res, next) => {
  const ready = mongoose.connection && mongoose.connection.readyState === 1; // 1 === connected
  if (!ready && req.path.startsWith('/api')) return res.status(503).json({ error: 'Database not connected' });
  next();
});

// JSON parse error handler to avoid server crash on bad JSON
app.use((err, req, res, next) => {
  if (err && err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body' });
  next(err);
});

// Log connection state periodically for visibility (dev only)
setInterval(() => {
  const s = mongoose.connection && mongoose.connection.readyState;
  if (s === 1 && !dbConnected) { dbConnected = true; console.log('MongoDB readyState=1 (connected)'); }
  if (s !== 1 && dbConnected) { dbConnected = false; console.warn('MongoDB readyState changed to', s); }
}, 5000);

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret_local_dev',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: mongoUri }),
  cookie: { maxAge: 1000 * 60 * 60 * 4 }
}));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/services', servicesRouter);
app.use('/api/cars', carsRouter);
app.use('/api/servicerecords', recordsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/users', require('./routes/users'));

app.get('/', (req, res) => res.json({ ok: true, message: 'CRPMS backend running' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
