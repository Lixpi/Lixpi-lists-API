'use strict'

const { knex } = require('../db/knex')
const { Model } = require('../core/model')

class Task extends Model {
    static tableName = 'tasks'
    static labelsTableName = 'task_labels'
    static assigneesTableName = 'task_assignees'

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

        const newTaskData = this.underscoreKeys({
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

                //TODO handle bulk task create
                const taskId = tasks[0].id

                const taskLabels = labelIds.map(labelId => (this.underscoreKeys({taskId, labelId})))
                const insertedTasksLabels = await  trx(this.labelsTableName).insert(taskLabels, ['label_id'])

                const taskAssignees = assignees.map(assignee => (this.underscoreKeys({taskId, ...assignee})))
                const insertedTaskAssignees = await  trx(this.assigneesTableName).insert(taskAssignees, ['user_id', 'role_id'])

                trx.commit()

                return this.camelizeKeys(
                    Object.assign({},
                        ...tasks,
                        {labelIds: insertedTasksLabels},
                        {assignees: insertedTaskAssignees}
                    )
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
