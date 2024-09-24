const { Schema, model } = require("mongoose");

// Define the review schema
const reviewSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // name: {
  //   type: String,
  //   required: true
  // },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
   updatedAt: {
    type: Date,
    default: Date.now
  }
});

const carSchema = new Schema({
  imageUrl: { 
    type: String
  },
  name: { 
    type: String
  },
  doors: { 
    type: String
  },
  type: { 
    type: String
  },
  seat: { 
    type: String
  },
  availableUnits: { 
    type: Number
  },
  price: {
    type: String
  },
  rating: {
    type: String,
    default: 0
  },
  reviews: [reviewSchema],
  numOfReviews: {
    type: Number,
    default: 0
  },
  ratings: {
    type: Number,
    default: 0
  }
});

// Add a method to calculate average rating
carSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.ratings = 0;
  } else {
    this.ratings = this.reviews.reduce((acc, item) => item.rating + acc, 0) / this.reviews.length;
  }
  this.numOfReviews = this.reviews.length;
};

const CarModel = model("Car", carSchema);
module.exports = CarModel;