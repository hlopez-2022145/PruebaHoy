// Configuración de Express

//importaciones
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from 'dotenv'
import userRoutes from '../src/user/user.routes.js'
import animalRoutes from '../src/animal/animal.routes.js'

//Confoguraciones
const app = express()//crear el servidor
config()
const port = process.env.PORT || 3200
//Configurar el servidor de express 
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(cors())//Aceptar o denegar las solicitudes de direfentes origenes (local, remoto)/olitica de acceso
app.use(helmet())
app.use(morgan('dev'))// Crea Logs de solicitudes al servidor HTTP

//Declaracion de rutas
app.use(userRoutes)
app.use('/animal', animalRoutes)
//Levantar el servidor
export const initServer = ()=>{
    app.listen(port)
    console.log(`Server HTTP running in port ${port}`)
}