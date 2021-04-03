const mongoose = require('mongoose');
const validator = require('validator');

const { Schema } = mongose; 
const userSchema = Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

