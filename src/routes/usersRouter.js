import express from 'express'
import { UsersController } from '../controller/UsersController.js'

export const router = express.Router()

router.get('/', UsersController.getUsers)

router.get('/:id', UsersController.getUserById)

router.post('/', UsersController.createUser)

router.put('/:id', UsersController.updateUser)

router.delete("/:id", UsersController.deleteUser)





