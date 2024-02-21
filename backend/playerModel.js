
import mongoose from "mongoose";


export default mongoose.model('Player', mongoose.Schema({
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
}, { timeStamps: true}))