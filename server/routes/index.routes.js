const router = require("express").Router();

router.get("/", (req, res, next) => {
    res.json("Works perfectly");
});

module.exports = router;