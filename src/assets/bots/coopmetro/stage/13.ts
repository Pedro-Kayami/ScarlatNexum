import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

import RepositoryMetro from '../repository/RepositoryMetro'

export async function stage13(message: MessageResponse) {
  await RepositoryMetro.addData(message.conversationId, {
    name_mother: message.message.text.toUpperCase(),
  })

  const client: ClientType = await getClient(message.provider)
  const messageReturn = {
    type: 'text',
    text: 'Informe o seu CPF/CNPJ, por favor.',
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
