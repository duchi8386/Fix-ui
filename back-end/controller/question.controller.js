const Question = require("../model/question.model");

exports.getQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({
            status: 500,
            error: error.message,
            localDate: new Date()
        })
    }
}
