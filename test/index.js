'use strict'
const expect = require('chai').expect
const hexi = require('hexi')
const hexiValidate = require('..')
const request = require('supertest')
const joi = require('joi')

describe('auth', function() {
  let server

  beforeEach(function(next) {
    server = new hexi.Server()
    server.register([hexiValidate], next)
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

  it('should return error if validation fails', function(done) {
    server.route({
      path: '/',
      method: 'GET',
      config: {
        validate: {
          headers: joi.any().valid('bar'),
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
