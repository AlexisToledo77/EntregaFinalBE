import { UserModel } from "../models/userModel.js"

export class UserManager {
  static async getUsers(){
    return UserModel.find()
  }

  static async getUsersBy(filtro={}){
    return UserModel.findOne(filtro)
  }

  static async createUser(user){
    return UserModel.create(user)
  }
}

