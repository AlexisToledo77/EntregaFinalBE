import express from 'express'
import { userManager } from '../dao/userManager.js'

const router = express.Router()

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

export default router