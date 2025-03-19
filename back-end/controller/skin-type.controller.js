const SkinType = require("../model/skin-type.model");
const res = require("express/lib/response");

exports.getSkinTypes = async (req, res) => {
    try {
        const skinTypes = await SkinType.find();
        res.status(200).json({
            status: 200,
            data: skinTypes,
            message: "Successfully",
            localDate: new Date(),
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: error.message,
            localDate: new Date(),
        })
    }
}