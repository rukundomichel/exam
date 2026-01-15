require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function run() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/crpms';
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB');

  const username = 'mich';
  const password = '00002222';

  const hash = await bcrypt.hash(password, 10);

  let user = await User.findOne({ username: 'admin' });
  if (user) {
    user.username = username;
    user.passwordHash = hash;
    await user.save();
    console.log('Updated existing admin ->', username);
  } else {
    // if admin doesn't exist, update any 'mich' or create
    user = await User.findOne({ username });
    if (user) {
      user.passwordHash = hash;
      await user.save();
      console.log('Updated existing user', username);
    } else {
      await User.create({ username, passwordHash: hash, role: 'admin' });
      console.log('Created user', username);
    }
  }

  mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });