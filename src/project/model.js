'use strict'

const { knex } = require('../db/knex')
const { Model } = require('../core/model')

class Project extends Model {
    static tableName = 'projects'
    static sequencesTableName = 'project_sequences'

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

        const newProjectData = {
            key: projectKey,
            title,
            description
        }

        try {
            const trxProvider = await knex.transactionProvider()
            const trx = await trxProvider()
            try {
                //TODO implement bulk insert
                const projects = await trx(this.tableName).insert(newProjectData, [
                    'id',
                    'key',
                    'title',
                    'description'
                ])

                await trx.raw(`CREATE SEQUENCE project_${projectKey}`)

                await trx(this.sequencesTableName).insert(this.underscoreKeys({projectKey, nextValue: 1}))

                trx.commit()

                return this.init(this.camelizeKeys(...projects))
            }
            catch (e) {
                trx.rollback()
                throw e
            }
        }
        catch (e) {
            throw e
        }
    }

    //TODO add a way to drop all projects and associated sequences (needed at least for seeder)
    static async delete(key) {
        try {
            const trxProvider = await knex.transactionProvider()
            const trx = await trxProvider()
            try {
                //TODO implement bulk delete
                await trx(this.tableName).where(key).del()

                await trx.raw(`DROP SEQUENCE project_${projectKey}`)

                await trx(this.sequencesTableName).where({project_key: key}).del()

                return trx.commit()
            }
            catch (e) {
                trx.rollback()
                throw e
            }
        }
        catch (e) {
            throw e
        }
    }
}

module.exports = { Project }
