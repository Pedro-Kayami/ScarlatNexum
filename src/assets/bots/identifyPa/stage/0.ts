import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

export async function stage0(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  if (validarCPFOuCNPJ(message.message.text).valido) {
    await setBot(message.conversationId, 'NDA', null)
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

  function validarCNPJ(cnpj: string): boolean {
    if (cnpj.length !== 14) return false

    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho)
    const digitos = cnpj.substring(tamanho)
    let soma = 0
    let pos = tamanho - 7

    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(0))) return false

    tamanho = tamanho + 1
    numeros = cnpj.substring(0, tamanho)
    soma = 0
    pos = tamanho - 7
    for (let i = tamanho; i >= 1; i--) {
      soma += parseInt(numeros.charAt(tamanho - i)) * pos--
      if (pos < 2) pos = 9
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
    if (resultado !== parseInt(digitos.charAt(1))) return false

    return true
  }

  if (numeros.length === 11) {
    return { tipo: 'CPF', valido: validarCPF(numeros) }
  } else if (numeros.length === 14) {
    return { tipo: 'CNPJ', valido: validarCNPJ(numeros) }
  } else {
    return { tipo: 'Desconhecido', valido: false }
  }
}
