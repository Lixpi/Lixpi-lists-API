'use strict'

const { knex } = require('../db/knex')

class Project {
    static tableName = 'projects'

    constructor(values = {}) {
        Object.assign(this, values)
    }

    static init(values) {
        return new this(values)
    }

    static async findById(id) {
        const values =  await knex(this.tableName).where({ id }).first()
        return this.init(values)
    }

    static async findByKey(key) {
        const values =  await knex(this.tableName).where({ key }).first()
        return this.init(values)
    }

    static async create(values) {

        let { key, title, description } = values

        const projectKey = key || title.slice(0, 3).toUpperCase()

        // const sequenceName = 'project_' + project.key.toLowerCase()
        // sequelize.query('CREATE SEQUENCE ' + sequenceName)

        // ProjectSequence.create({
        //     sequenceName: sequenceName,
        //     prefix: project.key,
        //     projectKey: project.key
        // })

        return knex(this.tableName).insert({key: projectKey, title, description})
    }
}

// // TODO: add afterDestroy hook and drop all sequences

module.exports = { Project }























// 'use strict'

// const Sequelize = require('sequelize')
// const { TEXT } = Sequelize

// const sequelize = require('../db/sequelize')
// const { ProjectSequence } = require('../project_sequence/model')

// const mappings = {
//     key: {
//         type: TEXT,
//         primaryKey: true,
//         allowNull: false
//     },
//     title: {
//         type: TEXT,
//         allowNull: false
//     },
//     description: {
//         type: TEXT,
//         allowNull: true
//     }
// }

// const Project = sequelize.define('Project', mappings, {
//     indexes: [{
//         name: 'project_title_index',
//         method: 'BTREE',
//         fields: ['title'],
//     }],
//     underscored: true
// })

// Project.afterSave((project) => {
//     const sequenceName = 'project_' + project.key.toLowerCase()
//     sequelize.query('CREATE SEQUENCE ' + sequenceName)

//     ProjectSequence.create({
//         sequenceName: sequenceName,
//         prefix: project.key,
//         projectKey: project.key
//     })

//     return project
// })

// // TODO: add afterDestroy hook and drop all sequences

// module.exports = { Project }
