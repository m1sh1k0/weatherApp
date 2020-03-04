import mongoose, { Schema } from 'mongoose'
import { NextFunction } from 'express'
import * as bcrypt from 'bcrypt'

export interface IUserModel extends mongoose.Document {
  name: string
  email: string
  password: string
  temperatureMetric: string

  comparePassword: (password: string) => Promise<boolean>
}

const User: Schema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    authToken: String,
    temperatureMetric: {
      type: String,
      enum: ['C', 'F'],
      default: 'C'
    }
  },
  {
    versionKey: false
  }
).pre('save', async function(next: NextFunction): Promise<void> {
  const user: any = this

  if (!user.isModified('password')) {
    return next()
  }

  try {
    const salt: string = await bcrypt.genSalt(10)

    const hash: string = await bcrypt.hash(user.password, salt)

    user.password = hash
    next()
  } catch (error) {
    return next(error)
  }
})

User.methods.comparePassword = async function(
  password: string
): Promise<boolean> {
  try {
    return bcrypt
      .compare(password, this.password)
      .then((valid) => (valid ? this : false))
  } catch (error) {
    return error
  }
}

export default mongoose.model<IUserModel>('UserModel', User)
