import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

export async function stage0(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  const messageReturn = {
    type: 'text',
    text: 'Olá, tudo bem?\nSeja bem vindo ao setor de Relacionamento ao Cooperado.\nPara agilizar o seu atendimento, por gentileza, informe o seu CPF ou CNPJ.',
  }
  await addMessageUser(
    message.conversationId,
    'chat',
    message.identifier,
    messageReturn,
    'B',
    true,
  )
  await setBot(message.conversationId, 'coopmetro', 1)
  client.sendText(message.identifier, messageReturn.text)
  return messageReturn
}
