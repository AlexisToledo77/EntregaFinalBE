import express from 'express'
import { userManager } from '../dao/userManager.js'

const router = express.Router()

router.get('/', async (req, res) => {
  const users = await userManager.readFile()
  res.json(users)
})

router.post('/', async (req, res) => {
  const { name, email } = req.body
  const newUser = await userManager.addItem({ name, email })
  const io = req.app.get('socketio')
  const updatedUser = await userManager.readFile()
  io.emit('user', updatedUser)
  res.status(201).json(newUser)
})

router.get('/:id', async (req, res) => {
  const user = await usersManager.getItemById(parseInt(req.params.id))
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' })
  }
})

router.put('/:id', async (req, res) => {
  const updatedUser = await usersManager.updateItem(parseInt(req.params.id), req.body)
  if (updatedUser) {
    res.json(updatedUser)
  } else {
    res.status(404).json({ message: 'Usuario no encontrado' })
  }
})

router.delete('/:id', async (req, res) => {
  await userManager.deleteItem(parseInt(req.params.id))
  const io = req.app.get('socketio')
  const deleteUser = await userManager.readFile()
  io.emit('user', deleteUser)
  res.status(204).end()
})

export default router