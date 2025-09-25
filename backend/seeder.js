const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Cart = require('./models/Cart');
const products = require('./data/products');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // Create default admin user
    const createdUser = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "123456",
      role: "admin",
    });

    // Assign the admin user to the products
    const userID = createdUser._id;

    const sampledProducts = products.map((product) => {
      return { ...product, user: userID }
    });

    await Product.insertMany(sampledProducts);

    console.log('Product Data seeded successfully');
    process.exit();

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

seedData()