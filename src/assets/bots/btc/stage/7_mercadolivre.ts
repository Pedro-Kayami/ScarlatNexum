import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

export async function stage7(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  const list = {
    type: 'list',
    buttonText: 'Clique aqui!', // required
    description: 'Selecione uma opção!', // required
    title: 'Obrigado pela informação. Selecione abaixo a opção desejada:',
    sections: [
      {
        title: 'Escolha uma opção:',
        rows: [
          {
            rowId: 'rowid1',
            title: 'Repasse',
          },
          {
            rowId: 'rowid2',
            title: 'Ambulância/Backup',
          },
          {
            rowId: 'rowid3',
            title: 'Viagens/Frete KM',
          },
          {
            rowId: 'rowid4',
            title: 'Avarias',
          },
          {
            rowId: 'rowid5',
            title: 'Descontos',
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
  await setBot(message.conversationId, 'btc', 8)
}
