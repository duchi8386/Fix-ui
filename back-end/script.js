const mongoose = require("mongoose");
const User = require("./model/user.model");

const MONGO_URI = "mongodb://localhost:27017/beautycare_db";

const updateUsersStatus = async () => {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

        const result = await User.updateMany(
            { status: { $exists: false } }, // Chỉ cập nhật user chưa có field status
            { $set: { status: "ACTIVE" } }
        );

        console.log(`Updated ${result.modifiedCount} users.`);
    } catch (error) {
        console.error("Error updating users:", error);
    } finally {
        await mongoose.disconnect();
    }
};

updateUsersStatus();
