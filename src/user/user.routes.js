'use strict'

//Rutas del usuario
import express from 'express'
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js'
import { test, register, login, update, deleteU } from './user.controlller.js'

const api = express.Router()

api.get('/test', [validateJwt, isAdmin], test)// solo si esta logeado
api.post('/register', register )
api.post('/login', login)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteU)

export default api 

// export const api /tengo que utilizar si o si el nombre que esta en este archivo "api"
//export default api //puedo importar con otro nombre
