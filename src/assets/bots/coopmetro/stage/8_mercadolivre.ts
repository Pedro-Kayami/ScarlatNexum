import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

export async function stage8(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  let list
  if (message.message.text === 'Repasse') {
    list = {
      type: 'list',
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      title: 'Agora selecione abaixo o assunto que deseja tratar:',
      sections: [
        {
          title: 'Escolha uma opção:',
          rows: [
            {
              rowId: '1',
              title: 'Envio de Repasse',
            },
            {
              rowId: '2',
              title: 'Data de repasse',
            },
            {
              rowId: '3',
              title: 'Retenção de impostos',
            },
            {
              rowId: '4',
              title: 'Taxa administrativa',
            },
            {
              rowId: '5',
              title: 'Ausência de repasse',
            },
          ],
        },
      ],
    }
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'NDA', null)
  } else if (message.message.text === 'Ambulância/Backup') {
    list = {
      type: 'list',
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      title: 'Agora selecione abaixo o assunto que deseja tratar:',
      sections: [
        {
          title: 'Escolha uma opção:',
          rows: [
            {
              rowId: '1',
              title: 'Passei',
            },
            {
              rowId: '2',
              title: 'Utilitário',
            },
          ],
        },
      ],
    }
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'NDA', null)
  } else if (message.message.text === 'Viagens/Frete KM') {
    list = {
      type: 'list',
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      title: 'Agora selecione abaixo o assunto que deseja tratar:',
      sections: [
        {
          title: 'Escolha uma opção:',
          rows: [
            {
              rowId: '1',
              title: 'Frete não pago',
            },
            {
              rowId: '2',
              title: 'Fretes pagos a menos',
            },
            {
              rowId: '3',
              title: 'Fretes não pagos',
            },
            {
              rowId: '4',
              title: 'Paradas',
            },
          ],
        },
      ],
    }
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'NDA', null)
  } else if (message.message.text === 'Avarias') {
    list = {
      type: 'list',
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      title: 'Agora selecione abaixo o assunto que deseja tratar:',
      sections: [
        {
          title: 'Escolha uma opção:',
          rows: [
            {
              rowId: '1',
              title: 'PNR',
            },
            {
              rowId: '2',
              title: 'Extravio',
            },
            {
              rowId: '3',
              title: 'Indicador de Rota',
            },
          ],
        },
      ],
    }
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'NDA', null)
  } else if (message.message.text === 'Descontos') {
    list = {
      type: 'list',
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      title: 'Agora selecione abaixo o assunto que deseja tratar:',
      sections: [
        {
          title: 'Escolha uma opção:',
          rows: [
            {
              rowId: '1',
              title: 'Insumos/Serviços',
            },
            {
              rowId: '2',
              title: 'Abastecimento',
            },
            {
              rowId: '3',
              title: 'Integralização',
            },
            {
              rowId: '4',
              title: 'Seguro veículo',
            },
          ],
        },
      ],
    }
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'NDA', null)
  } else {
    const messageReturn = {
      type: 'text',
      text: 'Opção inválida. Por favor, selecione uma opção válida.',
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
  await addMessageUser(
    message.conversationId,
    'list',
    message.identifier,
    list,
    'B',
    true,
  )
}
