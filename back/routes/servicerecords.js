const express = require('express');
const ServiceRecord = require('../models/ServiceRecord');
const Service = require('../models/Service');
const Car = require('../models/Car');
const { requireLogin } = require('../middleware/auth');
const router = express.Router();

// Create record (insert)
router.post('/', requireLogin, async (req, res) => {
  try {
    const { serviceDate, plateNumber, serviceCode, remarks } = req.body;
    // validate related docs exist
    const car = await Car.findOne({ plateNumber });
    const service = await Service.findOne({ serviceCode });
    if (!car) return res.status(400).json({ error: 'Car not found' });
    if (!service) return res.status(400).json({ error: 'Service not found' });

    const rec = new ServiceRecord({ serviceDate, plateNumber, serviceCode, remarks });
    await rec.save();
    res.status(201).json(rec);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Retrieve all (allowed for ServiceRecord only per exam)
router.get('/', async (req, res) => {
  const list = await ServiceRecord.find().sort({ serviceDate: -1 });
  res.json(list);
});

// Retrieve one
router.get('/:recordNumber', async (req, res) => {
  const rec = await ServiceRecord.findOne({ recordNumber: req.params.recordNumber });
  if (!rec) return res.status(404).json({ error: 'not found' });
  res.json(rec);
});

// Update (only for ServiceRecord)
router.put('/:recordNumber', async (req, res) => {
  try {
    const rec = await ServiceRecord.findOneAndUpdate({ recordNumber: req.params.recordNumber }, req.body, { new: true });
    if (!rec) return res.status(404).json({ error: 'not found' });
    res.json(rec);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete (only for ServiceRecord)
router.delete('/:recordNumber', async (req, res) => {
  const rec = await ServiceRecord.findOneAndDelete({ recordNumber: req.params.recordNumber });
  if (!rec) return res.status(404).json({ error: 'not found' });
  res.json({ message: 'deleted' });
});

module.exports = router;
