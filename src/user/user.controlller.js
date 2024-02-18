'use strict'

import User from './user.model.js' //Único que puede ir en mayúscula
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'
import { generateJwt } from '../utils/jwt.js'

export const test = (req, res)=>{
    return res.send('Hello World')
}

//REGISTRAR
export const register = async(req, res)=>{//solo para clientes
    try{
        //captar la informacion del cliente (body)
        let data = req.body
        //Encriptar la contraseña
        data.password = await encrypt(data.password)
        //Asignar el rol por defecto
        data.role = 'CLIENT'//Si viene con otros valor o no viene, la asignacion a role cliente
        //Crear una instancia del modelo (schema)
        let user = new User(data)
        //Guardar la información 
        await user.save()
        //Respondo al usuario
        return res.send({message: 'Registered successfully'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error registering user', err})
    }
}

//LOGIN
export const login =  async(req,  res)=>{
    try{
        //capturar la información (body)
        let { username, password } = req.body
        //Validar que el usuario exista
        let user = await User.findOne({username})
        //verificar que la contraseña coincida
        if(user && await checkPassword(password, user.password)){
            let loggedUser = {
                uid: user._id,
                username: user.username,
                name: user.name,
                role: user.role
            }
            let token = await generateJwt(loggedUser)
            //responder (dar acceso)
            return res.send({
                msg: `Welcome ${user.name}`,
                loggedUser,
                token
            })
        }
        //Respondr (dar acceso)
        return res.status(404).send({message: 'Invalid credentials'})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Failed to login', err})
    }
}

//UPDATE
export const update = async(req, res)=>{//usuarios logiados
    try{
        //Obtener el id del usuario o actualizar
        let { id } = req.params
        //Obtener datos que vamos a actualizar
        let data = req.body
        //Validar si trae datos a actualizar
        let update = checkUpdate(data, id)
        if(!update) return res.status(400).send({message: 'have submitted some data tahat cannot be updated or missing data'})
        //Validar si tiene permisos
        //Actualizar en la DB
        let updateUser = await User.findOneAndUpdate(
            {_id: id},//ObjectId <- hexadecimal (hora sys, version mongo, llave privada..)
            data,//Datos que va a actualizar
            {new: true}//Objeto de la DB ya actualizado
        )
        //Validar si se actualizó
        if(!updateUser) return res.status(401).send({message: 'User not found and not updated'})
        //Responder con el dato actualizado
        return res.send({message: 'Updated user', updateUser})
    }catch(err){
        console.error(err)
        if(err.keyValue.username) return res.status(400).send({message: `Username ${err.keyValue.username} is already taken`})
        return res.status(500).send({message: `Error updating account`})
    }
}

//DELETE
export const deleteU = async(req, res)=>{
    try{
        //Obtener el id
        let { id } = req.params
        //Validar si está logeado y es el mismo X no lo vemos X
        //Eliminar (deleteOne / findOneAndDelete)
        let deleteUser = await User.findOneAndDelete({_id: id})
        //Verificar que se eliminó
        if(!deleteUser) return res.status(404).send({message: 'Account not found and not deleted'})
        //Responder
        return res.send({message: `Account with username ${deleteUser.username} deleted seccessfully`})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error deleting account'})
    }
}