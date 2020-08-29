'use strict'

const { _ } = require('lodash')

const { knex } = require('../db/knex')
const { camelizeKeys, underscoreKeys } = require('../helpers/object')
const { canDel } = require('../core/model')

const config = {
    tableName: 'tasks',
    labelsTableName: 'task_labels',
    assigneesTableName: 'task_assignees'
}

const Model = (config) => {
    let state = {}

    const findByKey = async key => {
        const task = await knex.select(
            'tasks.id as id',
            'tasks.key as key',
            'tasks.title as title',
            'tasks.description as description',
            'tasks.version as version',
            'tasks.time_estimated as timeEstimated',
            'tasks.time_spent as timeSpent',
            'tasks.due_at as dueAt',
            'projects.id as projectId',
            'projects.key as projectKey',
            'projects.title as projectTitle',
            'users.id as authorId',
            'users.username as authorUsername',
            'priorities.id as priorityId',
            'priorities.title as priorityTitle',
            'types.id as typeId',
            'types.title as typeTitle',
            'statuses.id as statusId',
            'statuses.title as statusTitle',
        )
            .from(config.tableName)
            .where({'tasks.key': key})
            .leftJoin('projects', {'tasks.project_id': 'projects.id'})
            .leftJoin('users', {'tasks.author_id': 'users.id'})
            .leftJoin('priorities', {'tasks.priority_id': 'priorities.id'})
            .leftJoin('types', {'tasks.type_id': 'types.id'})
            .leftJoin('statuses', {'tasks.status_id': 'statuses.id'})
            .first()

        const labels = await knex.select(
            'labels.id',
            'labels.color',
            'labels.title'
        )
            .from('task_labels')
            .where({ 'task_labels.task_id': task.id })
            .leftJoin('labels', {'task_labels.label_id': 'labels.id'})

        const assignees = await knex.select(
            'users.id as userId',
            'users.username as username',
            'assignee_roles.id as assigneeRoleId',
            'assignee_roles.title as assigneeRoleTitle'
        )
            .from('task_assignees')
            .where({ 'task_assignees.task_id': task.id })
            .leftJoin('users', {'task_assignees.user_id': 'users.id'})
            .leftJoin('assignee_roles', {'task_assignees.assignee_role_id': 'assignee_roles.id'})

        return formatTask(task, labels, assignees)
    }

    const all = async () => {
        const tasks = await knex.select(
            'tasks.id as id',
            'tasks.key as key',
            'tasks.title as title',
            'tasks.description as description',
            'tasks.version as version',
            'tasks.time_estimated as timeEstimated',
            'tasks.time_spent as timeSpent',
            'tasks.due_at as dueAt',
            'projects.id as projectId',
            'projects.key as projectKey',
            'projects.title as projectTitle',
            'users.id as authorId',
            'users.username as authorUsername',
            'priorities.id as priorityId',
            'priorities.title as priorityTitle',
            'types.id as typeId',
            'types.title as typeTitle',
            'statuses.id as statusId',
            'statuses.title as statusTitle',
        )
            .from(config.tableName)
            .leftJoin('projects', {'tasks.project_id': 'projects.id'})
            .leftJoin('users', {'tasks.author_id': 'users.id'})
            .leftJoin('priorities', {'tasks.priority_id': 'priorities.id'})
            .leftJoin('types', {'tasks.type_id': 'types.id'})
            .leftJoin('statuses', {'tasks.status_id': 'statuses.id'})

        return Promise.all(
            tasks.map(async task => {
                const labels = await knex.select(
                    'labels.id',
                    'labels.color',
                    'labels.title'
                )
                    .from('task_labels')
                    .where({ 'task_labels.task_id': task.id })
                    .leftJoin('labels', {'task_labels.label_id': 'labels.id'})

                const assignees = await knex.select(
                    'users.id as userId',
                    'users.username as username',
                    'assignee_roles.id as assigneeRoleId',
                    'assignee_roles.title as assigneeRoleTitle'
                )
                    .from('task_assignees')
                    .where({ 'task_assignees.task_id': task.id })
                    .leftJoin('users', {'task_assignees.user_id': 'users.id'})
                    .leftJoin('assignee_roles', {'task_assignees.assignee_role_id': 'assignee_roles.id'})

                return formatTask(task, labels, assignees)
            })
        )
    }

    const formatTask = async (task, labels, assignees) => {
        let taskFormatted = {
            id: task.id,
            key: task.key,
            title: task.title,
            project: {
                id: task.projectId,
                key: task.projectKey,
                title: task.projectTitle
            },
            author: {
                id: task.authorId,
                username: task.authorUsername
            },
            priority: {
                id: task.priorityId,
                title: task.priorityTitle
            },
            status: {
                id: task.statusId,
                title: task.statusTitle
            }
        }

        if (task.description !== null) {
            taskFormatted.description = task.description
        }
        if (task.version !== null) {
            taskFormatted.version = task.version
        }
        if (task.timeEstimated !== null) {
            taskFormatted.timeEstimated = task.timeEstimated
        }
        if (task.timeSpent !== null) {
            taskFormatted.timeSpent = task.timeSpent
        }
        if (task.dueAt !== null) {
            taskFormatted.dueAt = task.dueAt
        }
        if (task.typeId !== null) {
            taskFormatted.type = {
                id: task.typeId,
                title: task.typeTitle
            }
        }
        if (labels.length != 0) {
            taskFormatted.labels = labels
        }
        if (assignees.length != 0) {
            taskFormatted.assignees = assignees
        }
        return taskFormatted
    }

    const create = async ({
        projectId,
        title,
        description=null,
        version=null,
        timeEstimated=null,
        timeSpent=null,
        dueAt=null,
        authorId,
        typeId=null,
        statusId=null,
        priorityId=null,
        labelIds=null,
        assignees=null
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

            let insertedTasksLabels = null
            if (labelIds !== null) {
                const taskLabels = labelIds.map(labelId => (underscoreKeys({taskId, labelId})))
                insertedTasksLabels = await  trx(config.labelsTableName).insert(taskLabels, ['label_id'])
            }

            let insertedTaskAssignees = null
            if (labelIds !== null) {
                const taskAssignees = assignees.map(assignee => (underscoreKeys({taskId, ...assignee})))
                insertedTaskAssignees = await  trx(config.assigneesTableName).insert(taskAssignees, ['user_id', 'assignee_role_id'])
            }

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
        all,
        create,
        ...canDel(config)
    }
}

const Task = Model(config)

module.exports = { Task }
