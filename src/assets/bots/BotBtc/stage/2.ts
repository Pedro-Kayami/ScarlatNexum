import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

export async function stage2(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  const lista = [
    'Futebol',
    'Tenis',
    'Beach Tenis',
    'Volei',
    'Futvolei',
    'Natação',
    'Academia',
    'Escolinha de Futebol',
  ]
  if (lista.includes(message.message.text)) {
    // const dataEsporte = getEsporte(message.message.text)
    client.sendText(
      message.identifier,
      'O horario de funcionamento do(a) #Esporte é de segunda a sexta, das #HH até #HH, aos sábados, domingos e feriados das #HH ás #HH',
    )
    addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      {
        type: 'text',
        text: 'O horario de funcionamento do(a) #Esporte é de segunda a sexta, das #HH até #HH, aos sábados, domingos e feriados das #HH ás #HH',
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
// function getEsporte(dataEsporte) {
//   return dataEsporte
// }
