const router = require("express").Router();

const CarModel = require("../models/Car.model");

// const { isAuthenticated } = require("../middleware/jwt.middleware");

// post route to create a new booking
router.post("/", async (req,res) => {
    try {
       const newCar = await CarModel.create(req.body);
            res.status(201).json(newCar);
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// route to find and update a booking by Id
router.put("/:carId", async (req, res) => {
    const { carId } = req.params;
    try {
        const updatedCar = await CarModel.findByIdAndUpdate(carId, req.body, { new: true, });
        if (!updatedCar) {
            res.status(404).json({ errorMessage: "Car not found" });
        } else {
            res.status(200).json({message: "updated car", updatedCar });
        }

    } catch (err) {
        res.status(500).json({errorMessage: "Internal server error" });
        console.log("car not found");
    }
});

// route to delete a booking

router.delete("/:carId", async (req, res) => {
    try{
        const deletedHome = await CarModel.findByIdAndDelete(req.params.carId);
        console.log("car deleted", deletedCar);
        if (!deletedHome) {
            res.status(404).json({ message: "Car not found" });
           
        } else {
            res.status(204).send();
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(err)
    }
})

router.get("/allcars", async  (req, res) =>{
    try{
        const allcars = await CarModel.find();
        res.status(200).json(allcars)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "internal server error", err})
    }
})

// route to find a booking by an Id

router.get("/:carId", async (req, res) => {
    try {
        const carId = req.params.carId;
        const car = await CarModel.findById(carId);
        if(!car){
            res.status(400).json({ message: "Car not found"});
        }
        else {
            res.status(200).json(car);
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error", error: err.message});
    }
})


module.exports = router;