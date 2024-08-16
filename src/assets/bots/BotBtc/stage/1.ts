import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import {
  addMessageUser,
  updateOperatorId,
} from '@/assets/api2/services/response/response'
import RepositoryBTC from '@/assets/bots/BotBtc/repository/RepositoryBTC'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

import { dataBTC } from '../repository/InterfaceBTC'

export async function stage1(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  if (message.message.text === 'Social') {
    updateOperatorId(message.conversationId, null, 4)
    client.sendText(
      message.identifier,
      'Ainda não temos eventos agendados para os próximos dias.',
    )
    addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      {
        type: 'text',
        text: 'Ainda não temos eventos agendados para os próximos dias.',
      },
      'B',
      true,
    )
    const list = {
      type: 'list',
      title: 'Posso te ajudar com algo mais?', // required
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      sections: [
        {
          title: 'Opções',
          rows: [
            {
              rowId: '1',
              title: 'Sim',
            },
            {
              rowId: '2',
              title: 'Não',
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
    setBot(message.conversationId, 'btc', 3)
  } else if (message.message.text === 'Restaurantes') {
    client.sendText(
      message.identifier,
      'O horário de funcionamento do nosso restaurente é de segunda a sexta, das #HH até #HH, aos sábados, domingos e feriados das #HH ás #HH.',
    )
    addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      {
        type: 'text',
        text: 'O horário de funcionamento do nosso restaurente é de segunda a sexta, das #HH até #HH, aos sábados, domingos e feriados das #HH ás #HH.',
      },
      'B',
      true,
    )
    const list = {
      type: 'list',
      title: 'Posso te ajudar com algo mais?', // required
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      sections: [
        {
          title: 'Opções',
          rows: [
            {
              rowId: '1',
              title: 'Sim',
            },
            {
              rowId: '2',
              title: 'Não',
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
    setBot(message.conversationId, 'btc', 3)
  } else if (
    message.message.text === 'Secretária' ||
    message.message.text === 'Departamento Financeiro' ||
    message.message.text === 'Reservas' ||
    message.message.text === 'Financeiro' ||
    message.message.text === 'Esportes' ||
    message.message.text === 'Compras'
  ) {
    const data: dataBTC = {
      conversationId: message.conversationId,
      service: message.message.text,
    }
    if (message.message.text === 'Secretária') {
      updateOperatorId(message.conversationId, null, 4)
      RepositoryBTC.addData(message.conversationId, data)
    }
    if (message.message.text === 'Financeiro') {
      RepositoryBTC.addData(message.conversationId, data)
      updateOperatorId(message.conversationId, null, 7)
    }
    if (message.message.text === 'Esportes') {
      RepositoryBTC.addData(message.conversationId, data)
      updateOperatorId(message.conversationId, null, 10)
    }
    if (message.message.text === 'Compras') {
      RepositoryBTC.addData(message.conversationId, data)
      updateOperatorId(message.conversationId, null, 16)
    }
    client.sendText(
      message.identifier,
      'Aguarde um momento, pois estou te transferindo para um dos nossos consultores',
    )
    addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      {
        type: 'text',
        text: 'Aguarde um momento, pois estou te transferindo para um dos nossos consultores',
      },
      'B',
      true,
    )
    setBot(message.conversationId, 'NDA', null)
  } else if (message.message.text === 'Compras') {
    const data: dataBTC = {
      conversationId: message.conversationId,
      service: message.message.text,
    }
    RepositoryBTC.addData(message.conversationId, data)
    updateOperatorId(message.conversationId, null, 16)
    const list = {
      type: 'list',
      title: 'Que tipo de plano você gostaria de estar se associando?', // required
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      sections: [
        {
          title: 'Opções',
          rows: [
            {
              rowId: '1',
              title: 'Individual',
            },
            {
              rowId: '2',
              title: 'Familiar',
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
    setBot(message.conversationId, 'NDA', null)
  } else if (message.message.text === 'Social') {
    client.sendText(
      message.identifier,
      'Ainda não temos eventos agendados para os próximos dias.',
    )
    addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      {
        type: 'text',
        text: 'Ainda não temos eventos agendados para os próximos dias.',
      },
      'B',
      true,
    )
    const list = {
      type: 'list',
      title: 'Posso te ajudar com algo mais?', // required
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      sections: [
        {
          title: 'Opções',
          rows: [
            {
              rowId: '1',
              title: 'Sim',
            },
            {
              rowId: '2',
              title: 'Não',
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
    setBot(message.conversationId, 'btc', 3)
  } else if (
    message.message.text === 'Departamento de Compras' ||
    message.message.text === 'Departamento Financeiro' ||
    message.message.text === 'Secretária' ||
    message.message.text === 'Financeiro'
  ) {
    client.sendText(
      message.identifier,
      'Aguarde um momento, pois estou te transferindo para um dos nossos consultores',
    )
    addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      {
        type: 'text',
        text: 'Aguarde um momento, pois estou te transferindo para um dos nossos consultores',
      },
      'B',
      true,
    )
    setBot(message.conversationId, 'NDA', null)
  } else {
    client.sendText(
      message.identifier,
      'Desculpe, mas a opção digitada não é valida. Por gentileza, selecione uma das opções acima.',
    )
    addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      {
        type: 'text',
        text: 'Desculpe, mas a opção digitada não é valida. Por gentileza, selecione uma das opções acima.',
      },
      'B',
      true,
    )
  }
}
