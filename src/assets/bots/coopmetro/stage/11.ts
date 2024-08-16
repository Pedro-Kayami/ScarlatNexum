import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

import RepositoryMetro from '../repository/RepositoryMetro'

export async function stage11(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  await RepositoryMetro.updateData(message.conversationId, {
    details_aditional: message.message.text,
  })
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
}
