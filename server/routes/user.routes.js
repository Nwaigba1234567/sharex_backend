const router = require("express").Router();

const UserModel = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/users/:id", isAuthenticated, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.findById(userId);
        if(!user){
            res.status(404).json({ message: "User not found"});
        }
        else {
            res.status(200).json({ message: "User found"});
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error", error: err.message});
    }
})
module.exports = router;