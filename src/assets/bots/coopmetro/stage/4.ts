import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { getClient } from '@/modules/Client/client'

import { setBot } from '../../utils/utils'

export async function stage4(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  const qtdPlacas = ['PLACA 1234-ABCDF', 'PLACA 1234-ABCDF']
  if (qtdPlacas.includes(message.message.text)) {
    const list = {
      type: 'list',
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      title:
        'Obrigado pelas informações. Por gentileza, selecione abaixo a opção desejada:',
      sections: [
        {
          title: 'Escolha uma opção:',
          rows: [
            {
              rowId: 'rowid1',
              title: 'Operações',
            },
            {
              rowId: 'rowid2',
              title: 'Lojas Cooperado',
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
    await setBot(message.conversationId, 'coopmetro', 5)
  } else {
    const messageReturn = {
      type: 'text',
      text: 'Placa não encontrada. Por favor, verifique se o número está correto e tente novamente.',
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
