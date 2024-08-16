import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { getClient } from '@/modules/Client/client'

import { setBot } from '../../utils/utils'
import { ABASTECIMENTO } from '../repository/InterfaceMetro'
import RepositoryMetro from '../repository/RepositoryMetro'

export async function stage3(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  const retornoAPI = (await RepositoryMetro.getAPI('abastecimentos', {
    ABASTECIMENTO: [
      {
        Chave: (await RepositoryMetro.getData(message.conversationId)).document,
      },
    ],
  })) as ABASTECIMENTO[]
  const qtdPlacas = getPlacas(retornoAPI)
  if (isNameValid(message.message.text)) {
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
      await setBot(message.conversationId, 'coopmetro', 4)
    } else {
      const messageReturn = {
        type: 'text',
        text: 'Obrigado pelas informações. Digite a placa de seu veiculo?',
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
      await setBot(message.conversationId, 'coopmetro', 4)
    }
  } else {
    const messageReturn = {
      type: 'text',
      text: 'Nome inválido. Por favor, informe um nome válido.',
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
  const data = await RepositoryMetro.getData(message.conversationId)
  if (data.name) {
    await RepositoryMetro.updateData(message.conversationId, {
      name: message.message.text,
    })
  }
}

function isNameValid(name: string): boolean {
  // Verifica se o nome está vazio
  if (!name.trim()) return false

  // Verifica se o nome contém apenas letras e espaços (e possivelmente caracteres acentuados)
  // Esta expressão regular pode ser ajustada conforme necessário
  return /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ]+$/.test(name)
}

function getPlacas(params: ABASTECIMENTO[]) {
  const qtdPlacas = []
  params.forEach((element) => {
    if (!qtdPlacas.includes(element.CODIGO)) {
      qtdPlacas.push(element.CODIGO)
    }
  })
  return qtdPlacas
}
