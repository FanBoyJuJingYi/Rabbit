const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect, admin } = require('../middleware/authMiddleware');

// POST - Create contact
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  const contact = await Contact.create({ name, email, message });
  res.status(201).json(contact);
});

// GET - Admin get all contacts
router.get('/', protect, admin, async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json(contacts);
});

// PUT - Mark complete
router.put('/:id/complete', protect, admin, async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ message: 'Not found' });

  contact.status = 'completed';
  await contact.save();
  res.json(contact);
});

// DELETE
router.delete('/:id', protect, admin, async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ message: 'Not found' });

  await contact.deleteOne();
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
