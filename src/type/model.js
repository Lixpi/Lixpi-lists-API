'use strict'

const { knex } = require('../db/knex')
const { canFindById, canGetAll } = require('../core/model')

const config = {
    tableName: 'types'
}

const Model = (config) => {
    let state = {}

    const create = async values => {
        values = Array.isArray(values) ? values : [values]

        const insertData = values.map(type => ({
            title: type.title,
        }))

        return knex(config.tableName).insert(insertData)
    }

    const del = async id => knex(config.tableName).where({id}).del()

    return {
        ...state,
        ...canGetAll(config),
        ...canFindById(config),
        create,
        del
    }
}

const Type = Model(config)

module.exports = { Type }












//
//
//
//
//
//
//
//
//
// 'use strict'
//
// const { knex } = require('../db/knex')
// const { canFindById, canFindByKey, canGetAll } = require('../core/model')
// const { camelizeKeys, underscoreKeys } = require('../helpers/object')
//
// const config = {
//     tableName: 'types'
// }
//
// const Model = (config) => {
//     let state = {}
//
//     const create = async ({
//         key,
//         title,
//         description
//     }) => {
//         const projectKey = key || title.slice(0, 3).toUpperCase() // TODO refactor project key generator, move into SQL function
//
//         const newProjectData = {
//             key: projectKey,
//             title,
//             description
//         }
//
//         const trxProvider = await knex.transactionProvider()
//         const trx = await trxProvider()
//         try {
//             //TODO implement bulk insert
//             const types = await trx(config.tableName).insert(newProjectData, [
//                 'id',
//                 'key',
//                 'title',
//                 'description'
//             ])
//
//             await trx.raw(`CREATE SEQUENCE project_${projectKey}`)
//
//
//             trx.commit()
//
//             return Object.assign(
//                 state,
//                 camelizeKeys(...types)
//             )
//         }
//         catch (e) {
//             trx.rollback()
//             throw e
//         }
//     }
//
//     //TODO add a way to del all types and associated sequences (needed at least for seeder)
//     const del = async key => {
//         const trxProvider = await knex.transactionProvider()
//         const trx = await trxProvider()
//         try {
//             //TODO implement bulk delete
//             await trx(config.tableName).where({key}).del()
//             await trx.raw(`DROP SEQUENCE project_${key}`)
//             await trx(config.sequencesTableName).where({project_key: key}).del()
//             return trx.commit()
//         }
//         catch (e) {
//             trx.rollback()
//             throw e
//         }
//     }
//
//     return {
//         ...state,
//         ...canFindById(config),
//         ...canGetAll(config),
//         create,
//         del
//     }
// }
//
// const Type = Model(config)
//
// module.exports = { Type }
