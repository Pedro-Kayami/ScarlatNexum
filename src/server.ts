/* eslint-disable @typescript-eslint/no-unused-vars */
import '@/assets/Host/HostExpress.js'

import * as dotenv from 'dotenv'

import { conversation } from '@/assets/api2/enums/enumRequest.js'
import { MessageResponse } from '@/assets/api2/enums/enumResponse.js'
// import { MessageRequest } from '@/assets/bot'
import { generateBot } from '@/assets/bots/index.js'
import { setBot } from '@/assets/bots/utils/utils'
import { dispararHook } from '@/assets/Host/serverReturns/webhook/webhook.js'
import meuEmitter from '@/modules/Events/Emitter.js'
import {
  generateId,
  getStage,
} from '@/modules/Packages/utils/generateConversation.js'
import ScarlatWpp from '@/modules/Packages/wpp_modules/ScarlatWpp/Sistema/sistema'

dotenv.config()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filaDeMensagens: any = []

let processandoFila = false

ScarlatWpp.getConnection()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
meuEmitter.on('message', async (message: any) => {
  filaDeMensagens.push(message)
  await processarFila()
})

async function processarFila(): Promise<void> {
  if (processandoFila) {
    return
  }

  processandoFila = true

  try {
    while (filaDeMensagens.length > 0) {
      const message = filaDeMensagens.shift()
      if (!message) {
        console.error('Mensagem inválida na fila')
        continue
      }
      let data: MessageResponse = message

      if (process.env.NXZAP_LITE === 'false') {
        data = await (await generateId(message, 'U')).data
        console.log('data', data)
        const botData: conversation = await getStage(data.conversationId)
        data.provider = botData.provider
        data.stage = botData.stage
        data.botId = botData.botId
        if (botData.botId && botData.botId !== 'NDA') {
          await generateBot(data, botData.stage, botData.botId)
        } else if (botData.botId === 'NDA') {
          console.log("BotId === 'NDA'")
        } /* else {
          await setBot(data.conversationId, 'btc', 0)
          await generateBot(data, 0, 'btc')
        } */
      }
      dispararHook(data)
    }
  } catch (error) {
    console.error('Erro ao processar fila:', error)
  } finally {
    processandoFila = false
  }
}
