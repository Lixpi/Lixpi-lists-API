const _ = require('lodash')

const camelizeKeys = values => {
    if (Array.isArray(values)) {
        return values.map(value => camelizeKeys(value))
    } else if (values !== null && values.constructor === Object) {
        return Object.keys(values).reduce(
            (result, key) => ({
                ...result,
                [_.camelCase(key)]: camelizeKeys(values[key])
            }),
            {}
        )
    }
    return values
}

const underscoreKeys = values => {
    if (Array.isArray(values)) {
        return values.map(value => underscoreKeys(value))
    } else if (values !== null && values.constructor === Object) {
        return Object.keys(values).reduce(
            (result, key) => ({
                ...result,
                [_.snakeCase(key)]: underscoreKeys(values[key])
            }),
            {}
        )
    }
    return values
}

module.exports = {
    camelizeKeys,
    underscoreKeys
}
