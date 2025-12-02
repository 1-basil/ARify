import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/usermodel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const exsistingUser = await UserModel.findOne({ email });
        if (exsistingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const User = new UserModel({ username, email, password: hashedPassword });
        await User.save();

        const token = jwt.sign({ userId: User._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Send email but DO NOT FAIL signup if email fails
        try {
            await transporter.sendMail({
                from: process.env.SMTP_EMAIL,
                to: email,
                subject: 'Welcome to Our Website',
                text: `Hello ${username}, Thank you for registering!`
            });

            return res.status(201).json({
                success: true,
                message: "User created successfully and welcome email sent"
            });

        } catch (emailError) {
            console.error("Email error:", emailError.message);

            return res.status(201).json({
                success: true,
                message: "User created successfully (email sending failed)"
            });
        }

    } catch (error) {
        return res.status(400).json({ success: false, message: "User is not created" });
    }
};

export const login = async (req, res) => {
    const { email,password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "could not find user" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'  // Ensure cookie is available for all routes
});

        return res.status(200).json({ message: "Login successful" });
    } catch (error) {
        return res.status(400).json({ message: "Login failed" });

    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        res.success = true;
        return res.status(200).json({ message: "Logout successful" });
        

    } catch (error) {
        return res.status(400).json({ message: "Logout failed" });
    }
}


export const sendVerifyOtp = async (req, res) => {
    try {
        
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (user.isAccountVerified) {
            return res.status(400).json({ message: "Account already verified" });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpTime = Date.now() + 10 * 60 * 1000;
        user.verifyOtp = otp.toString();
        user.verifyOtpExpTime = otpExpTime;
        await user.save();
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: user.email,
            subject: 'Your Account Verification OTP',
            text: `Hello ${user.username},\n\nYour OTP for account verification is: ${otp}\nThis OTP is valid for 10 minutes.\n\nBest regards,\nThe Team Code Ninjas`
        };
        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent successfully" });

    } catch (error) {
        console.error("OTP Email Error:", error);
        res.json({ message: "Failed to send OTP" });
    }
}


export const verifyEmail = async (req, res) => {
  try {
    const { otp } = req.body;
    const userId = req.userId; // make sure this comes from auth middleware

    if (!userId || !otp) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("OTP from request:", otp);
    console.log("Stored OTP in DB:", user.verifyOtp);

    // Check if OTP exists and matches
    if (!user.verifyOtp || String(user.verifyOtp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (user.verifyOtpExpTime && Date.now() > Number(user.verifyOtpExpTime)) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Mark account as verified and clear OTP
    user.isAccountVerified = true;
    user.verifyOtp = null;
    user.verifyOtpExpTime = null;
    await user.save();

    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ message: "Email verification failed" });
  }
}; 



// Check if user is authenticated
export const isAuthenticated = async (req,res) => {    
    try {
        return res.json({ success: true });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const SendPasswordResetOtp = async (req, res) => {
    try {
        const {email} = req.body;         
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpTime = Date.now() + 10 * 60 * 1000;
        user.resetOtp = otp.toString();
        user.resetOtpExpTime = otpExpTime;
        await user.save();
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: user.email,
            subject: 'Your Account Verification OTP',
            text: `Hello ${user.username},\n\nYour OTP for account password reset is: ${otp}\nThis OTP is valid for 10 minutes.\n\nBest regards,\nThe Team Code Ninjas`
        };
        await transporter.sendMail(mailOptions);
        res.json({ message: "pass reset OTP sent successfully" });

    } catch (error) {
        console.error("OTP Email Error:", error);
        res.json({ message: "Failed to pass reset OTP" });
    }
}


export const passwordReset= async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;       
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (!user.resetOtp || String(user.resetOtp) !== String(otp)) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (user.resetOtpExpTime && Date.now() > Number(user.resetOtpExpTime)) {
            return res.status(400).json({ message: "OTP expired" });
        }   
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = null;
        user.resetOtpExpTime = null;
        await user.save();
        return res.status(200).json({ message: "Password reset successful" });
    }   
    catch (error) {
        console.error("Password reset error:", error);
        return res.status(500).json({ message: "Password reset failed" });
    }
};