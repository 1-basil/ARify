import UserModel from "../models/usermodel.js";

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            userData: {
                username: user.username,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                createdAt: user.createdAt,
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user profile"
        });
    }
};