import bodyParser from 'body-parser'
import express, { Router } from 'express'

import {
  createConversationId,
  sendAPI,
  updateConversation,
  updateNotReads,
} from '../utils/utilsPost.js'

const router: Router = express.Router()

router.use(
  bodyParser.json({
    limit: '50mb',
  }),
)

router.patch('/readMessage', updateNotReads)
router.post('/sendMessage', sendAPI)
router.post('/createConversation', createConversationId)
router.put('/updateConversation', updateConversation)

export default router
