import express from 'express'
import {getAllPlayers, getPlayers, createPlayers } from './playerController.js'

const router = express.Router()


router.route('/').post(createPlayers).get(getAllPlayers)
router.route('/:id').get(getPlayers)

export default router