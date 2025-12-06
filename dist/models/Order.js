"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    payment: { type: String, required: true, enum: ['Cash on Delivery', 'UPI', 'Card'] },
    items: [
        {
            productId: { type: String, required: true },
            name: { type: String, required: true },
            priceAtPurchase: { type: Number, required: true, min: 0 },
            quantity: { type: Number, required: true, min: 1 },
            image: { type: String, required: true }
        },
    ],
    total: { type: Number, required: true, min: 0 },
    status: { type: String, default: 'PLACED', enum: ['PLACED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
const Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
