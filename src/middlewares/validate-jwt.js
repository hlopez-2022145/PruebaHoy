'use strict'

import jwt from 'jsonwebtoken'
import User from '../user/user.model.js'

export const validateJwt = async (req, res, next) => {
    try {
        //Obtener la llave de acceso al token 
        let secretKey = process.env.SECRET_KEY
        //Obtener el token de los headers
        let { token } = req.headers
        //Verificar so viene el token 
        if (!token) return res.status(401).send({ Message: 'Unauthorized' })
        //Obtener el uid quue envio el token
        let { uid } = jwt.verify(token, secretKey)
        //Validar si el usuario aun existe en la DB
        let user = await User.findOne({ _id: uid })
        if (!user) return res.status(404).send({ Message: 'User not found - Unauthorized' })
        //Ok del Middleaware
        req.user = user
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).send({ Message: 'Invalid token or expired' })
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        let { role, username } = req.user
        if(!role || role !== 'ADMIN') return res.status(403).send({Message: `You dont have acces | username ${username}`})
        next() 
    } catch (err) {
        console.error(err)
        return res.status(401).send({ Message: 'Unauthorized role' })
    }
} 