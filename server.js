require('dotenv').config();
const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require('./config/db'); // Optional: Add DB connection logic if needed.

const app = express();
app.use(cookieParser());  // ✅ Enable cookie parsing
app.use(
    cors({
        origin: "http://localhost:5173", // ✅ Replace with your frontend URL
        credentials: true, // ✅ Required for cookies & authentication
    })
);

// Middleware
app.use(express.json());
connectDB();
// Routes
const routes = require('./routes/routes');
app.use('/api/v1', routes);
// Start the Server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
