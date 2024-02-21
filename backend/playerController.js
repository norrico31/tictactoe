import PlayerModel from './playerModel.js'

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