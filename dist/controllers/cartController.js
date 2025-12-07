"use strict";
// import { Request, Response } from "express";
// import Cart from "../models/Cart";
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
exports.removeFromCart = exports.updateQuantity = exports.getCart = exports.addToCart = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Cart_1 = __importDefault(require("../models/Cart"));
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, name, price, quantity, image } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized — no userId" });
        }
        // Ensure userId is ObjectId
        const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
        const item = yield Cart_1.default.findOneAndUpdate({ userId: userObjectId, productId }, {
            $inc: { quantity: quantity || 1 },
            $setOnInsert: {
                userId: userObjectId,
                productId,
                name,
                price,
                image,
            }
        }, { upsert: true, new: true });
        res.status(201).json({ message: "Added to cart successfully", item });
    }
    catch (err) {
        console.error("Add to cart error:", err);
        res.status(500).json({ message: "Add to cart failed", error: err.message });
    }
});
exports.addToCart = addToCart;
const getCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const items = yield Cart_1.default.find({ userId });
    res.json(items);
});
exports.getCart = getCart;
const updateQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId, type } = req.body;
    const userId = req.userId;
    if (!productId || !["inc", "dec"].includes(type)) {
        return res.status(400).json({ message: "Invalid payload" });
    }
    const item = yield Cart_1.default.findOne({ userId, productId });
    if (!item)
        return res.status(404).json({ message: "Item not found" });
    item.quantity += type === "inc" ? 1 : -1;
    if (item.quantity <= 0)
        yield item.deleteOne();
    else
        yield item.save();
    res.json(item);
});
exports.updateQuantity = updateQuantity;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body;
    const userId = req.userId;
    if (!productId)
        return res.status(400).json({ message: "Invalid payload" });
    const item = yield Cart_1.default.findOne({ userId, productId });
    if (!item)
        return res.status(404).json({ message: "Item not found" });
    yield item.deleteOne();
    res.json({ message: "Item removed from cart" });
});
exports.removeFromCart = removeFromCart;
