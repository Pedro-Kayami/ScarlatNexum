import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import {
  addMessageUser,
  updateStatusConversation,
} from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

export async function stage3(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  if (message.message.text === 'Sim') {
    client.sendText(
      message.identifier,
      'Aguarde um momento, pois estou te transferindo para um dos nossos consultores',
    )
    addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      {
        type: 'text',
        text: 'Aguarde um momento, pois estou te transferindo para um dos nossos consultores',
      },
      'B',
      true,
    )
    setBot(message.conversationId, 'NDA', null)
  } else if (message.message.text === 'Não') {
    client.sendText(
      message.identifier,
      'O #Clube agradece seu contato. Em casos de dúvida, entrar em contato através do número #TELEFONE.\nObrigado!',
    )
    addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      {
        type: 'text',
        text: 'O #Clube agradece seu contato. Em casos de dúvida, entrar em contato através do número #TELEFONE.\nObrigado!',
      },
      'B',
      true,
    )
    updateStatusConversation(
      message.conversationId,
      'F',
      'Finalizado pelo bot',
      'BOT',
    )
  } else {
    client.sendText(
      message.identifier,
      'Desculpe, mas a opção digitada não é valida. Por gentileza, selecione uma das opções acima.',
    )
    addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      {
        type: 'text',
        text: 'Desculpe, mas a opção digitada não é valida. Por gentileza, selecione uma das opções acima.',
      },
      'B',
      true,
    )
  }
}
