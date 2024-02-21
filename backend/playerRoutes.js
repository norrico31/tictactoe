import express from 'express'
import { getPlayers } from './playerController.js'

const router = express.Router()


router.route('/').get(getPlayers)

export default router