import { Request, Response } from "express";
import Order from "../models/Order";
import Cart from "../models/Cart";
import User from "../models/User";
import { sendOrderEmail, sendAdminNotificationEmail } from "../utils/mailer";

export const placeOrder = async (req: Request, res: Response) => {
  const { name, address, payment } = req.body;
  const userId = req.userId as string;

  if (!userId) return res.status(401).json({ message: "Unauthorized" });
  if (!name || !address || !["Cash on Delivery", "UPI", "Card"].includes(payment)) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  try {
    // Fetch user's email from DB
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const userEmail = user.email;

    // Fetch cart items
    const cartItems = await Cart.find({ userId });
    if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });

    // Map items for order
    const items = cartItems.map((ci) => {
      const sizeMultiplier = ci.sizeKg || 1;
      const finalUnitPrice = ci.price * sizeMultiplier;

      return {
        productId: ci.productId,
        name: ci.name,
        priceAtPurchase: finalUnitPrice, // ✅ FINAL price
        quantity: ci.quantity,
        image: ci.image,
        sizeKg: ci.sizeKg,
        toppings: ci.toppings,
        cakeMessage: ci.cakeMessage,
      };
    });


    const total = items.reduce((sum, i) => sum + i.priceAtPurchase * i.quantity, 0);

    // Create order
    const newOrder = await Order.create({ userId, name, address, payment, items, total });

    // Send emails asynchronously
    if (userEmail) {
      sendOrderEmail(userEmail, items, total, name)
        .then(() => console.log("Order confirmation email sent to customer"))
        .catch((err) => console.error("Customer email sending failed:", err));

      sendAdminNotificationEmail(name, userEmail, address, payment, items, total)
        .then(() => console.log("Admin notification email sent"))
        .catch((err) => console.error("Admin email sending failed:", err));
    } else {
      console.warn("User email missing — emails not sent");
    }

    // Clear cart
    await Cart.deleteMany({ userId });

    res.json({ message: "Order placed successfully!", order: newOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to place order", error: (err as Error).message });
  }
};
