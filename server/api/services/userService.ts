import { Types as mongooseTypes } from 'mongoose'
import L from '../../config/logger'

import User, { IUserModel } from '../models/user'

export class UserService {
  async create(userData: IUserModel): Promise<IUserModel> {
    L.info(`Create user ${userData}`)

    const UserModel = new User(userData)

    const doc = (await UserModel.save()) as IUserModel

    return doc
  }

  async put(id: string, userData: IUserModel): Promise<IUserModel> {
    L.info(`update user with id ${id} with data ${userData}`)

    const doc = (await User.findOneAndUpdate(
      { _id: id },
      { $set: userData },
      { new: true }
    )
      .lean()
      .exec()) as IUserModel

    return doc
  }
}

export default new UserService()
