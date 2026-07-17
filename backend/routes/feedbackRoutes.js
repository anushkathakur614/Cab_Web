const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const transporter = require("../config/mail")

// Submit Feedback
router.post("/create", async (req, res) => {

    const {
        name,
        email,
        rating,
        emoji,
        message
    } = req.body;

    const { data, error } = await supabase
        .from("feedback")
        .insert([
            {
                name,
                email,
                rating,
                emoji,
                message
            }
        ])
        .select();

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: "⭐ New Customer Feedback",
    html: `
        <h2>New Customer Feedback Received</h2>

        <p><b>Name:</b> ${name}</p>
        <p><b>Rating:</b> ${rating} ⭐</p>
        <p><b>Mood:</b> ${emoji}</p>
        <p><b>Feedback:</b></p>
        <p>${message}</p>

        <hr>

        <p>Submitted on: ${new Date().toLocaleString()}</p>
    `
});
    res.json({
        success: true,
        message: "Feedback Submitted Successfully",
        data
    });

});
// Get All Feedback (Admin)

router.get("/", async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("feedback")
            .select("*")
            .order("id", { ascending: false });

        if (error) {

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }

        res.json(data);

    }

    catch(err){

        res.status(500).json({
            success:false,
            message:err.message
        });

    }

});
module.exports = router;