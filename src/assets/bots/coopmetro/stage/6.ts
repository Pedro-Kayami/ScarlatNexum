import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

export async function stage6(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  if (message.message.text === 'Mercado Livre') {
    const messageReturn = {
      type: 'text',
      text: 'Por gentileza, informe: qual a região em que você carrega?',
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
    await setBot(message.conversationId, 'coopmetro', 7)
  } else if (message.message.text === 'Outras Operações') {
    const messageReturn = {
      type: 'text',
      text: 'Por gentileza, informe: qual a cidade da sua operação ou seu Service Center?',
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
    await setBot(message.conversationId, 'coopmetro', 9)
  }
}
