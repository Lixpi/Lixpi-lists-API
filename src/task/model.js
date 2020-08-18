'use strict'

const { knex } = require('../db/knex')
const { camelizeKeys, underscoreKeys } = require('../helpers/object')

const config = {
    tableName: 'tasks',
    labelsTableName: 'task_labels',
    assigneesTableName: 'task_assignees'
}

const Model = (config) => {
    let state = {}

    const findByKey = async key => {
        // return await knex.select(
        //     'tasks.key as tk',
        //     'users.username'
        // )
        //     .from(config.tableName)
        //     .where({ 'tasks.key': key })
        //     .leftJoin('users', {'tasks.author_id': 'users.id'})
        //     .leftJoin('projects', {'tasks.project_id': 'projects.id'})
        //     .leftJoin('priorities', {'tasks.priority_id': 'priorities.id'})
        //     .leftJoin('types', {'tasks.type_id': 'types.id'})
        //     .leftJoin('statuses', {'tasks.status_id': 'statuses.id'})

        return await knex.select(
            '*'
        )
            .from('task_labels')
            .where({ 'task_labels.task_id': 1 })
            .leftJoin('labels', {'task_labels.label_id': 'labels.id'})
    }

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

            return Object.assign(
                state,
                camelizeKeys({
                    ...tasks[0],
                    labelIds: insertedTasksLabels,
                    assignees: insertedTaskAssignees
                })
            )
        }
        catch (e) {
            trx.rollback()
            throw e
        }
    }

    return {
        ...state,
        findByKey,
        create
    }
}

const Task = Model(config)

module.exports = { Task }
