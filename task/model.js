const _ = require('lodash');
const Sequelize = require('sequelize');

const sequelize = require('../db/sequelize-singleton');
const { Label } = require('../label/model');

const mappings = {
    key: {
        type: Sequelize.TEXT,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    // type: {
    //     type: Sequelize.TEXT,
    //     allowNull: false,
    // },
    // status: {
    //     type: Sequelize.TEXT,
    //     allowNull: false,
    // },
    // priority: {
    //     type: Sequelize.TEXT,
    //     allowNull: false,
    // },
    // version: {
    //     type: Sequelize.TEXT,
    //     allowNull: true,
    // },
};

const Task = sequelize.define('Task', mappings, {
    indexes: [
        {
            name: 'task_title_index',
            method: 'BTREE',
            fields: ['title'],
        },
    ],
});

const TaskLabel = Task.hasMany(Label, { as: 'labels' });

exports.TaskLabel = TaskLabel;
exports.Task = Task;

// let TaskSchema = new mongoose.Schema({
//     key: String,
//     // project: Project,
//     title: String,
//     description: String,
//     type: String,
//     status: String,
//     priority: String,
//     version: String,
//     labels: [{
//         color: String,
//         title: String
//     }],
//     assignees: [{
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User'
//         },
//         role: String
//     }],
//     author: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     },
//     timeTracking: {
//         estimated: Number,
//         spent: Number
//     },
//     dueAt: Number,
//     timestamps: {
//         createdAt: Number,
//         updatedAt: Number
//     }
// });

// module.exports = mongoose.model('Task', TaskSchema);
