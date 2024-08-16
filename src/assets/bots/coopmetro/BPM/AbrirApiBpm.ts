/* eslint-disable no-async-promise-executor */
import axios from 'axios'

import RepositoryMetro from '../repository/RepositoryMetro'
const usuario = {
  login: 'adm',
  senha: 'xN4d419vV@!clT',
}

async function authentication() {
  return new Promise(async (resolve, reject) => {
    const url = `https://app.coopmetro.lecom.com.br/sso/api/v1/authentication`
    const data = {
      user: usuario.login,
      pass: usuario.senha,
      keepMeLoggedIn: 'true',
    }

    return axios
      .post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        resolve(response.data['ticket-sso'])
      })
      .catch((error) => {
        reject(error)
        throw new Error('Erro na requisição')
      })
  })
}

interface Datadados {
  numProcesso: string
  codAtividade: string
}

async function abrirProcesso(tokenLogin) {
  return new Promise(async (resolve, reject) => {
    const url = `https://app.coopmetro.lecom.com.br/bpm/api/v1/process-definitions/1/versions/1/start`

    return axios
      .put(
        url,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            'ticket-sso': tokenLogin,
            language: 'pt_BR',
          },
        },
      )
      .then((response) => {
        console.log(response.data)
        resolve({
          numProcesso: response.data.content.processInstanceId,
          codAtividade: response.data.content.currentActivityInstanceId,
        }) // retorna um objeto com as informações de numProcesso e codAtividade
      })
      .catch((error) => {
        reject(error)
        throw new Error('Erro na requisição')
      })
  })
}

// Correção proposta para a função aprovarProcesso
export async function aprovarProcesso(
  conversation: string,
  identifier: string,
): Promise<unknown> {
  try {
    const ticket = await authentication()
    const data = await RepositoryMetro.getData(conversation)
    const dados = (await abrirProcesso(ticket)) as Datadados
    const url = `https://app.coopmetro.lecom.com.br/bpm/api/v1/process-instances/${dados.numProcesso}/activity-instances/${dados.codAtividade}/cycles/1/complete`
    const response = await axios.post(
      url,
      {
        action: 'P',
        values: [
          { id: 'LST_SUB_ATENDIMENTO', value: data.service_relacioned },
          { id: 'LST_TP_SOLICITACAO', value: data.subject },
          { id: 'LST_SUB_SOLICITACAO', value: data.details_aditional },
          { id: 'LT_NOME', value: data.name },
          { id: 'LT_CPF_CNPJ', value: data.document },
          { id: 'LT_PLACA', value: data.plate },
          { id: 'LT_TELEFONE', value: identifier.replace('55', '') },
          { id: 'CT_DESCR_CHAMADO', value: data.description },
          { id: 'RB_TP_ATENDIMENTO', value: data.type_service },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'ticket-sso': ticket as string,
          language: 'pt_BR',
          'test-mode': 'false',
        },
      },
    )
    console.log(response)
    return response
  } catch (error) {
    console.log(error)
    throw new Error(`Erro na abertura da solicitação: ${error}`)
  }
}
