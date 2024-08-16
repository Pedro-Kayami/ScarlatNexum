import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import {
  addMessageUser,
  updateStatusConversation,
} from '@/assets/api2/services/response/response'
import { getClient } from '@/modules/Client/client'

import { aprovarProcesso } from '../BPM/AbrirApiBpm'
import RepositoryMetro from '../repository/RepositoryMetro'

export async function stage12(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  await RepositoryMetro.updateData(message.conversationId, {
    description: message.message.text,
  })
  const messageReturn = {
    type: 'text',
    text: 'Estamos analisando a sua solicitação. Em breve entraremos em contato. Muito obrigado!',
  }
  await addMessageUser(
    message.conversationId,
    'chat',
    message.identifier,
    messageReturn,
    'B',
    true,
  )
  await RepositoryMetro.updateData(message.conversationId, {
    description: message.message.text,
  })
  await aprovarProcesso(message.conversationId, message.identifier)
  await updateStatusConversation(message.conversationId, 'F')
  client.sendText(message.identifier, messageReturn.text)
}
