const router = require("express").Router();
const CarModel = require("../models/Car.model");

// Post route to create a new car
router.post("/car", async (req, res) => {
   
    try {
        const newCar = await CarModel.create(req.body);
        console.log("Request body:", req.body);
        res.status(201).json(newCar);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error creating car", error: err.message });
    }
});

// Route to find and update a car by Id
router.put("/:carId", async (req, res) => {
    const { carId } = req.params;
    try {
        const updatedCar = await CarModel.findByIdAndUpdate(carId, req.body, { new: true, runValidators: true });
        if (!updatedCar) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.status(200).json({ message: "Car updated", car: updatedCar });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error updating car", error: err.message });
    }
});

// Route to delete a car
router.delete("/:carId", async (req, res) => {
    try {
        const deletedCar = await CarModel.findByIdAndDelete(req.params.carId);
        if (!deletedCar) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.status(200).json({ message: "Car deleted successfully", car: deletedCar });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error deleting car", error: err.message });
    }
});

// Route to get all cars
router.get("/allcars", async (req, res) => {
    try {
        const allCars = await CarModel.find();
        res.status(200).json(allCars);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching cars", error: err.message });
    }
});

// Route to find a car by an Id
router.get("/:carId", async (req, res) => {
    try {
        const car = await CarModel.findById(req.params.carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.status(200).json(car);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error fetching car", error: err.message });
    }
});

// Route to add a review to a car
router.post("/reviews", async (req, res) => {
    try {
        const car = await CarModel.findById(req.params.carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        
        const newReview = {
            user: req.body.userId, // Assuming you're sending the user ID in the request
            name: req.body.userName,
            rating: req.body.rating,
            comment: req.body.comment
        };
        
        car.reviews.push(newReview);
        car.calculateAverageRating();
        await car.save();
        
        res.status(201).json({ message: "Review added successfully", car });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error adding review", error: err.message });
    }
});

// Post route to create or update a review for a specific car
router.post("/car/review", async (req, res) => {
    try {
        const { rating, comment, carId } = req.body;

        // Find the car by ID
        const car = await CarModel.findById(carId);
        console.log("Car found:", car);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }

        const review = {
            user: req.user._id, // Assuming you have user information in req.user
            name: req.user.name,
            rating: Number(rating),
            comment
        };

        const isReviewed = car.reviews.find(
            r => r.user.toString() === req.user._id.toString()
        );

        if (isReviewed) {
            // Update existing review
            car.reviews.forEach(rev => {
                if (rev.user.toString() === req.user._id.toString()) {
                    rev.comment = comment;
                    rev.rating = rating;
                }
            });
        } else {
            // Add new review
            car.reviews.push(review);
        }

        // Recalculate average rating
        car.calculateAverageRating();

        await car.save();

        res.status(200).json({
            success: true,
            message: "Review added/updated successfully",
            car
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating/updating review", error });
    }
});

// Get all reviews for a specific car
router.get('/car/:carId', async (req, res) => {
    try {
        const car = await Car.findById(req.params.carId);
        if (!car) {
            return res.status(404).json({ message: "Car not found" });
        }
        res.json(car.reviews);
    } catch (error) {
        console.log("Error while fetching reviews", error);
        res.status(500).json({ message: "Failed to retrieve reviews", error });
    }
});

module.exports = router;