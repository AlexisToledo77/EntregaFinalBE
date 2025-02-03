import { UserDAO } from "../dao/userDAO.js"
import { CartsDAO } from "../dao/cartsDAO.js"
import { isValidObjectId } from 'mongoose'

export class UsersController {

    static async getUsers (req, res) {
      try {
        let users = await UserDAO.getUsers()
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ users })
      } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al obtener usuarios' })
      }
    }

    static async createUser (req, res) {
      let { first_name, email, password, } = req.body
      let newUser = await UserDAO.createUser({ first_name, email, password })
      let io = req.app.get('socketio')
      let updatedUser = await UserDAO.getUsers()
      io.emit('user', updatedUser)
      res.status(201).json(newUser)
    }

    static async getUserById (req, res) {
    
      let { id } = req.params
      if (!isValidObjectId(id)) {
        res.setHeader('Content-Type', 'application/json')
        return res.status(400).json({ error: `id formato inválido` })
      }
    
      try {
        let user = await UserDAO.getUsersBy({ _id: id })
        if (!user) {
          res.setHeader('Content-Type', 'application/json')
          return res.status(400).json({ error: `No existen usuarios con id ${id}` })
        }
        res.setHeader('Content-Type', 'application/json')
        return res.status(200).json({ user })
      } catch (error) {
        console.log(error);
        res.setHeader('Content-Type', 'application/json')
        return res.status(500).json(
          {
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: `${error.message}`
          }
        )
      }
    }

    static async updateUser (req, res) {
      let updatedUser = await UserDAO.updateItem(parseInt(req.params.id), req.body)
      if (updatedUser) {
        res.json(updatedUser)
      } else {
        res.status(404).json({ message: 'Usuario no encontrado' })
      }
    }

    static async deleteUser (req, res) {
        let { id } = req.params
        if (!isValidObjectId(id)) {
          res.setHeader('Content-Type', 'application/json');
          return res.status(400).json({ error: `El id no es válido` })
        }
        try {
          let user = await UserDAO.getUserById(id)
          if (!user) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `No existen usuarios con id ${id}` });
        }
          let cart = user.cart
          if (cart) {
            let deleteCart = await CartsDAO.deleteCart(cart)
          }
          
          let userDelete = await UserDAO.deleteUser(id)
          
          res.setHeader('Content-Type', 'application/json')
          return res.status(200).json({ userDelete });
        } catch (error) {
          console.log(error);
          res.setHeader('Content-Type', 'application/json')
          return res.status(500).json(
            {
              error: `No se pudo eliminar  - Intente más tarde, o contacte a su administrador`,
              detalle: `${error.message}`
            }
          )
        }
      }
}