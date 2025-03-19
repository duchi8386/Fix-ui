const Quiz = require("../model/quiz.model");
const User = require("../model/user.model");
const Result = require("../model/result.model");
const SkincareRoutine = require("../model/skincare-routine.model");
const SkinType = require("../model/skin-type.model");

exports.getQuizWithQuestion = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json(
                {
                    status: 400,
                    message: "User not found",
                    localDate: new Date(),
                }
            );
        }

        if (user.skinType) {
            res.status(400).json({
                status: 400,
                message: "You have done quiz for getting skincare routine",
                localDate: new Date(),
            })
        }
        const quiz = await Quiz.findOne().populate("questions");
        if (!quiz) {
            return res.status(404).json({
                status: 404,
                message: "Quiz not found",
                localDate: new Date(),
            })
        }
        res.status(200).json({
            status: 200,
            data: quiz,
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

exports.submitQuiz = async (req, res) => {
    try {
        const {quizId, answers} = req.body;
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            res.status(400).json({
                status: 400,
                message: "User not found",
                localDate: new Date(),
            });
        }

        if (user.skinType) {
            res.status(400).json({
                status: 400,
                message: "You have done quiz for getting skincare routine",
                localDate: new Date(),
            })
        }

        const scoreMap = {oily: 0, dry: 0, combination: 0, normal: 0};
        answers.forEach((answer) => {
            Object.keys(answer.score).forEach(type => {
                scoreMap[type] += answer.score[type];
            });
        });

        const skinType = Object.keys(scoreMap).reduce((a, b) => (scoreMap[a] > scoreMap[b] ? a : b));
        console.log(skinType);
        const skinTypeDoc = await SkinType.findOne({type: skinType});
        console.log(skinTypeDoc);
        const skincareRoutine = await SkincareRoutine.findOne({skinType: skinTypeDoc._id});
        console.log(skincareRoutine);
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { skinType: skinTypeDoc._id },
            { new: true, runValidators: true }
        );
        if(!updatedUser){
            res.status(404).json({
                status: 404,
                message: "User not found",
                localDate: new Date(),
            })
        }
        const result = new Result(
            {
                user: user.id,
                quiz: quizId,
                skinType,
                score: scoreMap[skinType],
                recommendedRoutine: skincareRoutine?._id,
            }
        );
        await result.save();

        res.status(200).json({
            status: 200,
            data: {
                skinType,
                recommendedRoutine: skincareRoutine,
            },
            message: "Successfully",
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