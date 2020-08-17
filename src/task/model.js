'use strict'

const { knex } = require('../db/knex')
const { canFindById, canFindByKey } = require('../core/model')
const { camelizeKeys, underscoreKeys } = require('../helpers/object')

const config = {
    tableName: 'tasks',
    labelsTableName: 'task_labels',
    assigneesTableName: 'task_assignees'
}

const Model = (config) => {
    let state = {}

    const create = async ({
        projectId,
        title,
        description,
        version,
        timeEstimated,
        timeSpent,
        dueAt,
        authorId,
        typeId,
        statusId,
        priorityId,
        labelIds,
        assignees
    }) => {
        const newKeyResponse = await knex.raw('SELECT project_generate_next_sequence_val_procedure(?)', projectId)
        const newKey = newKeyResponse.rows.shift().project_generate_next_sequence_val_procedure

        const newTaskData = underscoreKeys({
            key: newKey,
            title,
            description,
            version,
            timeEstimated,
            timeSpent,
            dueAt,
            authorId,
            projectId,
            priorityId,
            typeId,
            statusId
        })

        try {
            const trxProvider = await knex.transactionProvider()
            const trx = await trxProvider()
            try {
                const tasks = await trx(config.tableName).insert(newTaskData, [
                    'id',
                    'key',
                    'title',
                    'description',
                    'version',
                    'time_estimated',
                    'time_spent',
                    'due_at',
                    'author_id',
                    'project_id',
                    'priority_id',
                    'type_id',
                    'status_id',
                    'created_at',
                    'updated_at'
                ])

                //TODO handle bulk task create
                const taskId = tasks[0].id

                const taskLabels = labelIds.map(labelId => (underscoreKeys({taskId, labelId})))
                const insertedTasksLabels = await  trx(config.labelsTableName).insert(taskLabels, ['label_id'])

                const taskAssignees = assignees.map(assignee => (underscoreKeys({taskId, ...assignee})))
                const insertedTaskAssignees = await  trx(config.assigneesTableName).insert(taskAssignees, ['user_id', 'role_id'])

                trx.commit()

                return state = camelizeKeys({
                    ...tasks,
                    labelIds: insertedTasksLabels,
                    assignees: insertedTaskAssignees
                })
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
        create
    }
}

const Task = Model(config)

module.exports = { Task }
