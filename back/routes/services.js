const express = require('express');
const Service = require('../models/Service');
const { requireLogin } = require('../middleware/auth');
const router = express.Router();


// Create service (insert) with optional image
router.post('/', requireLogin, async (req, res) => {
  try {
    const { serviceCode, serviceName, servicePrice, image } = req.body;
    const s = new Service({ serviceCode, serviceName, servicePrice, image: image || null });
    await s.save();
    res.status(201).json(s);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List services
router.get('/', async (req, res) => {
  const list = await Service.find().sort({ serviceName: 1 });
  res.json(list);
});

module.exports = router;
