import UserService from '../services/userService'
import { Request, Response, NextFunction } from 'express'
import * as HttpStatus from 'http-status-codes'

export class Controller {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await UserService.create(req.body)
      return res
        .status(HttpStatus.CREATED)
        .location(`/users/${doc._id}`)
        .json(doc)
    } catch (err) {
      return next(err)
    }
  }

  async put(req: Request, res: Response, next: NextFunction) {
    try {
      const doc = await UserService.put(req.params.id, req.body)
      return res
        .status(HttpStatus.OK)
        .location(`/users/${doc._id}`)
        .json(doc)
    } catch (err) {
      return next(err)
    }
  }
}

export default new Controller()
