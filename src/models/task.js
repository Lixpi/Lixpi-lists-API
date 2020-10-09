'use strict'

const { _ } = require('lodash')

const { knex } = require('../db/knex')
const { camelizeKeys, underscoreKeys } = require('../helpers/object')
const { canDelete } = require('../core/model')

const config = {
    tableName: 'tasks',
    labelsTableName: 'task_labels',
    versionsTableName: 'task_versions',
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

        const versions = await knex.select(
            'versions.id',
            'versions.color',
            'versions.title'
        )
            .from('task_versions')
            .where({ 'task_versions.task_id': task.id })
            .leftJoin('versions', {'task_versions.version_id': 'versions.id'})

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

        return formatTask(task, labels, versions, assignees)
    }

    const getAll = async () => {
        const tasks = await knex.select(
            'tasks.id as id',
            'tasks.key as key',
            'tasks.title as title',
            'tasks.description as description',
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
            .orderBy('id')

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


                const versions = await knex.select(
                    'versions.id',
                    'versions.color',
                    'versions.title'
                )
                    .from('task_versions')
                    .where({ 'task_versions.task_id': task.id })
                    .leftJoin('versions', {'task_versions.version_id': 'versions.id'})

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

                return formatTask(task, labels, versions, assignees)
            })
        )
    }

    const formatTask = async (task, labels, versions, assignees) => {
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
            type: {
                id: task.typeId,
                title: task.typeTitle
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

        if (task.description) {
            taskFormatted.description = task.description
        }
        if (task.timeEstimated) {
            taskFormatted.timeEstimated = task.timeEstimated
        }
        if (task.timeSpent) {
            taskFormatted.timeSpent = task.timeSpent
        }
        if (task.dueAt) {
            taskFormatted.dueAt = task.dueAt
        }
        if (labels.length) {
            taskFormatted.labels = labels
        }
        if (versions.length) {
            taskFormatted.versions = versions
        }
        if (assignees.length) {
            taskFormatted.assignees = assignees
        }
        return taskFormatted
    }

    const create = async ({
        projectId,
        title,
        description = null,
        timeEstimated = null,
        timeSpent = null,
        dueAt = null,
        authorId,
        type = {id: null},
        status = {id: null},
        priority = {id: null},
        labels = [],
        versions = [],
        assignees = null
    }) => {
        const newKeyResponse = await knex.raw('SELECT project_generate_next_sequence_val_procedure(?)', projectId)
        const newKey = newKeyResponse.rows.shift().project_generate_next_sequence_val_procedure

        const newTaskData = underscoreKeys({
            key: newKey,
            title,
            description,
            timeEstimated,
            timeSpent,
            dueAt,
            authorId,
            projectId,
            priorityId: priority.id,
            typeId: type.id,
            statusId: status.id
        })

        const trxProvider = await knex.transactionProvider()
        const trx = await trxProvider()
        try {
            const tasks = await trx(config.tableName).insert(newTaskData, [
                'id',
                'key',
                'title',
                'description',
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
            if (labels.length) {
                const taskLabels = labels.map(label => (underscoreKeys({taskId, labelId: label.id})))
                insertedTasksLabels = await  trx(config.labelsTableName).insert(taskLabels, ['label_id'])
            }

            let insertedTasksVersions = null
            if (versions.length) {
                const taskVersions = versions.map(version => (underscoreKeys({taskId, versionId: version.id})))
                insertedTasksVersions = await  trx(config.versionsTableName).insert(taskVersions, ['version_id'])
            }

            let insertedTaskAssignees = null
            if (assignees) {
                const taskAssignees = assignees.map(assignee => (underscoreKeys({
                    taskId,
                    userId: assignee.userId,
                    assigneeRoleId: assignee.assigneeRoleId
                })))
                insertedTaskAssignees = await  trx(config.assigneesTableName).insert(taskAssignees, ['user_id', 'assignee_role_id'])
            }

            trx.commit()

            return Object.assign(
                state,
                camelizeKeys({
                    ...tasks[0],
                    labelIds: insertedTasksLabels,
                    versionIds: insertedTasksVersions,
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
        getAll,
        create,
        ...canDelete(config)
    }
}

const Task = Model(config)

module.exports = { Task }
