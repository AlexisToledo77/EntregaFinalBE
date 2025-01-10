import { UserModel } from "../models/userModel.js"

export class UserManager {
  static async getUsers() {
    return await UserModel.find().lean()
  }

  static async getUsersBy(filtro = {}) {
    return await UserModel.findOne(filtro).lean()
  }

  static async getBy(filtro = {}) {
    return await UserModel.findOne(filtro).lean()
  }

  static async createUser(user) {
    return await UserModel.create(user)
  }

  static async deleteUser(id) {
    return await UserModel.findByIdAndDelete(id).lean()
  }
}
export const userManager = new UserManager


