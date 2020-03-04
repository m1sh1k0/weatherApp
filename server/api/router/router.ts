import express from 'express'
import userController from '../controllers/userController'
import authController from '../controllers/authController'
import fetchWeather from '../controllers/weatherController'
import { token } from '../../config/passport'
import limit from '../../config/limiter'

export default express
  .Router()
  .post('/users', userController.create)
  .put('/users/:id', userController.put)
  .post('/login', authController.login)
  .post('/logout', authController.logout)
  .get('/weather', token(true), limit.limitMiddleware, fetchWeather)
