"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "*****" : "Not set");
// console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const auth_1 = __importDefault(require("./routes/auth"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const path = require('path');
(0, db_1.default)();
app.use('/api/auth', auth_1.default);
app.use('/api/cart', cartRoutes_1.default);
// app.use('/api/cart', (req, res, next) => {
//   console.log('Cart route hit:', req.method, req.path);
//   next();
// }, cartRoutes);
app.use('/api/orders', orderRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Backend is alive');
});
const buildPath = path.join(__dirname, '..', 'build');
app.use(express_1.default.static(buildPath));
app.get(/^(?!\/api\/).*$/, (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
});
// Serve static files from React build
// app.use(express.static(path.join(__dirname,'build')));
// For any other route, serve index.html (for frontend routing)
// app.get(/^(.*)$/, (req, res) => {
// res.sendFile(path.join(__dirname,'build', 'index.html'));
// });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
