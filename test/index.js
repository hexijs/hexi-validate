'use strict'
const expect = require('chai').expect
const hexi = require('hexi')
const hexiValidate = require('..')
const request = require('supertest')
const joi = require('joi')
const bodyParser = require('body-parser')

describe('auth', function() {
  let server

  beforeEach(function() {
    server = hexi()

    server.task('json-parser', bodyParser.json())
    server.task('extended-parser', bodyParser.urlencoded({
      extended: true,
    }))
    server.task('default', ['json-parser', 'extended-parser'])

    return server.register(hexiValidate)
  })

  it('should return success if validation passess', function(done) {
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
      handler(req, res) {
        res.status(200).end()
      },
    })

    request(server.express)
      .get('/')
      .set('foo', 'bar')
      .expect(200, done)
  })

  it('should return error if headers validation fails', function(done) {
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
      handler(req, res) {
        res.status(200).end()
      },
    })

    request(server.express)
      .get('/')
      .expect(400, done)
  })

  it('should return error if body validation fails', function(done) {
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
      handler(req, res) {
        res.status(200).end()
      },
    })

    request(server.express)
      .get('/')
      .expect(400, done)
  })
})
