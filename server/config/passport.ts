import passport from 'passport'
import { Schema } from 'bodymen'
import { BasicStrategy } from 'passport-http'
import local from 'passport-local'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import User from '../api/models/user'
import { NextFunction } from 'express'
const LocalStrategy = local.Strategy
const masterKey = process.env.MASTER_KEY
const jwtSecret = process.env.JWT_SECRET

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(user, done) {
  done(null, user)
})

export const password = () => (req, res, next) =>
  passport.authenticate(
    ['local', 'password'],
    { session: false },
    (err, user, info) => {
      if (err && err.param) {
        return res
          .status(400)
          .json(err)
          .end()
      } else if (err || !user) {
        return res
          .status(401)
          .json({
            valid: false,
            message:
              'You have entered the incorrect data, please check and try again.'
          })
          .end()
      }
      req.logIn(user, { session: false }, (err) => {
        if (err)
          return res
            .status(401)
            .json({
              valid: false,
              message:
                'You have entered the incorrect data, please check and try again.'
            })
            .end()

        next()
      })
    }
  )(req, res, next)

export const master = () => passport.authenticate('master', { session: false })

export const token = (required: boolean) => (req, res, next: NextFunction) =>
  passport.authenticate('token', { session: false }, (err, user, info) => {
    if (err || (required && !user)) {
      return res
        .status(401)
        .json({
          valid: false,
          message: `You are not logged in or Your session was expired, please try login`
        })
        .end()
    }
    req.logIn(user, { session: false }, (err) => {
      if (err)
        return res
          .status(401)
          .json({
            valid: false,
            param: 'unauthorized',
            message:
              'You have entered a wrong login or password, please try again.'
          })
          .end()
      next()
    })
  })(req, res, next)

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    function(email, password, done) {
      const userSchema = new Schema({
        phone: email,
        password: password
      })
      userSchema.validate({ email, password }, (err) => {
        if (err) done(err)
      })
      User.findOne({ email }).then((user: any) => {
        if (!user) {
          done(true)
          return null
        }

        return user
          .comparePassword(password, user.password)
          .then((user) => {
            done(null, user)
            return null
          })
          .catch(done)
      })
    }
  )
)

passport.use(
  'password',
  new BasicStrategy((email, password, done) => {
    const userSchema = new Schema({
      email: email,
      password: password
    })
    userSchema.validate({ email, password }, (err) => {
      if (err) done(err)
    })

    User.findOne({ email }).then((user: any) => {
      if (!user) {
        done(true)
        return null
      }
      return user
        .authenticate(password, user.password)
        .then((user) => {
          done(null, user)
          return null
        })
        .catch(done)
    })
  })
)

passport.use(
  'master',
  new BearerStrategy((token, done) => {
    if (token === masterKey) {
      done(null, {})
    } else {
      done(null, false)
    }
  })
)

passport.use(
  'token',
  new JwtStrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer')
      ])
    },
    ({ id }, done) => {
      User.findById(id)
        .then((user) => {
          done(null, user)
          return null
        })
        .catch(done)
    }
  )
)
