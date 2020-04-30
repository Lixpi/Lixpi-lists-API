const _ = require('lodash');
const bcrypt = require('bcrypt');
const Bluebird = require('bluebird');
const Sequelize = require('sequelize');

const sequelize = require('../db/sequelize-singleton');

const mappings = {
    userId: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    name: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    email: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
};

const User = sequelize.define('User', mappings, {
    indexes: [
        {
            name: 'user_userId_index',
            method: 'BTREE',
            fields: ['userId'],
        },
        {
            name: 'user_email_index',
            method: 'BTREE',
            fields: ['email'],
        },
    ],
});

User.prototype.comparePassword = function (password) { // eslint-disable-line func-names
    return Bluebird.resolve()
        .then(() => bcrypt.compareSync(password, this.password))
        .catch((err) => {
            console.log(err);

            return false;
        });
};

User.beforeSave((user) => {
    user.name = _.trim(user.name);

    if ((user.previous('password') !== user.password) && (!_.isEmpty(user.password))) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
    }

    return user;
});

exports.mapping = mappings;

exports.User = User;