"use strict";
// import nodemailer from "nodemailer";
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
exports.sendOrderEmail = sendOrderEmail;
exports.sendAdminNotificationEmail = sendAdminNotificationEmail;
// interface OrderItem {
//   name: string;
//   priceAtPurchase: number;
//   quantity: number;
// }
// // 1️⃣ Create transporter
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,     // e.g. "smtp.gmail.com" or other host
//   port: 587,                        // try 587 (TLS) — safer than 465
//   secure: false,
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });
// // 2️⃣ Verify transporter
// transporter.verify()
//   .then(() => console.log("SMTP connection is OK!"))
//   .catch((err) => console.error("SMTP connection failed:", err));
// // 3️⃣ Send order confirmation email to customer
// export const sendOrderEmail = async (to: string, items: OrderItem[], total: number, customerName: string) => {
//   const itemsHtml = items
//     .map(i => `<li>${i.name} - ₹ ${i.priceAtPurchase} × ${i.quantity}</li>`)
//     .join("");
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject: "Order Confirmation📦",
//     html: `
//       <h2>Thank you for your order! Dear, ${customerName}🤍</h2>
//       <h4>Your Order Details 🎂:</h4>
//       <ul>${itemsHtml}</ul>
//       <p><strong>Total Amount : ₹ ${total}</strong></p>
//       <p>Will Deliver Your Items Soon.</p>
//     `,
//   };
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Customer email sent:", info.response);
//   } catch (err) {
//     console.error("Failed to send customer email:", err);
//   }
// };
// // 4️⃣ Send order notification email to admin
// export const sendAdminNotificationEmail = async (
//   customerName: string,
//   customerEmail: string,
//   address: string,
//   payment: string,
//   items: OrderItem[],
//   total: number
// ) => {
//   const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
//   if (!adminEmail) {
//     console.error("Admin email not configured");
//     return;
//   }
//   const itemsHtml = items
//     .map(i => `<li>${i.name} - ₹ ${i.priceAtPurchase} × ${i.quantity} = ₹ ${i.priceAtPurchase * i.quantity}</li>`)
//     .join("");
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: adminEmail,
//     subject: `New Order Received from - ${customerName}`,
//     html: `
//       <h2>New Order Received !</h2>
//       <h4>Customer Information:</h4>
//       <p><strong>Name:</strong> ${customerName}</p>
//       <p><strong>Email:</strong> ${customerEmail}</p>
//       <p><strong>Address:</strong> ${address}</p>
//       <p><strong>Payment Method:</strong> ${payment}</p>
//       <h4>Order Details:</h4>
//       <ul>${itemsHtml}</ul>
//       <p><strong>Total Amount: ₹ ${total}</strong></p>
//       <p>Please Process this Order as soon as Possible.</p>
//     `,
//   };
//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Admin email sent:", info.response);
//   } catch (err) {
//     console.error("Failed to send admin email:", err);
//   }
// };
// sendEmail.ts
const mail_1 = __importDefault(require("@sendgrid/mail"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
function sendOrderEmail(to, items, total, customerName) {
    return __awaiter(this, void 0, void 0, function* () {
        const itemsHtml = items
            .map((i) => ` <li style="margin-bottom: 10px;">
      <strong>${i.name}</strong><br/>
      Price: ₹${i.priceAtPurchase} × ${i.quantity}<br/>
      ${i.sizeKg ? `Size: ${i.sizeKg} Kg<br/>` : ""}
      ${i.toppings && i.toppings.length
            ? `Toppings: ${i.toppings.join(", ")}<br/>`
            : ""}
      ${i.cakeMessage ? `Message: "${i.cakeMessage}"` : ""}
    </li>`)
            .join("");
        const msg = {
            to,
            from: process.env.SENDGRID_VERIFIED_SENDER, // the email you verified with SendGrid
            subject: "Order Confirmation 📦",
            html: `
      <h2>Thank you for your order,
       ${customerName}! 🤍</h2>
      <h4>Your Order Details:</h4>
      <ul>${itemsHtml}</ul>
      <p><strong>Total Amount: ₹ ${total}</strong></p>
      <p>We will deliver your items soon.</p>
    `,
        };
        try {
            const [response] = yield mail_1.default.send(msg);
            console.log("Customer email sent:", response.statusCode);
        }
        catch (err) {
            console.error("Failed to send customer email:", err);
        }
    });
}
function sendAdminNotificationEmail(customerName, customerEmail, address, payment, items, total) {
    return __awaiter(this, void 0, void 0, function* () {
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SENDGRID_VERIFIED_SENDER;
        const itemsHtml = items
            .map((i) => `<li>${i.name} — ₹${i.priceAtPurchase} × ${i.quantity} = ₹${i.priceAtPurchase * i.quantity}</li>`)
            .join("");
        const msg = {
            to: adminEmail,
            from: process.env.SENDGRID_VERIFIED_SENDER,
            subject: `New Order Received from ${customerName}`,
            html: `
      <h2>New Order Received!</h2>
      <h4>Customer Information:</h4>
      <p><strong>Name:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Address:</strong> ${address}</p>
      <p><strong>Payment Method:</strong> ${payment}</p>

      <h4>Order Details:</h4>
      <ul>${itemsHtml}</ul>
      <p><strong>Total Amount: ₹ ${total}</strong></p>

      <p>Please process this order as soon as possible.</p>
    `,
        };
        try {
            const [response] = yield mail_1.default.send(msg);
            console.log("Admin email sent:", response.statusCode);
        }
        catch (err) {
            console.error("Failed to send admin email:", err);
        }
    });
}
