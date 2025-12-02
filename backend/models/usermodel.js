import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpTime: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpTime: { type: Number, default: 0 },
});

// Correct model initialization
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;