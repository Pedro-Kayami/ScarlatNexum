import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

import RepositoryMetro from '../repository/RepositoryMetro'

export async function stage10(message: MessageResponse) {
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
              rowId: 'rowid1',
              title: 'Envio de Repasse',
            },
            {
              rowId: 'rowid2',
              title: 'Data da operação',
            },
            {
              rowId: 'rowid3',
              title: 'Retenção de impostos',
            },
            {
              rowId: 'rowid4',
              title: 'Taxa administrativa',
            },
          ],
        },
      ],
    }
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'coopmetro', 11)
  } else if (message.message.text === 'Viagens/ Romaneio / Rota') {
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
              rowId: 'rowid1',
              title: 'Frete não pago',
            },
            {
              rowId: 'rowid2',
              title: 'Fretes pagos a menos',
            },
            {
              rowId: 'rowid3',
              title: 'Pedágios não pago',
            },
            {
              rowId: 'rowid4',
              title: 'Disponivel não carregado',
            },
            {
              rowId: 'rowid5',
              title: 'Diária/Pernoite',
            },
          ],
        },
      ],
    }
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'coopmetro', 11)
  } else if (message.message.text === 'Debitos') {
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
              rowId: 'rowid1',
              title: 'Avarias',
            },
            {
              rowId: 'rowid2',
              title: 'Abastecimento',
            },
            {
              rowId: 'rowid3',
              title: 'Adiantamento',
            },
            {
              rowId: 'rowid4',
              title: 'Insumos',
            },
          ],
        },
      ],
    }
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'coopmetro', 11)
  } else if (message.message.text === 'Outros Assuntos') {
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
              rowId: 'rowid1',
              title: 'Informe de rendimento',
            },
            {
              rowId: 'rowid2',
              title: 'Loja Cooperado',
            },
            {
              rowId: 'rowid3',
              title: 'Cadastro',
            },
            {
              rowId: 'rowid4',
              title: 'Integralização',
            },
            {
              rowId: 'rowid5',
              title: 'Desligamento',
            },
          ],
        },
      ],
    }
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'coopmetro', 11)
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
  await RepositoryMetro.updateData(message.conversationId, {
    subject: message.message.text,
  })
  await addMessageUser(
    message.conversationId,
    'list',
    message.identifier,
    list,
    'B',
    true,
  )
}
