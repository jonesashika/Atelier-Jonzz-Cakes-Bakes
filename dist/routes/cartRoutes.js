"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../controllers/cartController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/add', auth_1.authMiddleware, cartController_1.addToCart);
router.get('/', auth_1.authMiddleware, cartController_1.getCart);
router.post('/update', auth_1.authMiddleware, cartController_1.updateQuantity);
router.post('/remove', auth_1.authMiddleware, cartController_1.removeFromCart);
exports.default = router;
