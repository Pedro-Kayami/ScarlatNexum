import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

import RepositoryMetro from '../repository/RepositoryMetro'

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
    await client.sendText(message.identifier, messageReturn.text)
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
  } else if (message.message.text === 'Portal') {
    const messageReturn = {
      type: 'text',
      text: 'Descreva sua solicação, por favor.',
    }
    await addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      messageReturn,
      'B',
      true,
    )
    await setBot(message.conversationId, 'coopmetro', 11)
    client.sendText(message.identifier, messageReturn.text)
  } else if (message.message.text === 'Portal') {
    const messageReturn = {
      type: 'text',
      text: 'Descreva sua solicação, por favor.',
    }
    await addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      messageReturn,
      'B',
      true,
    )
    await setBot(message.conversationId, 'coopmetro', 12)
    client.sendText(message.identifier, messageReturn.text)
  } else {
    const messageReturn = {
      type: 'text',
      text: 'Por favor, selecione uma opção válida.',
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
    return
  }
  await RepositoryMetro.updateData(message.conversationId, {
    service_relacioned: message.message.text,
  })
}
