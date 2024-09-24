const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    title: {
        type: String,
        enum: ["Mr", "Mrs", "Ms", "Dr", "Prof"],
        match: /^[A-Za-z -]*$/,
    },
    firstName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 54,
        match: /^[A-Za-z \p{Han}\p{Katakana}\p{Hiragana}\p{Hangul}-]*$/,
    },
    lastName: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 57,
        match: /^[A-Za-z \p{Han}\p{Katakana}\p{Hiragana}\p{Hangul}-]*$/,
    },
    userName: { 
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://example.com/default-profile-picture.jpg' // Replace with your default image URL
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true // This will automatically update the createdAt and updatedAt fields
});

// Pre-save middleware to update the updatedAt field
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const UserModel = model("User", userSchema);
module.exports = UserModel;