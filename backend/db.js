import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb+srv://tictactoe:players31@mongoose-express.lhkys.mongodb.net/')
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (err) {
        console.error(`Error: ${err.message}`)
        process.exit(1)     
    }
}
export default connectDB