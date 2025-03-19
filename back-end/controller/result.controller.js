const Result = require("../model/result.model");

exports.getQuizResults = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(400).json({
                status: 400,
                message: "User ID is missing in request",
                localDate: new Date(),
            });
        }

        const result = await Result.findOne({ user: userId })
            .populate("quiz", "title description") // Lấy thông tin quiz
            .populate({
                path: "recommendedRoutine",
                populate: {
                    path: "steps.product",
                    model: "Product" // Lấy thông tin chi tiết sản phẩm trong từng bước
                }
            });

        if (!result) {
            return res.status(404).json({
                status: 404,
                message: "No quiz result found for this user",
                localDate: new Date(),
            });
        }

        res.status(200).json({
            status: 200,
            data: {
                quiz: result.quiz,
                skinType: result.skinType,
                score: result.score,
                recommendedRoutine: result.recommendedRoutine, // Bao gồm đầy đủ thông tin sản phẩm
            },
            message: "Successfully retrieved quiz result",
            localDate: new Date(),
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message,
            localDate: new Date(),
        });
    }
};
