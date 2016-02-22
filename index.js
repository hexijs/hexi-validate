'use strict'
const validate = require('express-validation')

module.exports = (server, opts) => {
  server.route.pre((next, opts) => {
    if (!opts || !opts.config || !opts.config.validate) return next.applySame()

    opts.pre.push(validate(opts.config.validate))
    next(opts)
  })
}

module.exports.attributes = {
  pkg: require('./package.json'),
}
