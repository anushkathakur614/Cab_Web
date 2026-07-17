const transporter = require("../config/mail")
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const otpStore = {};

// Register User
router.post("/register", async (req, res) => {

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password,10);

    const { data, error } = await supabase
        .from("users")
        .insert([
            {
                name,
                email,
                password:hashedPassword
            }
        ]);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    res.json({
        success: true,
        message: "Registration Successful",
        data
    });

});


// Login User
router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (error || !data) {
        return res.status(400).json({
            success: false,
            message: "User not found"
        });
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid Password"
        });
    }

    res.json({
        success: true,
        message: "Login Successful",
        user: {
            id: data.id,
            name: data.name,
            email: data.email
        }
    });

});
//Send OTP
router.post("/send-otp", async (req, res) => {

    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = otp;

    try {

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Cab Booking Password Reset OTP",
            text: `Your OTP is: ${otp}`,
        });

        res.json({
            success: true,
            message: "OTP Sent Successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

//Verify OTP

router.post("/verify-otp", async (req, res) => {

    const { email, otp } = req.body;

    if (otpStore[email] == otp) {

        res.json({
            success: true,
            message: "OTP Verified Successfully"
        });

    } else {

        res.status(400).json({
            success: false,
            message: "Invalid OTP"
        });

    }

});

//Reset Password

router.post("/reset-password", async (req, res) => {

    const { email, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error } = await supabase
        .from("users")
        .update({
            password: hashedPassword
        })
        .eq("email", email);

    if (error) {

        return res.status(400).json({
            success: false,
            message: error.message
        });

    }

    delete otpStore[email];

    res.json({
        success: true,
        message: "Password Reset Successfully"
    });

});

module.exports = router;
