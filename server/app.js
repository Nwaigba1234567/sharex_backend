const express = require("express");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.ORIGIN || "http://localhost:3000";
const connection = process.env.connection || "mongodb://127.0.0.1:27017/shareX";

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
  })
);

// Connect to MongoDB
mongoose
  .connect(connection)
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));

// Models
const carModel = require("./models/Car.model");

// Routes
const authroutes = require("./routes/auth.routes");
app.use('/auth', authroutes);

const userRoute = require("./routes/user.routes");
app.use('/user', userRoute);

const carRoute = require("./routes/car.routes");
app.use('/car', carRoute);

// Our first route
app.get('/', (request, response, next) => {
  console.log(request);
  response.send('<h1>Welcome to ShareX Car rental. :)</h1>');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
