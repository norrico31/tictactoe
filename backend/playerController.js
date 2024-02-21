import PlayerModel from './playerModel.js'

export const getPlayers = async () => {
    try {
        const players = await PlayerModel.find({})
        return players
    } catch (error) {
        return error
    }
}