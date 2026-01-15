const express = require('express');
const Payment = require('../models/Payment');
const ServiceRecord = require('../models/ServiceRecord');
const User = require('../models/User');
const { requireLogin } = require('../middleware/auth');
const router = express.Router();

// Insert payment
router.post('/', requireLogin, async (req, res) => {
  try {
    // If receivedBy is not provided, use current logged in user
    const { amountPaid, paymentDate, recordNumber, receivedBy } = req.body;
    const rec = await ServiceRecord.findOne({ recordNumber });
    if (!rec) return res.status(400).json({ error: 'ServiceRecord not found' });
    const receiverId = receivedBy || req.session.userId;
    const user = await User.findById(receiverId);
    if (!user) return res.status(400).json({ error: 'Receiver (user) not found' });

    const p = new Payment({ amountPaid, paymentDate, recordNumber, receivedBy: user._id });
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List payments (for reporting)
router.get('/', async (req, res) => {
  const list = await Payment.find().sort({ paymentDate: -1 }).populate('receivedBy', 'username role');
  res.json(list);
});

// GET single payment by paymentNumber with related record/service/car
router.get('/:paymentNumber', async (req, res) => {
  const p = await Payment.findOne({ paymentNumber: Number(req.params.paymentNumber) }).populate('receivedBy', 'username role').lean();
  if (!p) return res.status(404).json({ error: 'payment not found' });
  const rec = await ServiceRecord.findOne({ recordNumber: p.recordNumber }).lean();
  const svc = rec ? await (await (require('../models/Service')).findOne({ serviceCode: rec.serviceCode }).lean()) : null;
  const car = rec ? await (await (require('../models/Car')).findOne({ plateNumber: rec.plateNumber }).lean()) : null;
  res.json({ payment: p, record: rec, service: svc, car });
});

module.exports = router;
