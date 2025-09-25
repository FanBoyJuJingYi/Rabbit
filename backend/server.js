const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const subscribeRoutes = require('./routes/subscribeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const productAdminRoutes = require('./routes/productAdminRoutes');
const orderAdminRoutes = require('./routes/adminOrderRoutes');
const commentRoutes = require('./routes/commentRoutes');
const couponRoutes = require('./routes/coupons');
const commentAdminRoute = require('./routes/commentAdminRoute');
const postRoutes = require('./routes/postRoutes');
const favoritesRoutes = require("./routes/favoritesRoutes");
const contactRoutes = require('./routes/contactRoutes');
const categoryRoutes = require("./routes/categoryRoutes");
const revenueRoutes = require('./routes/revenueRoutes');


const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();


const PORT = process.env.PORT || 3000;


// Connect to MongoDB
connectDB();
app.get('/', (req, res) => {
  res.send("WELCOME TO THE RABBIT API");
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api", subscribeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use('/api/contacts', contactRoutes);
app.use("/api/categories", categoryRoutes);




// Admin Routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);
app.use("/api/admin/comments", commentAdminRoute);
app.use("/api/admin/revenue", revenueRoutes);




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});