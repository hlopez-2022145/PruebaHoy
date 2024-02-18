'use strict'

import User from '../user/user.model.js'
import { checkUpdate } from '../utils/validator.js'
import Animal from './animal.model.js'

export const addAnimal = async (req, res) => {
    try {
        let data = req.body
        //Validar que el keeper exista(buscar a la DB)
        let user = await User.findOne({_id: data.keeper })
        if (!user) return res.status(404).send({ message: 'Keeper not found' })
        //Crear la instancia para el animal
        let animal = new Animal(data)
        //Guardar el animal 
        await animal.save()
        //Responder si todo sale bien 
        return res.send({ message: 'Animal saved successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error aggregate animal', err })
    }
}

//Listar
export const get = async(req, res) => {
    try{
        let animals = await Animal.find()
        if(!animals.length == 0) return res.status(404).send({message: 'Not found'})
        return res.send({animals})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error gettind animals'})
    }
}

//UPDATE
export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = checkUpdate(data, false)
        if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be updated or missing data'})
        let updateAnimal = await Animal.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).populate('keeper', ['name', 'phone'])

        if (!updateAnimal) return res.status(401).send({ message: 'Animal not found and not updated' })
        return res.send({ message: 'Updated animal', updateAnimal })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error updating animal' })
    }
}

//DELETE
export const deleteAni = async (req, res) => {
    try {
        let { id } = req.params
        let deleteAnimal = await Animal.findOneAndDelete({ _id: id })
        if (!deleteAnimal.deleteCount == 0) return res.status(404).send({ message: 'Animal not found, not deleted' })
        return res.send({ message: `Deleted animal seccessfully` })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ message: 'Error deleting animal' })
    }
}

//BUSCAR
export const search = async (req, res) => {
    try{
        //Obtener parametros de busqueda
        let { search } = req.body
        //Buscar
        let animals = await Animal.find(
            {name: search}
        ).populate('keeper', ['name', 'phone'])
        //valirdar la respuesta
        if(animals.length == 0) return res.status(404).send({message: 'animal not found'})
        //Responder si todo sale bien
    return res.send({message: 'animal found', animals})
    }catch(err){
        console.error(err)
        return res.status(500).send({message: 'Error serarching animals'})
    }
}
