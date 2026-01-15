const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true },
  type: { type: String },
  model: { type: String },
  manufacturingYear: { type: Number },
  driverPhone: { type: String },
  mechanicName: { type: String },
  image: { type: String, default: null } // base64 encoded image
});

module.exports = mongoose.model('Car', carSchema);
