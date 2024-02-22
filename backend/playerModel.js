
import mongoose from "mongoose";

const playersSchema = new mongoose.Schema({
    player1: {
        name: String,
        score: {
            win: Number,
            lose: Number,
            draw: Number,
        }
    },
    player2: {
        name: String,
        score: {
            win: Number,
            lose: Number,
            draw: Number,
        }
    }
}, {timestamps: true})

const Players = mongoose.model('Player', playersSchema)

export default Players