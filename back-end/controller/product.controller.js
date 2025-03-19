const Product = require("../model/product.model");

exports.getProducts = async (req, res) => {
    try {
        const { category, skinType, page = 1, limit = 10 } = req.query;

        let filter = {};
        if (category) filter.category = category;
        if (skinType) filter.skinType = skinType;

        const totalProducts = await Product.countDocuments(filter);
        const productList = await Product.find(filter)
            .populate("skinType")
            .populate("brand", "name")
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.status(200).json({
            status: 200,
            data: productList.map(product => ({
                id: product._id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                category: product.category,
                imageUrl: product.imageUrl,
                skinType: product.skinType,
                status: product.status,
                brand: product.brand ? product.brand.name : null,
            })),
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalProducts / limit),
                totalProducts
            },
            message: "Successfully retrieved products",
            localDate: new Date()
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            localDate: new Date()
        });
    }
};


exports.createProduct = async (req, res) => {
    try {
        const {name, description, price, category, ingredients, skinType, stock, brand} = req.body;
        if (!req.file) {
            res.status(400).json({
                status: 400,
                message: 'Please upload a file',
                localDate: new Date()
            });
        }

        const imageUrl = req.file.path;

        const newProduct = new Product({
            name,
            description,
            price,
            category,
            ingredients: ingredients ? ingredients.split(",") : [],
            skinType,
            stock,
            imageUrl,
            brand
        });

        await newProduct.save();

        res.status(201).json(
            {
                status: 201,
                message: "Created Product Successfully",
                localDate: new Date()
            }
        );
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            localDate: new Date()
        })
    }
}

exports.getProductDetail = async (req, res) => {
    try {
        const {id} = req.params;

        const product = await Product.findById(id).populate("brand", "name");

        if (!product) {
            return res.status(404).json({
                status: 404,
                message: "Product not found",
                localDate: new Date(),
            });
        }

        res.status(200).json({
            status: 200,
            message: "Product retrieved successfully",
            data: product,
            localDate: new Date(),
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            error: error.message,
            localDate: new Date(),
        });
    }
}

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateProductRequest = req.body;

        const existedProduct = await Product.findById(id);
        if(!existedProduct) {
            res.status(400).json({
                status: 400,
                message: "Product not found",
                localDate: new Date()
            });
        }

        if(req.file) {
            updateProductRequest.image = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, updateProductRequest, {
            new: true,
            runValidators: true
        });
        res.status(201).json({
            status: 201,
            message: "Update Product Successfully",
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

exports.toggleProductStatus = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(400).json({
            status: 400,
            message: "Không tìm thấy sản phẩm",
            localDate: new Date()
        });

        // Đảo trạng thái sản phẩm
        product.status = product.status === "active" ? "inactive" : "active";
        await product.save();

        res.status(200).json({ 
            status: 200,
            message: "Cập nhật trạng thái sản phẩm thành công",
            localDate: new Date()
        });
    } catch (error) {
        res.status(500).json({
            status: 500, 
            message: error.message, 
            localDate: new Date()    
        });
    }
};

exports.getActiveProductForUser = async (req, res) => {
    try {
        const { category, skinType, page = 1, limit = 10 } = req.query;

        // Xây dựng bộ lọc
        let filter = { status: "active" };
        if (category) filter.category = category;
        if (skinType) filter.skinType = skinType;

        // Tính toán phân trang
        const skip = (page - 1) * limit;

        // Truy vấn danh sách sản phẩm
        const activeProducts = await Product.find(filter)
            .populate("brand", "name")
            .sort({ createdAt: -1 }) // Sắp xếp mới nhất trước
            .skip(skip)
            .limit(parseInt(limit));

        // Trả về kết quả
        res.status(200).json({
            status: 200,
            data: activeProducts.map(product => ({
                id: product._id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                category: product.category,
                imageUrl: product.imageUrl,
                brand: product.brand ? product.brand.name : null,
                skinType: product.skinType
            })),
            message: "Successfully retrieved products",
            total: await Product.countDocuments(filter), 
            page: parseInt(page),
            limit: parseInt(limit),
            localDate: new Date()
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



