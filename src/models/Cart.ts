import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true }
}, { timestamps: true });

cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model("Cart", cartItemSchema);
