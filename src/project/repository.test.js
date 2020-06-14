const sinon = require('sinon')
const { expect } = require('chai')

const { syncModels } = require('../db/db-init')
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
