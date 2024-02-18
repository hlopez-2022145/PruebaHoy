'use strict'

import { Router } from 'express'
import { addAnimal, update, deleteAni, get, search } from './animal.controller.js'

const api = Router()

api.post('/addAnimal', addAnimal)
api.put('/update/:id', update)
api.delete('/delete/:id', deleteAni)
api.get('/get', get)
api.post('/search', search)

export default api