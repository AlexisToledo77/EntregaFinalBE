import express from 'express'
import { userManager } from '../dao/userManager.js'

const router = express.Router()

router.get('/', async (req, res) => {
  let users = await userManager.readFile()
  res.json(users)
})

router.post('/', async (req, res) => {
  let { name, email } = req.body
  let newUser = await userManager.addItem({ name, email })
  let io = req.app.get('socketio')
  let updatedUser = await userManager.readFile()
  io.emit('user', updatedUser)
  res.status(201).json(newUser)
})

router.get('/:id', async (req, res) => {
  let user = await userManager.getItemById(parseInt(req.params.id))
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' })
  }
})

router.put('/:id', async (req, res) => {
  let updatedUser = await userManager.updateItem(parseInt(req.params.id), req.body)
  if (updatedUser) {
    res.json(updatedUser)
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' })
  }
})

router.delete('/:id', async (req, res) => {
  await userManager.deleteItem(parseInt(req.params.id))
  let io = req.app.get('socketio')
  let deleteUser = await userManager.readFile()
  io.emit('user', deleteUser)
  res.status(204).end()
})

export default router