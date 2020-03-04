import 'mocha'
import { expect } from 'chai'
import request from 'supertest'
import Server from '../server'
import * as HttpStatus from 'http-status-codes'

let exampleId = '5e5e2983b24197549872537b'

describe('Calls', () => {
  it('should add a new example', () =>
    request(Server)
      .post('/users')
      .send({
        name: 'Misha',
        email: 'misha@gmail.com',
        password: 'test123',
        temperatureMetric: 'C'
      })
      .expect(HttpStatus.CREATED)
      .expect('Content-Type', /json/)
      .then((r) => {
        exampleId = r.body._id
        expect(r.body)
          .to.be.an('object')
          .that.has.property('name')
          .to.equal('Misha')
      }))

  let token = null

  before('should login', () =>
    request(Server)
      .post('/login')
      .send({
        email: 'misha@gmail.com',
        password: 'test123'
      })
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/)
      .then((r) => {
        token = r.body.user.authToken
        exampleId = r.body._id
        expect(r.body)
          .to.be.an('object')
          .that.has.property('logged')
          .to.equal(true)
      })
  )

  it('should add another new example', () =>
    request(Server)
      .post('/users')
      .send({
        name: 'Ivan',
        email: 'ivan@gmail.com',
        password: 'myPassword',
        temperatureMetric: 'F'
      })
      .expect(HttpStatus.CREATED)
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('name')
          .to.equal('Ivan')
      }))

  it('should update an example', () =>
    request(Server)
      .put(`/users/${exampleId}`)
      .send({ name: 'test1-updated' })
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('name')
          .equal('test1-updated')
      }))

  it('fetchWeather', () =>
    request(Server)
      .get('/weather')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('city')
      }))
})
