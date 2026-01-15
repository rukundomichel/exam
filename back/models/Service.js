const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceCode: { type: String, required: true, unique: true },
  serviceName: { type: String, required: true },
  servicePrice: { type: Number, required: true },
  image: { type: String, default: null } // base64 encoded image
});

module.exports = mongoose.model('Service', serviceSchema);
