'use strict'

const { _ } = require('lodash')
const { expect } = require('chai')

const { Project } = require('./model')

describe('Save', () => {
    afterEach( async () => {
        await Project.del('PRO')
    })

    it('should save project', async () => {
        const projectData = {
            title: 'Project title',
            description: 'Project description'
        }

        const expected = {
            key: 'PRO',
            title: 'Project title',
            description: 'Project description'
        }

        const actual = await Project.create(projectData)

        expect(expected).to.deep.equal(_.omit(actual, ['id']))
    })
})

describe('Get single project', () => {
    beforeEach( async () => {
        const projectData1 = {
            title: 'Romeo',
            description: 'Romeo project'
        }
        await Project.create(projectData1)
    })

    afterEach( async () => {
        await Project.del('ROM')
    })

    it('shoud get project', async () => {
        const expected = {
            key: 'ROM',
            title: 'Romeo',
            description: 'Romeo project'
        }

        const actual = await Project.findByKey('ROM')

        expect(expected).to.deep.equal(_.omit(actual, ['id']))
    })
})

describe('Get all projects', () => {
    beforeEach( async () => {
        const projectData1 = {
            title: 'Romeo',
            description: 'Romeo project'
        }
        const projectData2 = {
            title: 'Juliet',
            description: 'Juliet project'
        }
        await Project.create(projectData1)
        await Project.create(projectData2)
    })

    afterEach( async () => {
        await Project.del('ROM')
        await Project.del('JUL')
    })

    it('shoud get all projects', async () => {
        const expected =[
            {
                key: 'JUL',
                title: 'Juliet',
                description: 'Juliet project'
            },
            {
                key: 'ROM',
                title: 'Romeo',
                description: 'Romeo project'
            }
        ]

        const actual = await Project.getAll()

        expect(expected).to.deep.equal(actual.map(project => {return _.omit(project, ['id'])}))
    })
})
