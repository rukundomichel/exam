const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentNumber: { type: Number, unique: true, default: () => Date.now() },
  amountPaid: { type: Number, required: true },
  paymentDate: { type: Date, required: true },
  recordNumber: { type: Number, ref: 'ServiceRecord', required: true },
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Payment', paymentSchema);
