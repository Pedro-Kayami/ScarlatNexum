import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

export async function stage0(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  const clientBase = true
  if (clientBase) {
    const list = {
      type: 'list',
      title:
        'Olá, tudo bem?\n para agilizar o seu atendimento, escolha uma das opções abaixo!',
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      sections: [
        {
          title: 'Opções',
          rows: [
            {
              rowId: '1',
              title: 'Secretária',
            },
            {
              rowId: '2',
              title: 'Financeiro',
            },
            {
              rowId: '3',
              title: 'Esportes',
            },
            {
              rowId: '4',
              title: 'Social',
            },
            {
              rowId: '5',
              title: 'Restaurantes',
            },
            {
              rowId: '6',
              title: 'Reservas',
            },
          ],
        },
      ],
    }
    addMessageUser(
      message.conversationId,
      'list',
      message.identifier,
      list,
      'B',
      true,
    )
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'btc', 1)
  } else {
    const list = {
      type: 'list',
      title:
        'Olá, tudo bem?\n para agilizar o seu atendimento, escolha uma das opções abaixo!',
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      sections: [
        {
          title: 'Opções',
          rows: [
            {
              rowId: '1',
              title: 'Quero virar sócio',
            },
            {
              rowId: '2',
              title: 'Departamento de Compras',
            },
            {
              rowId: '3',
              title: 'Departamento Financeiro',
            },
            {
              rowId: '4',
              title: 'Secretária',
            },
            {
              rowId: '5',
              title: 'Social',
            },
          ],
        },
      ],
    }
    addMessageUser(
      message.conversationId,
      'list',
      message.identifier,
      list,
      'B',
      true,
    )
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'btc', 1)
  }
}
