const mongoose = require('mongoose');

let TaskSchema = new mongoose.Schema({
    updated_ad: Date,
    created_ad: Date,
    title: String,
    description: String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Task', TaskSchema);
