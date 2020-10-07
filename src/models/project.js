'use strict'

const { knex } = require('../db/knex')
const { canFindById, canFindByKey, canGetAll } = require('../core/model')
const { camelizeKeys, underscoreKeys } = require('../helpers/object')

const config = {
    tableName: 'projects',
    sequencesTableName: 'project_sequences'
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

            return Object.assign(
                state,
                camelizeKeys(...projects)
            )
        }
        catch (e) {
            trx.rollback()
            throw e
        }
    }

    //TODO add a way to del all projects and associated sequences (needed at least for seeder)
    const del = async key => {
        const trxProvider = await knex.transactionProvider()
        const trx = await trxProvider()
        try {
            //TODO implement bulk delete
            await trx(config.tableName).where({key}).del()
            await trx.raw(`DROP SEQUENCE project_${key}`)
            await trx(config.sequencesTableName).where({project_key: key}).del()
            return trx.commit()
        }
        catch (e) {
            trx.rollback()
            throw e
        }
    }

    return {
        ...state,
        ...canFindById(config),
        ...canFindByKey(config),
        ...canGetAll(config),
        create,
        delete: del
    }
}

const Project = Model(config)

module.exports = { Project }
