const Order = require("../model/order.model");
const Cart = require("../model/cart.model");
const Product = require("../model/product.model");

exports.getOrderList = async (req, res) => {
    try {
        const userId = req.user.userId;
        console.log(userId);
        const orderList = await Order.find({user: userId})
            .populate({
                path: 'products.product',
                select: 'name price imageUrl'
            })
            .sort({createdAt: -1})
        console.log(orderList);
        res.status(200).json({
            status: 200,
            data: orderList,
            message: 'Order list',
            localDate: new Date()
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            localDate: new Date()
        })
    }
}

exports.createOrderWithoutVNPay = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cart = await Cart.findOne({user: userId}).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({status: 400, message: "Giỏ hàng trống!"});
        }

        const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        if (totalAmount <= 0) {
            return res.status(400).json({status: 400, message: "Số tiền không hợp lệ!"});
        }

        for (const item of cart.items) {
            const product = item.product;
            if(product.stock < item.quantity) {
                res.status(400).json({
                    status: 400,
                    message: `Product ${product.name} is not enough in inventory`,
                    localDate: new Date()
                })
            }
        }

        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity }
            });
        }

        const order = new Order({
            user: userId,
            products: cart.items,
            totalAmount,
            status: "Pending",
            isPaid: false
        });

        await order.save();

        // Xóa giỏ hàng sau khi tạo đơn hàng thành công
        await Cart.deleteOne({user: userId});

        return res.status(201).json({
            status: 201,
            message: "Đơn hàng đã được tạo thành công! Hãy chuẩn bị nhận hàng.",
            order,
            localDate: new Date()
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            localDate: new Date()
        })
    }
}

exports.cancelOrder = async (req, res) => {
    try {
        const {orderId} = req.params;
        const userId = req.user.userId;

        const order = await Order.findOne({_id: orderId, user: userId});
        if (!order) {
            return res.status(400).json({
                status: 400,
                message: "Không tìm thấy đơn hàng!",
                localDate: new Date()
            });
        }

        if (order.isPaid) {
            return res.status(400).json({
                status: 400,
                message: "Không thể hủy đơn hàng đã thanh toán!",
                localDate: new Date()
            });
        }

        order.status = "Cancelled";
        await order.save();

        return res.status(200).json({
            status: 200,
            message: "Đơn hàng đã bị hủy thành công!",
            localDate: new Date()
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Lỗi khi hủy đơn hàng!",
            error: error.message,
            localDate: new Date()
        });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const filter = status ? { status } : {};

        const orders = await Order.find(filter)
            .populate("user", "fullName")
            .populate("products.product", "name price")
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        const totalOrders = await Order.countDocuments(filter); // Đếm tổng số đơn hàng thỏa mãn điều kiện

        res.status(200).json({
            status: 200,
            message: "Order list retrieved successfully",
            data: orders,
            pagination: {
                totalOrders,
                totalPages: Math.ceil(totalOrders / limit),
                currentPage: parseInt(page),
                pageSize: parseInt(limit),
            },
            localDate: new Date(),
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            localDate: new Date(),
        });
    }
};


exports.changeStatusOrder = async (req, res) => {
    const { status } = req.body;
    const validStatuses = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    try {
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        ).populate("user").populate("products.product");

        if (!order) {
            return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
        }

        res.status(200).json({ message: "Cập nhật trạng thái thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error });
    }
}
