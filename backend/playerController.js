import PlayerModel from './playerModel.js'

export const createPlayers = async (req, res) => {
    try {
        const player1 = req.body.player1
        const player2 = req.body.player2
        if (!player1 || !player2) return res.status(400).json({message: 'Please enter player names'})
        const players = {
            rounds: 0,
            draw: 0,
            player1: {
                name: player1,
                score: {
                    win: 0,
                    lose: 0,
                }
            },
            player2: {
                name: player1,
                score: {
                    win: 0,
                    lose: 0,
                }
            }
        }
        const playersCreate = new PlayerModel(players);
        await playersCreate.save()
        return res.status(201).json(playersCreate)
    } catch (error) {
        return error
    }
}

export const getAllPlayers = async (req, res) => {
    try {
        const players = await PlayerModel.find({})
        return res.json(players)
    } catch (error) {
        return error
    }
}

export const getPlayers = async (req, res) => {
    try {
        
    } catch (error) {
        return error
    }
}

export const updatePlayers = async (req, res) => {
    try {
        
    } catch (error) {
            return error
    }
}