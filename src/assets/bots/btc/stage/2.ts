import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

export async function stage2(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  const qtdPlacas = ['PLACA 1234-ABCDF', 'PLACA 1234-ABCDF']
  if (message.message.text === 'Sim') {
    if (qtdPlacas.length > 1) {
      const list = {
        type: 'list',
        title: 'Selecione a placa do veículo:', // optional
        buttonText: 'Clique aqui!', // required
        description: 'Selecione uma opção!', // required
        sections: [
          {
            title: 'Escolha uma opção:',
            rows: qtdPlacas.map((placa, index) => {
              return {
                rowId: `rowid${index + 1}`,
                title: placa,
              }
            }),
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
      await setBot(message.conversationId, 'btc', 4)
    } else {
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
                rowId: 'rowid2',
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
      await setBot(message.conversationId, 'btc', 5)
    }
  } else if (message.message.text === 'Não') {
    const messageReturn = {
      type: 'text',
      text: 'Certo! Por gentileza, informe o seu nome, para que eu possa registrar em nosso atendimento.',
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
    await setBot(message.conversationId, 'btc', 3)
  }
}
