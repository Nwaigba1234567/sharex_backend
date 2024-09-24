
const express = require("express");
const logger = require("morgan");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");


const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";
const connection = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/shareX";

// Initialize Express app
const app = express();

// Middleware
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: [FRONTEND_URL],
    credentials: true // if you're using cookies or sessions
  })
);

// Connect to MongoDB
mongoose
  .connect(connection)
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));

// Models
const CarModel = require("./models/Car.model");
// Remove this line as we're no longer using a separate Review model
// const ReviewModel = require("./models/Review.model");

// Routes
const authRoutes = require("./routes/auth.routes");
app.use('/auth', authRoutes);

const userRoute = require("./routes/user.routes");
app.use('/user', userRoute);

const carRoute = require("./routes/car.routes");
app.use('/car', carRoute);

// Update this to use the car routes for reviews
// const reviewRoute = require("./routes/review.routes");
// app.use('/review', reviewRoute)

// Our first route
app.get('/', (request, response, next) => {
  response.send("Welcome to ShareX Car rental");
});

// Not found handler
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export for testing purposes