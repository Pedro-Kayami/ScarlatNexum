import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import RepositoryMetro from '@/assets/bots/coopmetro/repository/RepositoryMetro'
import { getClient } from '@/modules/Client/client'

import { setBot } from '../../utils/utils'
import { COOPERADO } from '../repository/InterfaceMetro'

export async function stage1(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  if (validarCPFOuCNPJ(message.message.text).valido) {
    const data = await RepositoryMetro.getData(message.conversationId)
    client.sendText(
      message.identifier,
      '🔄 Buscando seus dados, por favor aguarde...',
    )

    const document = aplicarMascara(message.message.text)
    const request = {
      ID: '',
      CNPJCPFCOOPERADO: document,
      NOMEMAECOOPERADO: data.name_mother,
      OPERACAO: '',
    }
    const retornoAPI = (await RepositoryMetro.getAPI(
      'cooperado',
      request,
    )) as COOPERADO[]

    if (!retornoAPI || !retornoAPI[0] || !retornoAPI[0].COOPERADO) {
      const messageReturn = {
        type: 'text',
        text: 'Dados errados❌. Por favor, verifique o CPF/CNPJ e o nome da mãe e tente novamente.',
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
      setTimeout(() => {
        client.sendText(
          message.identifier,
          'Digite novamente o nome completo de sua mãe.',
        )
      }, 200)
      await setBot(message.conversationId, 'coopmetro', 1)
      return
    }

    await RepositoryMetro.updateData(message.conversationId, {
      document,
      name: retornoAPI[0].COOPERADO,
    })

    const list = {
      type: 'list',
      title: 'Obrigado. Estou falando com ' + retornoAPI[0].COOPERADO, // optional
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      sections: [
        {
          title: 'Escolha uma opção:',
          rows: [
            {
              rowId: 'rowid1',
              title: 'Sim',
            },
            {
              rowId: 'rowid2',
              title: 'Não',
            },
          ],
        },
      ],
    }
    client.sendListMessage(message.identifier, list)
    await addMessageUser(
      message.conversationId,
      'list', //
      message.identifier,
      list,
      'B',
      true,
    )
    await setBot(message.conversationId, 'coopmetro', 2)
  } else {
    const messageReturn = {
      type: 'text',
      text: 'Eu não consegui identificar o seu CPF ou CNPJ. Por favor, verifique se o número está correto e tente novamente.',
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

function validarCPFOuCNPJ(valor: string): { tipo: string; valido: boolean } {
  const numeros = valor.replace(/\D/g, '')

  function validarCPF(cpf: string): boolean {
    let soma = 0
    let resto
    if (cpf === '00000000000') return false

    for (let i = 1; i <= 9; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (11 - i)
    resto = (soma * 10) % 11

    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(9, 10))) return false

    soma = 0
    for (let i = 1; i <= 10; i++)
      soma += parseInt(cpf.substring(i - 1, i)) * (12 - i)
    resto = (soma * 10) % 11

    if (resto === 10 || resto === 11) resto = 0
    if (resto !== parseInt(cpf.substring(10, 11))) return false

    return true
  }

  if (numeros.length === 11) {
    return { tipo: 'CPF', valido: validarCPF(numeros) }
  } else if (numeros.length === 14) {
    return { tipo: 'CNPJ', valido: true }
  } else {
    return { tipo: 'Desconhecido', valido: false }
  }
}

function aplicarMascara(documento: string): string {
  documento = documento.replace(/\D/g, '')
  if (documento.length === 11) {
    return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  } else if (documento.length === 14) {
    return documento.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      '$1.$2.$3/$4-$5',
    )
  } else {
    // Documento inválido
    return 'Documento inválido'
  }
}
