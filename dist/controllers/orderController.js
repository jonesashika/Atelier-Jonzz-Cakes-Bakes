"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.placeOrder = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const Cart_1 = __importDefault(require("../models/Cart"));
const User_1 = __importDefault(require("../models/User"));
const mailer_1 = require("../utils/mailer");
const placeOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, address, payment } = req.body;
    const userId = req.userId;
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" });
    if (!name || !address || !["Cash on Delivery", "UPI", "Card"].includes(payment)) {
        return res.status(400).json({ message: "Invalid payload" });
    }
    try {
        // Fetch user's email from DB
        const user = yield User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        const userEmail = user.email;
        // Fetch cart items
        const cartItems = yield Cart_1.default.find({ userId });
        if (cartItems.length === 0)
            return res.status(400).json({ message: "Cart is empty" });
        // Map items for order
        const items = cartItems.map((ci) => ({
            productId: ci.productId,
            name: ci.name,
            priceAtPurchase: ci.price,
            quantity: ci.quantity,
            image: ci.image,
        }));
        const total = items.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0);
        // Create order
        const newOrder = yield Order_1.default.create({ userId, name, address, payment, items, total });
        // Send emails asynchronously
        if (userEmail) {
            (0, mailer_1.sendOrderEmail)(userEmail, items, total, name)
                .then(() => console.log("Order confirmation email sent to customer"))
                .catch((err) => console.error("Customer email sending failed:", err));
            (0, mailer_1.sendAdminNotificationEmail)(name, userEmail, address, payment, items, total)
                .then(() => console.log("Admin notification email sent"))
                .catch((err) => console.error("Admin email sending failed:", err));
        }
        else {
            console.warn("User email missing — emails not sent");
        }
        // Clear cart
        yield Cart_1.default.deleteMany({ userId });
        res.json({ message: "Order placed successfully!", order: newOrder });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to place order", error: err.message });
    }
});
exports.placeOrder = placeOrder;
