const SkincareRoutine = require('../model/skincare-routine.model');
const mongoose = require("mongoose");

exports.getSkincareRoutineList = async (req, res) => {
    try {
        const routines = await SkincareRoutine.find()
            .populate("skinType")
            .populate({
                path: "steps.product",
                model: "Product"
            });
        console.log(routines);
        res.status(200).json({
            status: 200,
            message: "successfully",
            data: routines,
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

exports.addProductToSkincareRoutine = async (req, res) => {
    const {routineId, stepNumber} = req.params;
    const {productId} = req.body;

    try {
        const routine = await SkincareRoutine.findById(routineId);
        if(!routine) {
            res.status(400).json({
                status: 400,
                message: "Skincare Routine not found",
                localDate: new Date(),
            })
        }
        const step = routine.steps.find(step => step.stepNumber === parseInt(stepNumber));
        if(!step) {
            res.status(400).json({
                status: 400,
                message: "Step does not exist in this skincare routine",
                localDate: new Date(),
            })
        }
        step.product = new mongoose.Types.ObjectId(productId);
        await routine.save();

        res.status(201).json({
            status: 201,
            message: "Product have been save to skincare routine",
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