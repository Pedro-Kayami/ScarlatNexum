import bodyParser from 'body-parser'
import express, { Request } from 'express'

import meuEmitter from '@/modules/Events/Emitter.js'

import { getMessagesId, obterDadosProtocolos } from '../utils/utilsGet.js'

const router = express.Router()

router.use(
  bodyParser.json({
    limit: '50mb',
  }),
)

router.post('/protocolos', retornaWebhookProtocolos)

router.get('/getMessages', getMessagesId)

router.get('/getConversations', obterDadosProtocolos)

function retornaWebhookProtocolos(req: Request): void {
  meuEmitter.emit('protocolos', req.body)
}

export default router
