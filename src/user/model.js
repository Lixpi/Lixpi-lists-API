const _ = require('lodash')
const bcrypt = require('bcrypt')
const Promise = require('bluebird')

const Sequelize = require('sequelize')
const sequelize = require('../db/sequelize')
const bookshelf = require('../db/bookshelf')

//---------------------- Bookshelf ----------------------//

const UserB = bookshelf.model('User', {
    tableName: 'users',
}, {
    login: Promise.method((username, password) => {
        return new this({username})
            .fetch()
            .tap((user) => {
                return bcrypt.compareAsync(password, user.get('password'))
                    .then((valid) => {
                        if (!valid) throw new Error('Invalid password')
                    })
            })
    })
})

//---------------------- Sequelize ----------------------//

const mappings = {
    id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
    },
    username: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    password: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
}

const User = sequelize.define('User', mappings, {
    indexes: [
        {
            name: 'user_username_index',
            method: 'BTREE',
            fields: ['username'],
        },
    ],
    underscored: true
})

User.prototype.comparePassword = function (password) { // eslint-disable-line func-names
    return Promise.resolve()
        .then(() => bcrypt.compareSync(password, this.password))
        .catch((err) => {
            return err
        })
}

User.beforeSave((user) => {
    user.username = _.trim(user.username)

    if ((user.previous('password') !== user.password) && (!_.isEmpty(user.password))) {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
    }

    return user
})

exports.User = User
exports.UserB = UserB
