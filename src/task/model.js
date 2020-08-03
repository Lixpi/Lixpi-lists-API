'use strict'

const { knex } = require('../db/knex')

class Task {
    static tableName = 'tasks'
    static labelsTableName = 'task_labels'
    static assigneesTableName = 'task_assignees'

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
        const {
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
        } = values

        const newKeyResponse = await knex.raw('SELECT project_generate_next_sequence_val_procedure(?)', projectId)
        const newKey = newKeyResponse.rows.shift().project_generate_next_sequence_val_procedure

        const newTaskData = {
            key: newKey,
            title,
            description,
            version,
            time_estimated: timeEstimated,
            time_spent: timeSpent,
            due_at: dueAt,
            author_id: authorId,
            project_id: projectId,
            priority_id: priorityId,
            type_id: typeId,
            status_id: statusId,
        }

        try {
            const trxProvider = await knex.transactionProvider()
            const trx = await trxProvider()
            try {
                const tasks = await trx(this.tableName).insert(newTaskData, [
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
                console.log('tasks')
                console.log(tasks)
                const taskId = tasks[0].id

                const taskLabels = labelIds.map(labelId => ({
                    task_id: taskId,
                    label_id: labelId
                }))
                const insertedTasksLabels = await  trx(this.labelsTableName).insert(taskLabels, [
                    'id', 
                    'task_id', 
                    'label_id'
                ])

                const taskAssignees = assignees.map(assignee => ({
                    task_id: taskId,
                    user_id: assignee.userId,
                    assignee_role_id: assignee.roleId
                }))
                const insertedTaskAssignees = await  trx(this.assigneesTableName).insert(taskAssignees, [
                    'id',
                    'task_id',
                    'user_id',
                    'assignee_role_id'
                ])
                console.log('insertedTaskAssignees')
                console.log(insertedTaskAssignees)
                trx.commit()
                console.log('tasks')
                console.log(tasks)
                return Object.assign({}, 
                    tasks[0],
                    {labelIds: insertedTasksLabels.map((label) => label.label_id)},
                    {assignees: insertedTaskAssignees.map((assignee) => ({userId: assignee.user_id, roleId: assignee.assignee_role_id}) )}
                )
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

module.exports = { Task }
