import express from 'express'
import { UsersController } from '../controller/UsersController.js'
import { authAdmin } from '../middleware/auth.js'

export const router = express.Router()

router.get('/', authAdmin, UsersController.getUsers)

router.get('/:id', UsersController.getUserById)

router.post('/', UsersController.createUser)

router.put('/:id', UsersController.updateUser)

router.delete("/:id", UsersController.deleteUser)





