const mongoose = require('mongoose');

let TaskSchema = new mongoose.Schema({
    key: String,
    // project: Project,
    title: String,
    description: String,
    type: String,
    status: String,
    priority: String,
    version: String,
    labels: [{
        color: String,
        title: String
    }],
    assignees: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: String
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    timeTracking: {
        estimated: Number,
        spent: Number
    },
    dueAt: Number,
    timestamps: {
        createdAt: Number,
        updatedAt: Number
    }
});

module.exports = mongoose.model('Task', TaskSchema);
