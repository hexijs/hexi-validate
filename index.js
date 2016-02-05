'use strict'
const validate = require('express-validation')

module.exports = function(server, opts) {
  server.route.pre((next, opts) => {
    if (!opts || !opts.config || !opts.config.validate) return next(opts)

    let taskName = 'validate:' + opts.path
    server.task(taskName, validate(opts.config.validate))

    opts.task =  opts.task || []
    opts.task = [taskName].concat(opts.task)
    next(opts)
  })
}

module.exports.attributes = {
  pkg: require('./package.json'),
}
