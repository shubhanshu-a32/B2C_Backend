/**
 * seed.js
 * Run: npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./src/config/db');
const User = require('./src/models/User');
const BuyerProfile = require('./src/models/BuyerProfile');
const SellerProfile = require('./src/models/SellerProfile');
const Category = require('./src/models/Category');
const Product = require('./src/models/Product');

const run = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/b2c_marketplace';
  await connectDB(mongoUri);

  console.log('Clearing seed collections...');
  await Promise.all([User.deleteMany(), BuyerProfile.deleteMany(), SellerProfile.deleteMany(), Category.deleteMany(), Product.deleteMany()]);

  console.log('Creating categories...');
  const categories = ['Grocery','Electronics','Clothing','Home & Kitchen','Stationery','Toys','Beauty'].map(name => ({ name, slug: name.toLowerCase().replace(/\s+/g,'-') }));
  const createdCats = await Category.insertMany(categories);

  console.log('Creating sellers...');
  const sellers = [];
  for (let i=1;i<=5;i++) {
    const mobile = `900000000${i}`;
    const user = await User.create({ mobile, role: 'seller' });
    await SellerProfile.create({ userId: user._id, shopName: `Seller ${i}`, businessPhone: mobile, address: `Seller address ${i}`, categories: [createdCats[i % createdCats.length].name] });
    sellers.push(user);
  }

  console.log('Creating buyers...');
  const buyers = [];
  for (let i=1;i<=10;i++) {
    const mobile = `910000000${i}`;
    const user = await User.create({ mobile, role: 'buyer' });
    await BuyerProfile.create({ userId: user._id, name: `Buyer ${i}` });
    buyers.push(user);
  }

  console.log('Creating products...');
  const products = [];
  for (let i=1;i<=200;i++) {
    const seller = sellers[i % sellers.length];
    const cat = createdCats[i % createdCats.length];
    const p = {
      sellerId: seller._id,
      title: `${cat.name} Item ${i}`,
      description: `Description for ${cat.name} Item ${i}`,
      price: Math.floor(Math.random()*500)+50,
      stock: Math.floor(Math.random()*100),
      category: cat.name,
      subcategory: `${cat.name} Sub`,
      images: []
    };
    products.push(p);
  }
  await Product.insertMany(products);

  console.log('Seed complete');
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});