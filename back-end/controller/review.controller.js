const Review = require("../model/review.model");
const Product = require("../model/product.model");
const Order = require("../model/order.model");
const mongoose = require("mongoose");

exports.createReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const userId = req.user.userId;

        // Kiểm tra sản phẩm có tồn tại không
        const existedProduct = await Product.findById(productId);
        if (!existedProduct) {
            return res.status(400).json({
                status: 400,
                message: "Product not found",
                localDate: new Date(),
            });
        }

        // Kiểm tra người dùng đã từng mua sản phẩm này chưa
        const hasPurchased = await Order.findOne({
            user: new mongoose.Types.ObjectId(userId),
            products: {
                $elemMatch: { product: new mongoose.Types.ObjectId(existedProduct) }
            },
            status: { $in: ["Pending", "Processing", "Shipped", "Completed", "Cancelled"] }
        });

        console.log(hasPurchased);

        if (!hasPurchased) {
            return res.status(400).json({
                status: 400,
                message: "You must purchase this product before reviewing",
                localDate: new Date(),
            });
        }

        // Kiểm tra người dùng đã review sản phẩm này chưa
        const existingReview = await Review.findOne({ user: userId, product: productId });

        if (existingReview) {
            return res.status(400).json({
                status: 400,
                message: "You have already reviewed this product",
                localDate: new Date(),
            });
        }

        // Tạo review mới
        const newReview = new Review({
            user: userId,
            product: productId,
            rating,
            comment,
        });

        await newReview.save();

        res.status(201).json({
            status: 201,
            message: "Create review successfully",
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


exports.getReviewsByProductId = async (req, res) => {
    try {
        const { productId } = req.params;

        const existedProduct = await Product.findById(productId);
        if (!existedProduct) {
            return res.status(404).json({
                status: 404,
                message: "Product not found",
                localDate: new Date(),
            });
        }

        const reviews = await Review.find({ product: productId })
            .populate("user", "fullName email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            status: 200,
            message: "Reviews retrieved successfully",
            data: reviews,
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


exports.getAllReviews = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const filter = {};

        if (search) {
            filter.$or = [
                { "user.fullName": { $regex: search, $options: "i" } },
                { "product.name": { $regex: search, $options: "i" } }
            ];
        }

        const reviews = await Review.find()
            .populate("user", "fullName")  // Lấy tên người dùng
            .populate("product", "name")   // Lấy tên sản phẩm
            .then((data) => {
                return data.filter((review) => {
                    if (!search) return true;
                    return (
                        review.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
                        review.product?.name?.toLowerCase().includes(search.toLowerCase())
                    );
                });
            });

        // Áp dụng phân trang
        const totalReviews = reviews.length;
        const paginatedReviews = reviews.slice((page - 1) * limit, page * limit);

        res.status(200).json({
            status: 200,
            message: "Danh sách đánh giá",
            data: paginatedReviews,
            pagination: {
                totalReviews,
                totalPages: Math.ceil(totalReviews / limit),
                currentPage: parseInt(page),
                pageSize: parseInt(limit),
            }
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
};

