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
                name: player2,
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
        return res.status(200).json(players)
    } catch (error) {
        return error
    }
}

export const getPlayersById = async (req, res) => {
    try {
        const data = await PlayerModel.findById(req.params.id)
        return res.status(200).json(data)
    } catch (error) {
        return error
    }
}

export const updatePlayers = async (req, res) => {
    try {
        const winner = req.body.winner;
        const id = req.params.id
        const existingGamePlay = await PlayerModel.findById(id)
        // let payload = roundWinner(winner, existingGamePlay)
        // existingGamePlay.markModified('player')
        if (winner === 'player1') {
            console.log('player1')
            existingGamePlay.rounds = existingGamePlay.rounds +1;
            existingGamePlay.draw = existingGamePlay.draw;
            existingGamePlay.player1.name = existingGamePlay.player1.name;
            existingGamePlay.player1.score.win = existingGamePlay.player1.score.win + 1;
            existingGamePlay.player1.score.lose = existingGamePlay.player1.score.lose;

            existingGamePlay.player2.name = existingGamePlay.player2.name;
            existingGamePlay.player2.score.win = existingGamePlay.player2.score.win;
            existingGamePlay.player2.score.lose = existingGamePlay.player2.score.lose === 0 ? 0 : (existingGamePlay.player2.score.lose + 1);
        }
        else if (winner === 'player2') {
            console.log('player2')
            existingGamePlay.rounds = existingGamePlay.rounds +1;
            existingGamePlay.draw = existingGamePlay.draw;
            existingGamePlay.player1.name = existingGamePlay.player1.name;
            existingGamePlay.player1.score.win = existingGamePlay.player1.score.win;
            existingGamePlay.player1.score.lose = existingGamePlay.player1.score.lose === 0 ? 0 : existingGamePlay.player1.score.lose;
            
            existingGamePlay.player2.name = existingGamePlay.player2.name;
            existingGamePlay.player2.score.win = existingGamePlay.player2.score.win + 1;
            existingGamePlay.player2.score.lose = existingGamePlay.player2.score.lose;
        } else {
            console.log('draw')
            existingGamePlay.rounds = existingGamePlay.rounds +1;
            existingGamePlay.draw = existingGamePlay.draw + 1;

        }
        await existingGamePlay.save()
        console.log('res: ', existingGamePlay)
        return res.json(existingGamePlay)
    } catch (error) {
            return error
    }
}

function roundWinner(winner, existingGamePlay) {
    switch (winner) {
        case 'player1': 
            return {
                draw: existingGamePlay.draw,
                rounds: existingGamePlay.rounds + 1,
                player1: {
                    name: existingGamePlay.player1.name,
                    score: {
                        lose: existingGamePlay.player1.score.lose,
                        win: existingGamePlay.player1.score.win + 1
                    }
                },
                player2: {
                    name: existingGamePlay.player2.name,
                    score: {
                        lose: existingGamePlay.player2.score.lose === 0 ? 0 : (existingGamePlay.player2.score.lose + 1),
                        win: existingGamePlay.player2.score.win
                    }
                },
            }
        case 'player2':
                return {
                    draw: existingGamePlay.draw,
                    rounds: existingGamePlay.rounds + 1,
                    player1: {
                    name: existingGamePlay.player1.name,
                    score: {
                        lose: existingGamePlay.player1.score.lose === 0 ? 0 : (existingGamePlay.player1.score.lose + 1),
                        win: existingGamePlay.player1.score.win + 1
                    }
                    },
                    player2: {
                        name: existingGamePlay.player2.name,
                        score: {
                            lose: existingGamePlay.player2.score.lose,
                            win: existingGamePlay.player2.score.win + 1
                        }
                    },
                }
        case 'draw': 
                return {
                    ...existingGamePlay,
                    rounds: existingGamePlay.rounds + 1,
                    draw: existingGamePlay.draw + 1,
                }
        default: winner
                
    }
}