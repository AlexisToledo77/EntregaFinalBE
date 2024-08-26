import express from 'express'
import { usersManager } from '../dao/userManager.js'

const router = express.Router()

router.post('/', async (req, res) => {
  const newUser = await usersManager.addItem(req.body)
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