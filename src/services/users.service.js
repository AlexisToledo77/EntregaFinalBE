import { UserDAO } from "../dao/userDAO.js"

export class UsersService {
    static async getUsers() {
        return await UserDAO.getUsers()
    }

    static async getUserById(id) {
        return await UserDAO.getUserById(id)
    }

    static async createUser(user) {
        return await UserDAO.createUser(user)
    }

    static async updateUser(id, user) {
        return await UserDAO.updateUser(id, user)
    }

    static async deleteUser(id) {
        return await UserDAO.deleteUser(id)
    }
}