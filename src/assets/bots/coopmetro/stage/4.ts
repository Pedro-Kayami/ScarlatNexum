import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { getClient } from '@/modules/Client/client'

import { setBot } from '../../utils/utils'
import RepositoryMetro from '../repository/RepositoryMetro'

export async function stage4(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  if (validarPlaca(message.message.text)) {
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
              title: 'Solicitação',
            },
            {
              rowId: 'rowid2',
              title: 'Inovação / Melhorias',
            },
            {
              rowId: 'rowid3',
              title: 'Sugestão / Elogios',
            },
            {
              rowId: 'rowid4',
              title: 'Reclamação',
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
    await RepositoryMetro.updateData(message.conversationId, {
      plate: message.message.text,
    })
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'coopmetro', 5)
  } else {
    const messageReturn = {
      type: 'text',
      text: 'Placa inválida. Digite a placa de seu veiculo?',
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

// function getPlacas(params: ABASTECIMENTO[]) {
//   const qtdPlacas = []
//   params.forEach((element) => {
//     if (!qtdPlacas.includes(element.CODIGO)) {
//       qtdPlacas.push(element.CODIGO)
//     }
//   })
//   return qtdPlacas
// }

function validarPlaca(placa: string): boolean {
  const regex = /^[A-Z0-9]{7}$/i
  return regex.test(placa)
}
