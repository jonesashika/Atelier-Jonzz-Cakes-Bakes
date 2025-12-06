// import { Request, Response } from "express";
// import Cart from "../models/Cart";

// export const addToCart = async (req: Request, res: Response) => {
//   try {
//     const { productId, name, price, quantity, image } = req.body;
//     const userId = req.userId;

//     if (!userId) return res.status(401).json({ message: "Unauthorized — no userId" });

//     // Check if item already exists
//     let item = await Cart.findOne({ userId, productId });

//     if (item) {
//       item.quantity += 1;
//       await item.save();
//       return res.json({ message: "Quantity Updated", item });
//     }

//     // Create new cart item
//     item = await Cart.create({
//       userId,
//       productId,
//       name,
//       price,
//       quantity: quantity || 1,
//       image,
//     });

//     res.status(201).json({ message: "Added to cart successfully", item });
//   } catch (err: any) {
//     console.error("Add to cart error:", err);
//     res.status(500).json({ message: "Add to cart failed", error: err.message });
//   }
// };

// export const getCart = async (req: Request, res: Response) => {
//   const userId = req.userId!;
//   const items = await Cart.find({ userId });
//   res.json(items);
// };

// export const updateQuantity = async (req: Request, res: Response) => {
//   const { productId, type } = req.body;
//   const userId = req.userId!;
//   if (!productId || !["inc", "dec"].includes(type)) {
//     return res.status(400).json({ message: "Invalid payload" });
//   }
//   const item = await Cart.findOne({ userId, productId });
//   if (!item) return res.status(404).json({ message: "Item not found" });

//   item.quantity += type === "inc" ? 1 : -1;
//   if (item.quantity <= 0) await item.deleteOne();
//   else await item.save();

//   res.json(item);
// };

// export const removeFromCart = async (req: Request, res: Response) => {
//   const { productId } = req.body;
//   const userId = req.userId!;
//   if (!productId) return res.status(400).json({ message: "Invalid payload" });

//   const item = await Cart.findOne({ userId, productId });
//   if (!item) return res.status(404).json({ message: "Item not found" });

//   await item.deleteOne();
//   res.json({ message: "Item removed from cart" });
// };


import { Request, Response } from "express";
import mongoose from "mongoose";
import Cart from "../models/Cart";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, name, price, quantity, image } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized — no userId" });
    }

    // Ensure userId is ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const item = await Cart.findOneAndUpdate(
      { userId: userObjectId, productId },
      {
        $inc: { quantity: quantity || 1 },
        $setOnInsert: {
          userId: userObjectId,
          productId,
          name,
          price,
          image,
        }
      },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: "Added to cart successfully", item });
  } catch (err: any) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Add to cart failed", error: err.message });
  }
};

export const getCart = async (req: Request, res: Response) => {
  const userId = req.userId!;
  const items = await Cart.find({ userId });
  res.json(items);
};

export const updateQuantity = async (req: Request, res: Response) => {
  const { productId, type } = req.body;
  const userId = req.userId!;
  if (!productId || !["inc", "dec"].includes(type)) {
    return res.status(400).json({ message: "Invalid payload" });
  }
  const item = await Cart.findOne({ userId, productId });
  if (!item) return res.status(404).json({ message: "Item not found" });

  item.quantity += type === "inc" ? 1 : -1;
  if (item.quantity <= 0) await item.deleteOne();
  else await item.save();

  res.json(item);
};

export const removeFromCart = async (req: Request, res: Response) => {
  const { productId } = req.body;
  const userId = req.userId!;
  if (!productId) return res.status(400).json({ message: "Invalid payload" });

  const item = await Cart.findOne({ userId, productId });
  if (!item) return res.status(404).json({ message: "Item not found" });

  await item.deleteOne();
  res.json({ message: "Item removed from cart" });
};
