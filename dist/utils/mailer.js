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
exports.sendAdminNotificationEmail = exports.sendOrderEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// 1️⃣ Create transporter
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST, // e.g. "smtp.gmail.com" or other host
    port: 587, // try 587 (TLS) — safer than 465
    secure: false,
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// 2️⃣ Verify transporter
transporter.verify()
    .then(() => console.log("SMTP connection is OK!"))
    .catch((err) => console.error("SMTP connection failed:", err));
// 3️⃣ Send order confirmation email to customer
const sendOrderEmail = (to, items, total, customerName) => __awaiter(void 0, void 0, void 0, function* () {
    const itemsHtml = items
        .map(i => `<li>${i.name} - ₹ ${i.priceAtPurchase} × ${i.quantity}</li>`)
        .join("");
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: "Order Confirmation📦",
        html: `
      <h2>Thank you for your order! Dear, ${customerName}🤍</h2>
      <h4>Your Order Details 🎂:</h4>
      <ul>${itemsHtml}</ul>
      <p><strong>Total Amount : ₹ ${total}</strong></p>
      <p>Will Deliver Your Items Soon.</p>
    `,
    };
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log("Customer email sent:", info.response);
    }
    catch (err) {
        console.error("Failed to send customer email:", err);
    }
});
exports.sendOrderEmail = sendOrderEmail;
// 4️⃣ Send order notification email to admin
const sendAdminNotificationEmail = (customerName, customerEmail, address, payment, items, total) => __awaiter(void 0, void 0, void 0, function* () {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    if (!adminEmail) {
        console.error("Admin email not configured");
        return;
    }
    const itemsHtml = items
        .map(i => `<li>${i.name} - ₹ ${i.priceAtPurchase} × ${i.quantity} = ₹ ${i.priceAtPurchase * i.quantity}</li>`)
        .join("");
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: adminEmail,
        subject: `New Order Received from - ${customerName}`,
        html: `
      <h2>New Order Received !</h2>
      <h4>Customer Information:</h4>
      <p><strong>Name:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Payment Method:</strong> ${payment}</p>

      <h4>Order Details:</h4>
      <ul>${itemsHtml}</ul>
      <p><strong>Total Amount: ₹ ${total}</strong></p>

      <p>Please Process this Order as soon as Possible.</p>
    `,
    };
    try {
        const info = yield transporter.sendMail(mailOptions);
        console.log("Admin email sent:", info.response);
    }
    catch (err) {
        console.error("Failed to send admin email:", err);
    }
});
exports.sendAdminNotificationEmail = sendAdminNotificationEmail;
