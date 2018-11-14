const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    name : String,
    msg : String
});

module.exports = mongoose.model('chating',Schema);