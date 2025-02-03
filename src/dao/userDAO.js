import { UserModel } from "../models/userModel.js"
import mongoose from "mongoose"

export class UserDAO {
  static async getUsers() {
    return await UserModel.find().lean()
  }

  static async getUsersBy(filtro = {}) {
    return await UserModel.findOne(filtro).lean()
  }

  // static async getUserById(id) {
  //   return await UserModel.findOne(id).lean()
  // }

  static async getUserById(id) {
    return await UserModel.findOne({ _id: new mongoose.Types.ObjectId(id) });
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
export const userDAO = new UserDAO


