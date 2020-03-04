import 'mocha'
import { expect } from 'chai'
import request from 'supertest'
import Server from '../server'
import * as HttpStatus from 'http-status-codes'

describe('Calls', () => {
  let id = null
  it('should add a new example', () =>
    request(Server)
      .post('/users')
      .send({
        name: 'Misha2',
        email: 'misha2@gmail.com',
        password: 'test123',
        temperatureMetric: 'C'
      })
      .expect(HttpStatus.CREATED)
      .expect('Content-Type', /json/)
      .then((r) => {
        console.log(r.body._id)
        id = r.body._id
        expect(r.body)
          .to.be.an('object')
          .that.has.property('name')
          .to.equal('Misha2')
      }))

  let token = null

  it('should login', () =>
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
        expect(r.body)
          .to.be.an('object')
          .that.has.property('logged')
          .to.equal(true)
      }))

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
      .put(`/users/${id}`)
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

  it('should logout', () =>
    request(Server)
      .post('/logout')
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)
      .expect('Content-Type', /json/)
      .then((r) => {
        expect(r.body)
          .to.be.an('object')
          .that.has.property('logged')
          .to.equal(false)
      }))
})
