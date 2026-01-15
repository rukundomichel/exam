require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Service = require('../models/Service');
const User = require('../models/User');

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/crpms';

async function run() {
  await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to Mongo for seeding');

  const services = [
    { serviceCode: 'SVC001', serviceName: 'Engine repair', servicePrice: 150000 },
    { serviceCode: 'SVC002', serviceName: 'Transmission repair', servicePrice: 80000 },
    { serviceCode: 'SVC003', serviceName: 'Oil Change', servicePrice: 60000 },
    { serviceCode: 'SVC004', serviceName: 'Chain replacement', servicePrice: 40000 },
    { serviceCode: 'SVC005', serviceName: 'Disc replacement', servicePrice: 400000 },
    { serviceCode: 'SVC006', serviceName: 'Wheel alignment', servicePrice: 5000 }
  ];

  for (const s of services) {
    const existing = await Service.findOne({ serviceCode: s.serviceCode });
    if (!existing) await Service.create(s);
  }
  console.log('Seeded services');

  // create default admin user if none exists
  const existingAdmin = await User.findOne({ username: 'admin' });
  if (!existingAdmin) {
    const hash = await bcrypt.hash('Admin@12345', 10);
    await User.create({ username: 'admin', passwordHash: hash, role: 'admin' });
    console.log('Created default admin user: username=admin password=Admin@12345');
  } else {
    console.log('Admin user exists');
  }

  mongoose.disconnect();
}

run().catch(err => console.error(err));
