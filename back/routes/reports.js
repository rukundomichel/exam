const express = require('express');
const Payment = require('../models/Payment');
const ServiceRecord = require('../models/ServiceRecord');
const Service = require('../models/Service');
const Car = require('../models/Car');
const { requireLogin } = require('../middleware/auth');
const router = express.Router();

// GET /api/reports/daily?date=YYYY-MM-DD
router.get('/daily', requireLogin, async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'date query required (YYYY-MM-DD)' });
    const start = new Date(date);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    // find payments in date range and populate related info
    const payments = await Payment.find({ paymentDate: { $gte: start, $lte: end } })
      .populate({ path: 'receivedBy', select: 'username' })
      .lean();

    // enrich with service and car details
    const results = [];
    for (const p of payments) {
      const rec = await ServiceRecord.findOne({ recordNumber: p.recordNumber }).lean();
      const svc = rec ? await Service.findOne({ serviceCode: rec.serviceCode }).lean() : null;
      const car = rec ? await Car.findOne({ plateNumber: rec.plateNumber }).lean() : null;
      results.push({ payment: p, service: svc, car, record: rec });
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
