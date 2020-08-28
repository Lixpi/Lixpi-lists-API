'use strict'

const { _ } = require('lodash')
const { expect } = require('chai')

const { Project } = require('./model')

before(async () => {
})

after(async () => {
})

describe('Project CRUD operations', () => {
    beforeEach( async () => {
    })

    afterEach( async () => {
        await Project.del('PRO')
    })

    it('Should save project', async () => {
        const newProjectData = {
            title: 'Project title',
            description: 'Project description'
        }

        const expectedProject = {
            key: 'PRO',
            title: 'Project title',
            description: 'Project description'
        }

        const actualProject = await Project.create(newProjectData)

        expect(expectedProject).to.deep.equal(_.omit(actualProject, ['id']))
    })
})
