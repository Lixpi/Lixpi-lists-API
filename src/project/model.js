'use strict'

const { knex } = require('../db/knex')

class Project {
    static tableName = 'projects'
    static sequencesTableName = 'project_sequences'

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

    // TODO refactor to use knex transactions
    static async create(values) {
        let { key, title, description } = values
        const projectKey = key || title.slice(0, 3).toUpperCase()
        const sequenceName = `project_${projectKey}`
        let createdProject = {}

        await knex(this.tableName)
            .returning(['id', 'key', 'title', 'description'])
            .insert({key: projectKey, title, description})
            .then((project) => {
                createdProject = this.init(project[0])
                return knex.raw('CREATE SEQUENCE ' + sequenceName)
            })
            .then(() => {
                return knex(this.sequencesTableName).insert({project_key: projectKey, next_value: 1})
            })

        return createdProject
    }

    static async delete(key) {
        return await knex(this.tableName)
            .where(key)
            .del()
            .then(() => {
                const sequenceName = `project_${key}`
                return knex.raw(`DROP SEQUENCE ${sequenceName}`)
            })
            .then(() => {
                // const sequenceName = `project_${projectKey}`
                // return knex.raw(`DROP SEQUENCE ${sequenceName}`)
                return knex(this.sequencesTableName).where({project_key: key}).del()
            })

        // await knex(this.tableName)
        //     .returning(['id', 'key', 'title', 'description'])
        //     .insert({key: projectKey, title, description})
        //     .then((project) => {
        //         createdProject = this.init(project[0])
        //         return knex.raw('CREATE SEQUENCE ' + sequenceName)
        //     })
        //     .then(() => {
        //         return knex(this.sequencesTableName).insert({project_key: projectKey, next_value: 1})
        //     })
        //
        // return createdProject
    }
}

// // TODO: add afterDestroy hook and drop all sequences (also in seeder)

module.exports = { Project }
