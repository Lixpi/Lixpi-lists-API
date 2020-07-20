const _ = require('lodash')
const bcrypt = require('bcrypt')

const Promise = require('bluebird')
const bcryptB = Promise.promisifyAll(require('bcrypt'))

const Sequelize = require('sequelize')
const sequelize = require('../db/sequelize')
const { knex } = require('../db/knex')

//---------------------- Bookshelf ----------------------//

const User = {
    tableName: 'users',
    create: Promise.method((username, password) => {
        console.log('this')
        console.log(this)
        const salt = bcrypt.genSaltSync(10)
        const passwordHash = bcrypt.hashSync(password, salt)
        return knex(this.User.tableName).insert({username, password: passwordHash})
        // return new this.User.forge({ username: _.trim(username), password: passwordHash}).save().then((user) => {
        //     console.log('user model')
        //     console.log(user)
        //     //...
        // })
    }),
    login: Promise.method((username, password) => {
        // return new this.User({username})
        //     .fetch()
        //     .tap((user) => {
        //         return bcryptB.compareAsync(password, user.get('password'))
        //             .then((valid) => {
        //                 if (!valid) throw new Error('Invalid password')
        //             })
        //     })
    })
}


// const UserB = bookshelf.model('User', {
//     tableName: 'users',
// }, {
//     login: Promise.method((username, password) => {
//         return new this.UserB({username})
//             .fetch()
//             .tap((user) => {
//                 return bcryptB.compareAsync(password, user.get('password'))
//                     .then((valid) => {
//                         if (!valid) throw new Error('Invalid password')
//                     })
//             })
//     })
// })

//---------------------- Sequelize ----------------------//

// const mappings = {
//     id: {
//         type: Sequelize.UUID,
//         primaryKey: true,
//         defaultValue: Sequelize.DataTypes.UUIDV4,
//     },
//     username: {
//         type: Sequelize.TEXT,
//         allowNull: false,
//     },
//     password: {
//         type: Sequelize.TEXT,
//         allowNull: false,
//     },
// }

// const User = sequelize.define('User', mappings, {
//     indexes: [
//         {
//             name: 'user_username_index',
//             method: 'BTREE',
//             fields: ['username'],
//         },
//     ],
//     underscored: true
// })

// User.prototype.comparePassword = function (password) { // eslint-disable-line func-names
//     return Promise.resolve()
//         .then(() => bcrypt.compareSync(password, this.password))
//         .catch((err) => {
//             return err
//         })
// }

// User.beforeSave((user) => {
//     user.username = _.trim(user.username)

//     if ((user.previous('password') !== user.password) && (!_.isEmpty(user.password))) {
//         const salt = bcrypt.genSaltSync(10)
//         const hash = bcrypt.hashSync(user.password, salt)
//         user.password = hash
//     }

//     return user
// })

// exports.User = User
exports.User = User
