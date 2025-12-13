import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  payment: { type: String, required: true, enum: ['Cash on Delivery', 'UPI', 'Card'] },
  items: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      priceAtPurchase: { type: Number, required: true, min: 0 },
      quantity: { type: Number, required: true, min: 1 },
      image: { type: String, required: true },
      sizeKg: { type: Number, default: null },
      toppings: { type: [String], default: [] },
      cakeMessage: { type: String, default: "" }
    },
  ],
  total: { type: Number, required: true, min: 0 },
  status: { type: String, default: 'PLACED', enum: ['PLACED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);

export default Order;
