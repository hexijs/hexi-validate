'use strict'
const describe = require('mocha').describe
const it = require('mocha').it
const beforeEach = require('mocha').beforeEach
const hexi = require('hexi')
const hexiValidate = require('..')
const request = require('supertest')
const joi = require('joi')
const bodyParser = require('body-parser')

describe('auth', function () {
  let server

  beforeEach(function () {
    server = hexi()

    server.express.use(bodyParser.json())
    server.express.use(bodyParser.urlencoded({
      extended: true,
    }))

    return server.register(hexiValidate)
  })

  it('should return success if validation passess', function (done) {
    server.route({
      path: '/',
      method: 'GET',
      config: {
        validate: {
          headers: {
            foo: joi.any().valid('bar'),
          },
        },
      },
      handler (req, res) {
        res.status(200).end()
      },
    })

    request(server.express)
      .get('/')
      .set('foo', 'bar')
      .expect(200, done)
  })

  it('should return error if headers validation fails', function (done) {
    server.route({
      path: '/',
      method: 'GET',
      config: {
        validate: {
          headers: {
            foo: joi.string().required(),
          },
        },
      },
      handler (req, res) {
        res.status(200).end()
      },
    })

    request(server.express)
      .get('/')
      .expect(400, done)
  })

  it('should return error if body validation fails', function (done) {
    server.route({
      path: '/',
      method: 'GET',
      config: {
        validate: {
          body: {
            foo: joi.string().required(),
          },
        },
      },
      handler (req, res) {
        res.status(200).end()
      },
    })

    request(server.express)
      .get('/')
      .expect(400, done)
  })
})
