const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const uploader = require('../middleware/cloudinary.config');

// Signup
router.post('/signup', uploader.single("imageUrl"), async (req, res, next) => {
    console.log('file is: ', req.file);

    try {
        if (req.file) {
            console.log('File uploaded:', req.file);
        } else {
            console.log('No file uploaded');
        }

        const { title, firstName, lastName, userName, email, password } = req.body;

        if (!title || !firstName || !lastName || !userName || !email || !password) {
            return res.status(400).json({ message: "Provide title, firstName, lastName, userName, email, and password" });
        }

        // Use regex to validate the email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Provide a valid email address." });
        }

        // Use regex to validate the password format
        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter." });
        }

        const foundUser = await UserModel.findOne({ email });
        if (foundUser) {
            return res.status(400).json({ message: "Email already taken" });
        }

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const hashedUser = { 
            ...req.body,
            password: hashedPassword,
            imageUrl: req.file ? req.file.path : undefined,
        };

        const createdUser = await UserModel.create(hashedUser);
        console.log("User created", createdUser);
        res.status(201).json(createdUser);

    } catch (err) {
        console.error("Internal server error", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = await UserModel.findOne({ email });
        if (!foundUser) {
            return res.status(400).json({ message: "No user with this email found" });
        }

        const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
        if (!passwordCorrect) {
            return res.status(400).json({ message: "Incorrect password!" });
        }

        const { _id, userName } = foundUser;
        const payload = { _id, email, userName };

        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { 
            algorithm: 'HS256', 
            expiresIn: "6h", 
        });

        res.status(200).json({ authToken });

    } catch (err) {
        console.error("Login error", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Verify
router.get("/verify", isAuthenticated, (req, res) => {
    console.log("verify route", req.payload);
    res.status(200).json(req.payload);
});

module.exports = router;