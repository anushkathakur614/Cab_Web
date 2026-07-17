const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");
const transporter = require("../config/mail");

// Create Booking
router.post("/create", async (req, res) => {

    const {
        bookingId,
        name,
        email,
        phone,
        pickup,
        drop,
        date,
        vehicle,
        status
    } = req.body;

    const { data, error } = await supabase
        .from("bookings")
        .insert([
            {
                bookingId,
                name,
                email,
                phone,
                pickup,
                drop,
                date,
                vehicle,
                status
            }
        ]);

    if (error) {
        console.error(error);

        return res.status(400).json({
            success: false,
            message: error.message
        });
    }


    // Driver Email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "🚖 New Cab Booking",
        html: `
        <h2>New Booking Received</h2>
        <p><b>Booking ID:</b> ${bookingId}</p>
        <p><b>Name:</b> ${name}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Pickup:</b> ${pickup}</p>
        <p><b>Drop:</b> ${drop}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Vehicle:</b> ${vehicle}</p>
        <p><b>Status:</b> ${status}</p>
    `
    });
    // Customer Confirmation Email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "✅ Booking Request Received",
        html: `
        <h2>Thank You for Booking!</h2>

        <p>Hello <b>${name}</b>,</p>

        <p>Your cab booking request has been received successfully.</p>

        <hr>

        <p><b>Booking ID:</b> ${bookingId}</p>
        <p><b>Pickup:</b> ${pickup}</p>
        <p><b>Drop:</b> ${drop}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Vehicle:</b> ${vehicle}</p>
        <p><b>Status:</b> ${status}</p>

        <hr>

        <p>Our team will contact you shortly to confirm your booking.</p>

        <h3>Thank you for choosing Thakur Tours & Travels 🚖</h3>
    `
    });

    res.json({
        success: true,
        message: "Booking Created Successfully",
        data
    });

});
// Get all bookings(admin)
router.get("/", async (req, res) => {

    try {

        const { data, error } = await supabase
            .from("bookings")
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

    catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});
// Get All Bookings
router.get("/all/:email", async (req, res) => {

    try {

        const email = req.params.email;

        console.log("Email:", email);

        const { data, error } = await supabase
            .from("bookings")
            .select("*")
            .eq("email", email)
            .order("id", { ascending: false });

        console.log("Data:", data);
        console.log("Supabase Error:", error);

        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        res.json({
            success: true,
            bookings: data
        });

    } catch (err) {

        console.log("Catch Error:", err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

});


// Cancel Booking
router.put("/cancel/:bookingId", async (req, res) => {

    const bookingId = req.params.bookingId;

    const { data, error } = await supabase
        .from("bookings")
        .update({
            status: "Cancelled"
        })
        .eq("bookingId", bookingId)
        .select();

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    // Driver Email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "❌ Booking Cancelled",
        html: `
        <h2>Booking Cancelled</h2>

        <p><b>Booking ID:</b> ${data[0].bookingId}</p>
        <p><b>Name:</b> ${data[0].name}</p>
        <p><b>Phone:</b> ${data[0].phone}</p>
        <p><b>Pickup:</b> ${data[0].pickup}</p>
        <p><b>Drop:</b> ${data[0].drop}</p>
        <p><b>Date:</b> ${data[0].date}</p>
        <p><b>Vehicle:</b> ${data[0].vehicle}</p>

        <h3 style="color:red;">Status : Cancelled</h3>
    `
    });
    // Customer Email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: data[0].email,
        subject: "Your Booking Has Been Cancelled",
        html: `
        <h2>Hello ${data[0].name},</h2>

        <p>Your booking has been cancelled successfully.</p>

        <p><b>Booking ID:</b> ${data[0].bookingId}</p>

        <p>Thank you for choosing Thakur Tours & Travels.</p>
    `
    });

    res.json({
        success: true,
        message: "Booking Cancelled Successfully",
        data
    });

});
// Get Single Booking
router.get("/:bookingId", async (req, res) => {

    const bookingId = req.params.bookingId;

    const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("bookingId", bookingId)
        .single();

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }

    res.json({
        success: true,
        booking: data
    });

});

// Update Booking
router.put("/update/:bookingId", async (req, res) => {

    const bookingId = req.params.bookingId;

    const {
        pickup,
        drop,
        date,
        vehicle
    } = req.body;

    const { data, error } = await supabase
        .from("bookings")
        .update({
            pickup,
            drop,
            date,
            vehicle
        })
        .eq("bookingId", bookingId)
        .select();

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    // Driver Email (update booking email)
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "✏️ Booking Updated",
        html: `
        <h2>Booking Updated</h2>

        <p>A customer has updated an existing booking.</p>

        <hr>

        <p><b>Booking ID:</b> ${data[0].bookingId}</p>
        <p><b>Name:</b> ${data[0].name}</p>
        <p><b>Phone:</b> ${data[0].phone}</p>
        <p><b>Pickup:</b> ${data[0].pickup}</p>
        <p><b>Drop:</b> ${data[0].drop}</p>
        <p><b>Date:</b> ${data[0].date}</p>
        <p><b>Vehicle:</b> ${data[0].vehicle}</p>

        <h3 style="color:blue;">Booking Details Updated</h3>
    `
    });
    //Customer Email(upadate booking email)
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: data[0].email,
        subject: "✅ Your Booking Has Been Updated",
        html: `
        <h2>Hello ${data[0].name},</h2>

        <p>Your booking has been updated successfully.</p>

        <hr>

        <p><b>Booking ID:</b> ${data[0].bookingId}</p>
        <p><b>Pickup:</b> ${data[0].pickup}</p>
        <p><b>Drop:</b> ${data[0].drop}</p>
        <p><b>Date:</b> ${data[0].date}</p>
        <p><b>Vehicle:</b> ${data[0].vehicle}</p>

        <hr>

        <p>Thank you for choosing Thakur Tours & Travels 🚖</p>
    `
    });

    res.json({
        success: true,
        message: "Booking Updated Successfully",
        data
    });

});

module.exports = router;