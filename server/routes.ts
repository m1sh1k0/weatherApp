import { Application } from 'express'
import router from './api/router/router'
export default function routes(app: Application): void {
  app.use('/', router)
}
