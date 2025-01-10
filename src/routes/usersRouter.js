import express from 'express'
import { UserManager } from '../dao/userManager.js'
import { isValidObjectId } from 'mongoose'

export const router = express.Router()

router.get('/', async (req, res) => {
  try {
    let users = await UserManager.getUsers()
    res.setHeader('Content-Type', 'application/json')
    return res.status(200).json({ users })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error al obtener usuarios' })
  }
})

router.post('/', async (req, res) => {
  let { name, mail, password, } = req.body
  let newUser = await UserManager.createUser({ name, mail, password })
  let io = req.app.get('socketio')
  let updatedUser = await UserManager.getUsers()
  io.emit('user', updatedUser)
  res.status(201).json(newUser)
})

router.get('/:id', async (req, res) => {

  let { id } = req.params
  if (!isValidObjectId(id)) {
    res.setHeader('Content-Type', 'application/json')
    return res.status(400).json({ error: `id formato inválido` })
  }

  try {
    let user = await UserManager.getUsersBy({ _id: id })
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
})

router.put('/:id', async (req, res) => {
  let updatedUser = await UserManager.updateItem(parseInt(req.params.id), req.body)
  if (updatedUser) {
    res.json(updatedUser)
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' })
  }
})

router.delete("/:id", async (req, res) => {
  let { id } = req.params
  if (!isValidObjectId(id)) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: `El id no es válido` })
  }
  try {
    let userDelete = await UserManager.deleteUser(id)
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
})





