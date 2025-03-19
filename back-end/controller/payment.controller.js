const moment = require("moment");
const vnpay = require("vnpay");
const {vnp_TmnCode, vnp_HashSecret, vnp_Url, vnp_ReturnUrl} = require("../config/vnpay.config");
const Order = require("../model/order.model");
const Cart = require("../model/cart.model");
const Payment = require("../model/payment.model");
const Product = require("../model/product.model");
const querystring = require("qs");
const crypto = require("crypto");

exports.createVNPayPayment = async (req, res) => {
    try {
        var ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        const userId = req.user.userId;

        const now = moment();
        const expireDate = now.clone().add(15, "minutes");

        const cart = await Cart.findOne({user: userId}).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({message: "Cart is empty"});
        }

        const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        if (totalAmount <= 0) {
            return res.status(400).json({message: "Invalid payment amount"});
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

        await Cart.deleteOne({user: userId});

        const payment = new Payment({
            order: order._id,
            method: "Bank Transfer",
            status: "Pending",
            transactionId: Math.floor(Math.random() * 1000000).toString(),

        })
        await payment.save();

        const vnp_Amount = totalAmount * 100;
        const vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode,
            vnp_Locale: "vn",
            vnp_CurrCode: "VND",
            vnp_TxnRef: Math.floor(Math.random() * 1000000).toString(),
            vnp_OrderInfo: `${order._id}`,
            vnp_OrderType: "other",
            vnp_Amount,
            vnp_ReturnUrl: vnp_ReturnUrl,
            vnp_IpAddr: "127.0.0.1",
            vnp_CreateDate: now.format("YYYYMMDDHHmmss"),
            vnp_ExpireDate: expireDate.format("YYYYMMDDHHmmss")

        };

        const sortedParams = {};
        Object.keys(vnp_Params)
            .filter(key => key !== "vnp_SecureHash" && vnp_Params[key] !== undefined && vnp_Params[key] !== null)
            .sort()
            .forEach(key => {
                sortedParams[key] = vnp_Params[key];
            });

        const sortedQuery = new URLSearchParams(sortedParams).toString();


        console.log("🔹 String before hashing:", sortedQuery);

        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(sortedQuery, "utf-8").digest("hex");

        vnp_Params.vnp_SecureHash = signed;
        const paymentUrl = `${vnp_Url}?${querystring.stringify(vnp_Params)}`;

        console.log("Generated SecureHash:", signed);
        console.log("Payment URL:", `${vnp_Url}?${querystring.stringify(vnp_Params)}`);


        res.status(200).json({paymentUrl});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};


exports.vnpayReturn = async (req, res) => {
    try {
        const vnp_Params = req.query;
        const secureHash = vnp_Params["vnp_SecureHash"];

        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        const sortedParams = querystring.stringify(vnp_Params, {encode: false});

        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(new Buffer.from(sortedParams, "utf-8")).digest("hex");

        if (secureHash !== signed) {
            return res.status(400).json({message: "Invalid signature"});
        }

        const orderId = vnp_Params["vnp_OrderInfo"];
        const transactionStatus = vnp_Params["vnp_ResponseCode"];

        if (transactionStatus === "00") {
            await Order.findByIdAndUpdate(orderId, {status: "Processing", isPaid: true});
            await Payment.findOneAndUpdate({order: orderId}, {status: "Completed"});
            return res.redirect(`http://localhost:5173/payment-result?status=success&orderId=${orderId}&message=Payment%20Successful`);
        } else {
            return res.redirect(`http://localhost:5173/payment-result?status=failed&orderId=${orderId}&message=Payment%20Failed`);
        }
    } catch (error) {
        res.redirect(`http://localhost:5173/payment-result?status=error&message=${encodeURIComponent(error.message)}`);

    }
};

