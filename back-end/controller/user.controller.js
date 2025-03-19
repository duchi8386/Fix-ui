const User = require("../model/user.model");

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (!user) {
            res.status(404).json({
                status: 400,
                message: "User not found",
                localDate: new Date()
            });
        }
        res.status(200).json({
            status: 200,
            data: user,
            localDate: new Date()
        })
    } catch(error) {
        res.status(500).send({
            status: 500,
            message: error.message,
            localDate: new Date()
        })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const { email, status, page = 1, limit = 10 } = req.query;

        const filter = { role: "USER" };

        if (email) {
            filter.email = { $regex: email, $options: "i" };
        }

        if (status) {
            filter.status = status;
        }

        const users = await User.find(filter)
            .select("-password")
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments(filter);

        res.status(200).json({
            status: 200,
            message: "User list retrieved successfully",
            data: users,
            pagination: {
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: parseInt(page),
                pageSize: parseInt(limit),
            },
            localDate: new Date(),
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message,
            localDate: new Date(),
        });
    }
};

exports.updateUserStatus = async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;
    const validStatuses = ["ACTIVE", "INACTIVE"];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { status },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        res.status(200).json({
            message: "Cập nhật trạng thái thành công",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi server",
            error: error.message,
        });
    }
};
