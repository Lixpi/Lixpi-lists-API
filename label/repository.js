const { Label } = require('./model')

exports.getLabelByTitle = title => Label.findOne({
    where: { title }
})
