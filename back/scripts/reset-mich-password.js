require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function run(){
  try{
    const mongo = process.env.MONGO_URI || 'mongodb://localhost:27017/crpms';
    await mongoose.connect(mongo, { useNewUrlParser:true, useUnifiedTopology:true });
    const User = require('../models/User');
    const u = await User.findOne({ username: 'mich' });
    if (!u) { console.error('user not found'); process.exit(1); }
    u.passwordHash = await bcrypt.hash('00002222', 10);
    await u.save();
    console.log('Updated password for user mich');
    await mongoose.disconnect();
  }catch(err){
    console.error('ERR', err);
    process.exit(1);
  }
}
run();
