import express from 'express'
import {getAllPlayers, getPlayersById, createPlayers, updatePlayers } from './playerController.js'

const router = express.Router()


router.route('/').post(createPlayers).get(getAllPlayers)
router.route('/:id').get(getPlayersById).put(updatePlayers)

export default router