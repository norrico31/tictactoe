import express from 'express'
import {getAllPlayers, getPlayersById, createPlayers, updatePlayers, clearGameData } from './playerController.js'

const router = express.Router()


router.route('/').post(createPlayers).get(getAllPlayers)
router.route('/:id').get(getPlayersById).put(updatePlayers)
router.route('/:id/clear').put(clearGameData)

export default router