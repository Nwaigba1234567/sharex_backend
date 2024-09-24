// const router = require("express").Router();

// const UserModel = require("../models/User.model");
// const { isAuthenticated } = require("../middleware/jwt.middleware");
// const uploader = require("../middleware/cloudinary.config");


// router.get("/", isAuthenticated, async (req, res) => {
//     try {
//         const userId = req.params.id;
//         const user = await UserModel.findById(userId);
//         if(!user){
//             res.status(404).json({ message: "User not found"});
//         }
//         else {
//             res.status(200).json({ message: "User found"});
//         }

//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: "Server error", error: err.message});
//     }
// })
// module.exports = router;


const router = require("express").Router();
const UserModel = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const uploader = require("../middleware/cloudinary.config");

// Get user profile
router.get("/profile", isAuthenticated, async (req, res) => {
    try {
        const userId = req.payload._id; // Assuming JWT middleware adds user info to req.payload
        const user = await UserModel.findById(userId).select('-password'); // Exclude password from the result
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Update user profile
router.put("/profile", isAuthenticated, async (req, res) => {
    try {
        const userId = req.payload._id;
        const updates = req.body;
        const updatedUser = await UserModel.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error updating profile", error: err.message });
    }
});

// Upload profile picture
router.post("/profile-picture", isAuthenticated, uploader.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const userId = req.payload._id;
        const updatedUser = await UserModel.findByIdAndUpdate(userId, { profilePicture: req.file.path }, { new: true }).select('-password');
        res.status(200).json({ message: "Profile picture updated", user: updatedUser });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error uploading profile picture", error: err.message });
    }
});

module.exports = router;