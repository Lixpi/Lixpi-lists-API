'use strict'

const sinon = require('sinon')
const { expect } = require('chai')

const sequelize = require('../db/sequelize')
const { syncModels } = require('../db/db-init')
const { generateNextSeqVal } = require('../db/functions/generate_next_seq_val')
const { ProjectSequence } = require('../project_sequence/model')
const { createProject } = require('./repository')

let fakeTime
let currentTime

before(async () => {
    return await syncModels()
})

describe('Project CRUD operations', () => {
    beforeEach( async () => {
        fakeTime = sinon.useFakeTimers(new Date(2011,9,1).getTime())
        currentTime = new Date()

        const sequenceName = 'project_pro'
        ProjectSequence.destroy({
            where: {
                projectKey: 'PRO',
                sequenceName: sequenceName
            }
        })
        sequelize.query('DROP SEQUENCE ' + sequenceName).catch(function () {})

        sequelize.query(generateNextSeqVal)
    })

    afterEach( async () => {
        fakeTime.restore()
    })

    it('Should save project', async () => {
        const newProjectData = {
            title: 'Project title',
            description: 'Project description'
        }

        const expectedProject = {
            key: 'PRO',
            title: 'Project title',
            description: 'Project description',
            updatedAt: currentTime,
            createdAt: currentTime
        }

        const actualProject = await createProject(newProjectData)

        expect(expectedProject).to.deep.equal(actualProject.dataValues)
    })
})
