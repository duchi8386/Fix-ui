const Cart = require("../model/cart.model");
const Product = require("../model/product.model");
const Order = require("../model/order.model");
const Payment = require("../model/payment.model");

exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;

        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findById(productId);
        if (!product || product.status !== "active") {
            return res.status(404).json({ message: "Product not found or inactive" });
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: "Added to cart", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.viewCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            return res.status(404).json({ message: "Cart is empty" });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeItemFromCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.body; // ID sản phẩm cần xóa

        // Xóa item trong giỏ hàng
        const updatedCart = await Cart.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { product: productId } } }, // Xóa sản phẩm khỏi giỏ hàng
            { new: true }
        );

        // Nếu giỏ hàng rỗng sau khi xóa item, xóa luôn giỏ hàng
        if (updatedCart && updatedCart.items.length === 0) {
            await Cart.deleteOne({ user: userId });
            return res.status(200).json({
                status: 200,
                message: "Giỏ hàng đã bị xóa do không còn sản phẩm.",
                localDate: new Date()
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Sản phẩm đã được xóa khỏi giỏ hàng.",
            cart: updatedCart
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message
        });
    }
};
