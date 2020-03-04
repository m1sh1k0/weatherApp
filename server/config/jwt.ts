import jwt from 'jsonwebtoken'
import Promise from 'bluebird'
const jwtSecret = process.env.JWT_SECRET

const jwtSign = Promise.promisify(jwt.sign)
const jwtVerify = Promise.promisify(jwt.verify)

export const sign = (id: string, method = jwtSign) => method({ id }, jwtSecret)

export const signSync = (id: string) => sign(id, jwtSign)

export const verify = (token: string) => jwtVerify(token)
