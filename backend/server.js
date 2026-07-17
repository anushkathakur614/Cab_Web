require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes")
const app = express();


app.use(cors({origin:"http://127.0.0.1:5500"}));
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/booking",bookingRoutes);
app.use("/api/feedback",feedbackRoutes);

app.get("/", (req, res) => {
    res.send("Cab Booking Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});