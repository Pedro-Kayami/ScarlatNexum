import { GetConversationUseCase } from '@/assets/api2/usecase/getConversationUseCase.js'
import { GetMessagesUseCase } from '@/assets/api2/usecase/getMessageUseCase.js'
import { GetOneConversationUseCase } from '@/assets/api2/usecase/getOneConversationUseCase.js'
import { GetPagesUseCase } from '@/assets/api2/usecase/getPagesUseCase.js'
import { GetQrCodeUseCase } from '@/assets/api2/usecase/getQrCodeUseCase.js'
import { PatchReadMessageUseCase } from '@/assets/api2/usecase/patchReadMessageUseCase.js'
import { PostControllerBotUseCase } from '@/assets/api2/usecase/postControllerBotUseCase.js'
import { PostCreateConversationUseCase } from '@/assets/api2/usecase/postCreateConversationUseCase.js'
import { PostSendMessageUseCase } from '@/assets/api2/usecase/postSendMessageUseCase.js'
import { PostUpdateConversationUseCase } from '@/assets/api2/usecase/postUpdateConversationUseCase.js'
import { PutUpdateOperatorUseCase } from '@/assets/api2/usecase/putUpdateOperatorUseCase.js'
import bodyParser = require('body-parser')
import express = require('express')
const router = express.Router()
router.use(
  bodyParser.json({
    limit: '100mb',
  }),
)

router.get('/getMessages', GetMessagesUseCase)
router.get('/getConversations', GetConversationUseCase)
router.get('/getQrCode', GetQrCodeUseCase)
router.get('/getOneConversation', GetOneConversationUseCase)
router.get('/getPages', GetPagesUseCase)
router.patch('/readMessage', PatchReadMessageUseCase)
router.post('/sendMessage', PostSendMessageUseCase)
router.post('/createConversation', PostCreateConversationUseCase)
router.post('/updateConversation', PostUpdateConversationUseCase)
router.post('/controllerBot', PostControllerBotUseCase)
router.put('/updateOperator', PutUpdateOperatorUseCase)

export default router
