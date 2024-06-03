/* eslint-disable @typescript-eslint/no-unused-vars */
import '@/assets/Host/HostExpress.js'

import * as dotenv from 'dotenv'

import { dispararHook } from '@/assets/Host/serverReturns/webhook/webhook.js'
import meuEmitter from '@/modules/Events/Emitter.js'
import { generateId } from '@/modules/Packages/utils/generateConversation.js'
import { loadClient } from '@/modules/Packages/wpp_modules/ScarlatWpp/Sistema/sistema.js'

import { MessageResponse } from './assets/api2/enums/enumResponse.js'

dotenv.config()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filaDeMensagens: any = []

let processandoFila = false

loadClient()

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

      

      const data: MessageResponse = await generateId(message, 'U')
      dispararHook(data)
    }
  } catch (error) {
    console.error('Erro ao processar fila:', error)
  } finally {
    processandoFila = false
  }
}
