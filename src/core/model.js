'use strict'

const _ = require('lodash')

class Model {
    constructor(values = {}) {
        Object.assign(this, values)
    }

    static init(values) {
        return new this(values)
    }

    static camelizeKeys(values) {
        if (Array.isArray(values)) {
            return values.map(value => this.camelizeKeys(value))
        } else if (values !== null && values.constructor === Object) {
            return Object.keys(values).reduce(
                (result, key) => ({
                    ...result,
                    [_.camelCase(key)]: this.camelizeKeys(values[key])
                }),
                {}
            )
        }
        return values
    }

    static underscoreKeys(values) {
        if (Array.isArray(values)) {
            return values.map(value => this.underscoreKeys(value))
        } else if (values !== null && values.constructor === Object) {
            return Object.keys(values).reduce(
                (result, key) => ({
                    ...result,
                    [_.snakeCase(key)]: this.underscoreKeys(values[key])
                }),
                {}
            )
        }
        return values
    }
}

module.exports = { Model }
