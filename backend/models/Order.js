const moongoose = require('mongoose');

const orderItemSchema = new moongoose.Schema({
  productId: {
    type: moongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: String,
  color: String,
  quantity: {
    type: Number,
    required: true,
  },
}, { _id: false });

const orderSchema = new moongoose.Schema({
  user: {
    type: moongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  coupon: {
    type: String,
    default: null,
  },

  discountAmount: {
    type: Number,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },

  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  paymentStatus: {
    type: String,
    default: "pending",
  },
  status: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Canceled"],
    default: "Processing",
  }
},
  { timestamps: true }
);

module.exports = moongoose.model('order', orderSchema);