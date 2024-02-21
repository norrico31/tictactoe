import express from 'express'
import dotenv from 'dotenv'

const app = express()
dotenv.config()

app.get('/', (req, res) => {
    res.send('Hello TICTACTOE')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server Running in ${process.env.NODE_ENV} mode on port ${PORT}`))