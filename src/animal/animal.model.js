import { model, Schema } from 'mongoose'

const animalSchema = Schema({
    name: {
        type: String,
        required: true
    },
    race: {
        type: String,
        required: true
    },
    years: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    keeper: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    }
})

export default model('animal', animalSchema)