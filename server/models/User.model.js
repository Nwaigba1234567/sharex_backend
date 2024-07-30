const { Schema, model } = require("mongoose");

const userSchema = new Schema ({
    title: {
        type: String,
        enum: ["Mr", "Mrs", "Ms", "Dr", "Prof"], 
        match: /^[A-Za-z -]*$/, 
     },
     firstName: {
        type: String,
        minLength: 1,
        maxLength: 54,
        match: /^[A-Za-z \p{Han}\p{Katakana}\p{Hiragana}\p{Hangul}-]*$/,
     },
     lastName: {
        type: String,
        minLength: 1,
        maxLength: 57,
        match: /^[A-Za-z \p{Han}\p{Katakana}\p{Hiragana}\p{Hangul}-]*$/,
     },
     userName: { 
        type: String 
    },
    email: {
        type: String,
        unique:true,
        required:true
        },
    password: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    imageUrl: {
        type: String
    }
});

const UserModel = model("User", userSchema);
module.exports = UserModel;