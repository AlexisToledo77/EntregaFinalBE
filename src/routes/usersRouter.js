import express from 'express'
import { UserManager } from '../dao/userManager.js'

export const router = express.Router()

router.get('/', async (req, res) => {
  try{
    let users = await UserManager.getUsers()
    res.setHeader('Content-Type','application/json')
    return res.status(200).json({users})
  } catch (error){
    console.log(error)
    res.status(500).json({message: 'Error al obtener usuarios'})
  }
})

// router.post('/', async (req, res) => {
//   let { name, email } = req.body
//   let newUser = await UserManager.addItem({ name, email })
//   let io = req.app.get('socketio')
//   let updatedUser = await UserManager.readFile()
//   io.emit('user', updatedUser)
//   res.status(201).json(newUser)
// })

// router.get('/:id', async (req, res) => {
//   let user = await UserManager.getItemById(parseInt(req.params.id))
//   if (user) {
//     res.json(user)
//   } else {
//     res.status(404).json({ message: 'Usuario no encontrado' })
//   }
// })

// router.put('/:id', async (req, res) => {
//   let updatedUser = await UserManager.updateItem(parseInt(req.params.id), req.body)
//   if (updatedUser) {
//     res.json(updatedUser)
//   } else {
//     res.status(404).json({ message: 'Usuario no encontrado' })
//   }
// })

// router.delete('/:id', async (req, res) => {
//   await UserManager.deleteItem(parseInt(req.params.id))
//   let io = req.app.get('socketio')
//   let deleteUser = await UserManager.readFile()
//   io.emit('user', deleteUser)
//   res.status(204).end()
// })

