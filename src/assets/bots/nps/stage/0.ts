import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import {
  addMessageUser,
  updateStatusConversation,
} from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

export async function stage0(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  const notas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  if (notas.includes(message.message.text)) {
    const messageReturn = {
      type: 'text',
      text: 'Obrigado pela avaliação! Sua opinião é muito importante para nós. 😊',
    }
    await addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      messageReturn,
      'B',
      true,
    )
    await setBot(message.conversationId, 'NDA', null)
    await updateStatusConversation(message.conversationId, 'F')
    client.sendText(message.identifier, messageReturn.text)
  } else {
    const messageReturn = {
      type: 'text',
      text: 'Nota não reconhecida. Por favor, digite uma nota de 1 a 10.',
    }
    await addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      messageReturn,
      'B',
      true,
    )
    client.sendText(message.identifier, messageReturn.text)
  }
}
