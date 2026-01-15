const mongoose = require('mongoose');

const serviceRecordSchema = new mongoose.Schema({
  // Using numeric recordNumber generated from timestamp for readability
  recordNumber: { type: Number, unique: true, default: () => Date.now() },
  serviceDate: { type: Date, required: true },
  plateNumber: { type: String, ref: 'Car', required: true },
  serviceCode: { type: String, ref: 'Service', required: true },
  remarks: { type: String }
});

module.exports = mongoose.model('ServiceRecord', serviceRecordSchema);
