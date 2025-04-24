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
exports.getCartByUserId = exports.removeFromCart = exports.addToCart = void 0;
const Products_1 = __importDefault(require("../models/Products"));
const responseHandler_1 = require("../utils/responseHandler");
const CartItem_1 = __importDefault(require("../models/CartItem"));
const addToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { productId, quantity } = req.body;
        const product = yield Products_1.default.findById(productId);
        if (!product) {
            return (0, responseHandler_1.response)(res, 404, "Product with the specific id cannot be found");
        }
        //  Check: seller is not adding their own product
        if (product.seller.toString() === userId) {
            return (0, responseHandler_1.response)(res, 400, "You cannot add your product to cart");
        }
        //  Find existing cart or create new one
        let cart = yield CartItem_1.default.findOne({ user: userId });
        if (!cart) {
            cart = new CartItem_1.default({ user: userId, items: [] });
        }
        //  Check if product is already in cart
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            //  If exists, increase quantity
            existingItem.quantity += quantity;
        }
        else {
            //  Else, push new item
            const newItem = {
                product: productId,
                quantity: quantity
            };
            cart.items.push(newItem);
        }
        //  Save cart
        yield cart.save();
        return (0, responseHandler_1.response)(res, 200, "Item added to cart successfully", cart);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.addToCart = addToCart;
const removeFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { productId } = req.params;
        //  Find existing cart or create new one
        let cart = yield CartItem_1.default.findOne({ user: userId });
        if (!cart) {
            return (0, responseHandler_1.response)(res, 400, "Cart not found for this user");
        }
        const itemExists = cart.items.some(item => item.product.toString() === productId);
        if (!itemExists) {
            return (0, responseHandler_1.response)(res, 404, "Item not found in cart");
        }
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        yield cart.save();
        return (0, responseHandler_1.response)(res, 200, "Item removed from cart successfully", cart);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.removeFromCart = removeFromCart;
const getCartByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        let cart = yield CartItem_1.default.findOne({ user: userId }).populate({
            path: "items.product"
        });
        if (!cart) {
            return (0, responseHandler_1.response)(res, 400, "Cart is empty", { items: [] });
        }
        return (0, responseHandler_1.response)(res, 200, "User cart fetched successfully", cart);
    }
    catch (error) {
        console.error(error);
        return (0, responseHandler_1.response)(res, 500, "Internal Server Error");
    }
});
exports.getCartByUserId = getCartByUserId;
