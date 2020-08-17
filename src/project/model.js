'use strict'

const { knex } = require('../db/knex')
const { canFindById, canFindByKey } = require('../core/model')
const { camelizeKeys, underscoreKeys } = require('../helpers/object')

const config = {
    tableName: 'projects',
    sequencesTableName: 'project_sequences',
}

const Model = (config) => {
    let state = {}

    const create = async ({
        key,
        title,
        description
    }) => {
        const projectKey = key || title.slice(0, 3).toUpperCase() // TODO refactor project key generator, move into SQL function

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
                const projects = await trx(config.tableName).insert(newProjectData, [
                    'id',
                    'key',
                    'title',
                    'description'
                ])

                await trx.raw(`CREATE SEQUENCE project_${projectKey}`)

                await trx(config.sequencesTableName).insert(underscoreKeys({projectKey, nextValue: 1}))

                trx.commit()

                // return Object.assign(state, camelizeKeys(...projects))
                return state = camelizeKeys(...projects)
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
    const drop = async key => {
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

    return {
        ...canFindById(config, state),
        ...canFindByKey(config, state),
        create,
        drop
    }
}

const Project = Model(config)

module.exports = { Project }
