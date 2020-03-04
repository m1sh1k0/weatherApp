import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import { HttpError } from '../../config/errors'
import { IUserModel } from '../models/user'
import { sign } from '../../config/jwt'

export class Controller {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    passport.authenticate('local', async (err: Error, user: IUserModel) => {
      if (err) {
        return next(new HttpError(400, err))
      }

      if (!user) {
        return res.status(401).json({
          status: 401,
          logged: false,
          message: 'Invalid credentials!'
        })
      }

      await sign(user.id).then((token) => {
        const obj = { authToken: token }
        Object.assign(user, obj)
      })

      passportRequestLogin(req, res, user, next)
    })(req, res, next)
  }

  async logout(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        status: 401,
        logged: false,
        message: 'You are not authorized to app. Can not logout'
      })
    }

    if (req.user) {
      req.logout()
      res.status(200).json({
        status: 200,
        logged: false,
        message: 'Successfuly logged out!'
      })
    }
  }
}

async function passportRequestLogin(
  req: Request,
  res: Response,
  user: IUserModel,
  next: NextFunction
) {
  return req.logIn(user, (err) => {
    if (err) return next(new HttpError(err))
    res.json({
      status: 200,
      logged: true,
      user: user
    })
  })
}

export default new Controller()
