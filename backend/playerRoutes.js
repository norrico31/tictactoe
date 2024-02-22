import express from 'express'
import { getPlayers, createPlayers } from './playerController.js'

const router = express.Router()


router.route('/').post(createPlayers).get(getPlayers)

export default router