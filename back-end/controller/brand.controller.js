const Brand = require("../model/brand.model");

exports.getAllBrands = async (req, res) => {
    try {
        const brandList = await Brand.find();
        return res.status(200).json({
            status: 200,
            message: "Successfully retrieved brands",
            data: brandList,
            localDate: new Date(),
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: error.message,
            localDate: new Date(),
        })
    }

}

exports.createBrand = async (req, res) => {
    try {
        const {name, description} = req.body;

        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            res.status(400).json({
                status: 400,
                message: 'Brand already exists',
                localDate: new Date(),
            });
        }

        const newBrand = new Brand({name, description});
        await newBrand.save();
        res.status(201).json({
            status: 201,
            message: "Successfully create brand",
            localDate: new Date(),
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            localDate: new Date(),
        })
    }
}