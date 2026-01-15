const express = require('express');
const Car = require('../models/Car');
const { requireLogin } = require('../middleware/auth');
const router = express.Router();


// Insert car with optional image
router.post('/', requireLogin, async (req, res) => {
  try {
    const { plateNumber, type, model, manufacturingYear, driverPhone, mechanicName, image } = req.body;
    const car = new Car({ plateNumber, type, model, manufacturingYear, driverPhone, mechanicName, image: image || null });
    await car.save();
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// List cars
router.get('/', async (req, res) => {
  const list = await Car.find().sort({ plateNumber: 1 });
  res.json(list);
});

module.exports = router;
