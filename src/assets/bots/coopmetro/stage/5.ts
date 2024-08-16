import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

import RepositoryMetro from '../repository/RepositoryMetro'

export async function stage5(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  if (
    message.message.text === 'Solicitação' ||
    message.message.text === 'Reclamação'
  ) {
    const list = {
      type: 'list',
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      title: 'Qual operação deseja:',
      sections: [
        {
          title: 'Escolha uma opção:',
          rows: [
            {
              rowId: 'rowid1',
              title: 'Outras Operações',
            },
            {
              rowId: 'rowid2',
              title: 'Mercado Livre',
            },
            {
              rowId: 'rowid3',
              title: 'Portal',
            },
          ],
        },
      ],
    }
    await addMessageUser(
      message.conversationId,
      'list',
      message.identifier,
      list,
      'B',
      true,
    )
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'coopmetro', 6)
  } else if (
    message.message.text === 'Sugestão / Elogios' ||
    message.message.text === 'Inovação / Melhorias'
  ) {
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
    client.sendText(message.identifier, messageReturn.text)
    await setBot(message.conversationId, 'coopmetro', 12)
  } else {
    const messageReturn = {
      type: 'text',
      text: 'Opção não encontrada. Por favor, verifique se o número está correto e tente novamente.',
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
    type_service: message.message.text,
  })
}
