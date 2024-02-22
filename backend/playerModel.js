
import mongoose from "mongoose";

const playersSchema = new mongoose.Schema({
    rounds: Number,
    draw: Number,
    player1: {
        name: String,
        score: {
            win: Number,
            lose: Number,
        }
    },
    player2: {
        name: String,
        score: {
            win: Number,
            lose: Number,
        }
    }
}, {timestamps: true})

const Players = mongoose.model('Player', playersSchema)

export default Players