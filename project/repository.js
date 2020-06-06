'use strict'

const sequelize = require('../db/sequelize')
const { Project } = require('./model')

const createProject = async data => {
    const {
        key,
        title,
        description
    } = data

    const projectKey = key || title.slice(0, 3)

    return await Project.create({
        key: projectKey,
        title,
        description
    })
}

module.exports = {
    createProject
}
