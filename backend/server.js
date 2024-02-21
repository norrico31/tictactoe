import express from 'express'
import dotenv from 'dotenv'
import db from './db.js'
import playerRoutes from './playerRoutes.js'

const app = express()
dotenv.config()
db();

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello TICTACTOE')
})

app.use('/api/players', playerRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`))