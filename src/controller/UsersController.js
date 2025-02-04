import { UsersService } from "../services/users.service.js"
import { CartsDAO } from "../dao/cartsDAO.js"
import { isValidObjectId } from 'mongoose'
import { UsersDTO } from "../DTO/UsersDTO.js"

export class UsersController {
    static async getUsers(req, res) {
        try {
            let usuarios = await UsersService.getUsers()
            let users = new UsersDTO(usuarios)
            console.log('Usuarios transformados:', users)

            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ users })
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error al obtener usuarios' })
        }
    }

    static async createUser(req, res) {
        let { first_name, email, password } = req.body
        try {
            let newUser = await UsersService.createUser({ first_name, email, password })
            let io = req.app.get('socketio')
            let updatedUser = await UsersService.getUsers()
            io.emit('user', updatedUser)
            res.status(201).json(newUser)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error al crear usuario' })
        }
    }

    static async getUserById(req, res) {
        let { id } = req.params
        if (!isValidObjectId(id)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `id formato inválido` })
        }

        try {
            let user = await UsersService.getUserById(id)
            if (!user) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({ error: `No existen usuarios con id ${id}` })
            }
            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ user })
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type', 'application/json')
            return res.status(500).json({
                error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            })
        }
    }

    static async updateUser(req, res) {
        let { id } = req.params
        if (!isValidObjectId(id)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `id formato inválido` })
        }

        try {
            let updatedUser = await UsersService.updateUser(id, req.body)
            if (updatedUser) {
                res.json(updatedUser)
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Error al actualizar usuario' })
        }
    }

    static async deleteUser(req, res) {
        let { id } = req.params
        if (!isValidObjectId(id)) {
            res.setHeader('Content-Type', 'application/json')
            return res.status(400).json({ error: `El id no es válido` })
        }

        try {
            let user = await UsersService.getUserById(id)
            if (!user) {
                res.setHeader('Content-Type', 'application/json')
                return res.status(400).json({ error: `No existen usuarios con id ${id}` })
            }
            let cart = user.cart
            if (cart) {
                await CartsDAO.deleteCart(cart)
            }

            let userDelete = await UsersService.deleteUser(id)

            res.setHeader('Content-Type', 'application/json')
            return res.status(200).json({ userDelete })
        } catch (error) {
            console.log(error)
            res.setHeader('Content-Type', 'application/json')
            return res.status(500).json({
                error: `No se pudo eliminar  - Intente más tarde, o contacte a su administrador`,
                detalle: `${error.message}`
            })
        }
    }
}