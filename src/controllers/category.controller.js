const Category = require('../models/Category');

const createCategory = async (req, res) => {
  const { name, parent } = req.body;
  if (!name) return res.status(400).json({ message: 'name required' });
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  try {
    const existing = await Category.findOne({ slug });
    if (existing) return res.status(400).json({ message: 'Category already exists' });
    const cat = await Category.create({ name, slug, parent: parent || null });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: 'Error creating category', error: err.message });
  }
};

const listCategories = async (req, res) => {
  const cats = await Category.find().sort({ name: 1 });
  res.json(cats);
};

module.exports = { createCategory, listCategories };