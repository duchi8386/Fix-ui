const Brand = require("../model/brand.model");
const Product = require("../model/product.model"); // Ensure Product model is imported

// Get all brands
exports.getAllBrands = async (req, res) => {
  try {
    const brandList = await Brand.find();
    const brandsWithProductCount = await Promise.all(
      brandList.map(async (brand) => {
        const productCount = await Product.countDocuments({ brand: brand._id });
        return { ...brand.toObject(), productCount };
      })
    );

    return res.status(200).json({
      status: 200,
      message: "Successfully retrieved brands",
      data: brandsWithProductCount,
      localDate: new Date(),
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      localDate: new Date(),
    });
  }
};

// Create a new brand
exports.createBrand = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({
        status: 400,
        message: "Brand already exists",
        localDate: new Date(),
      });
    }

    const newBrand = new Brand({ name, description });
    await newBrand.save();
    return res.status(201).json({
      status: 201,
      message: "Successfully created brand",
      data: newBrand,
      localDate: new Date(),
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      localDate: new Date(),
    });
  }
};

// Update a brand
exports.updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedBrand = await Brand.findByIdAndUpdate(
      id,
      { name, description },
      { new: true } // Return the updated document
    );

    if (!updatedBrand) {
      return res.status(404).json({
        status: 404,
        message: "Brand not found",
        localDate: new Date(),
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Successfully updated brand",
      data: updatedBrand,
      localDate: new Date(),
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: error.message,
      localDate: new Date(),
    });
  }
};

// Delete a brand
exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the brand has associated products
    const hasProducts = await Product.findOne({ brand: id });
    if (hasProducts) {
      return res.status(400).json({
        status: 400,
        message: "Không thể xóa thương hiệu vì đang có sản phẩm liên kết.",
      });
    }

    // Delete the brand
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) {
      return res.status(404).json({
        status: 404,
        message: "Thương hiệu không tồn tại.",
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Xóa thương hiệu thành công.",
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
