/* eslint-disable @typescript-eslint/no-unused-vars */
import * as dotenv from 'dotenv'

import Hospedagem from '@/assets/Host/HostExpress.js'
import { dispararHook } from '@/assets/Host/serverReturns/webhook/webhook.js'
import { generateId } from '@/modules/Conversations/generateConversations.js'
import meuEmitter from '@/modules/Events/Emitter.js'
import ScarlatWpp from '@/modules/Packages/wpp_modules/ScarlatWpp/Sistema/sistema.js'

dotenv.config()
// eslint-disable-next-line no-unused-expressions
Hospedagem.all

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const filaDeMensagens: any = []

let processandoFila = false

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

      const data = await generateId(message, 'U')
      await dispararHook(data)
    }
  } catch (error) {
    console.error('Erro ao processar fila:', error)
  } finally {
    processandoFila = false
  }
}
