import { GetConversationUseCase } from '@/assets/api2/usecase/getConversationUseCase.js'
import { GetMessagesUseCase } from '@/assets/api2/usecase/getMessageUseCase.js'
import { GetQrCodeUseCase } from '@/assets/api2/usecase/getQrCodeUseCase.js'
import { PatchReadMessageUseCase } from '@/assets/api2/usecase/patchReadMessageUseCase.js'
import { PostCreateConversationUseCase } from '@/assets/api2/usecase/postCreateConversationUseCase.js'
import { PostSendMessageUseCase } from '@/assets/api2/usecase/postSendMessageUseCase.js'
import { PostUpdateConversation } from '@/assets/api2/usecase/postUpdateConversation.js'
import { PutUpdateOperator } from '@/assets/api2/usecase/putUpdateOperator.js'
import bodyParser = require('body-parser')
import express = require('express')

const router = express.Router()

router.use(
  bodyParser.json({
    limit: '50mb',
  }),
)

router.get('/getMessages', GetMessagesUseCase)
router.get('/getConversations', GetConversationUseCase)
router.get('/getQrCode', GetQrCodeUseCase)
router.patch('/readMessage', PatchReadMessageUseCase)
router.post('/sendMessage', PostSendMessageUseCase)
router.post('/createConversation', PostCreateConversationUseCase)
router.post('/updateConversation', PostUpdateConversation)
router.put('/updateOperator', PutUpdateOperator)

export default router
