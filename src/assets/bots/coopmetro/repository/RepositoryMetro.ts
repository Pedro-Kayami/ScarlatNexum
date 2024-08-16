import axios from 'axios'
import * as https from 'https'

import { createCollections, getClient } from '@/assets/database/dataBase'

import { responseAPI } from './InterfaceMetro'

const endpoint = 'https://webservice.coopmetro.com.br:8080/escalasoft'

interface dataCoopmetro {
  document?: string
  name?: string
  service_relacioned?: string
  subject?: string
  details_aditional?: string
  plate?: string
  description?: string
  type_service?: string
  name_mother?: string
}
function getAPI(router: string, params: unknown): Promise<unknown> {
  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  })

  return new Promise((resolve, reject) => {
    axios
      .post(`${endpoint}/${router}/disponivel/listar`, params, {
        httpsAgent,
      })
      .then((response) => resolve(response.data as responseAPI))
      .catch((error) => reject(error))
  })
}

async function addData(
  conversationId: string,
  dataCoopmetro: dataCoopmetro,
): Promise<void> {
  await createCollections('coopmetro')
  const client = await getClient()
  const collection = client.collection('coopmetro')

  await collection.updateOne(
    { conversationId },
    { $setOnInsert: dataCoopmetro },
    { upsert: true },
  )
}

async function getData(conversationId: string): Promise<dataCoopmetro> {
  const client = await getClient()
  const collection = client.collection('coopmetro')

  const data = collection.findOne({ conversationId })
  return data as dataCoopmetro
}

async function updateData(
  conversationId: string,
  dataCoopmetro: dataCoopmetro,
): Promise<void> {
  await createCollections('coopmetro') // Certifique-se de que a coleção existe
  const client = await getClient() // Obtém o cliente do banco de dados
  const collection = client.collection('coopmetro') // Seleciona a coleção

  await collection.updateOne(
    { conversationId }, // Filtro para encontrar o documento
    { $set: dataCoopmetro }, // Atualiza os dados se o documento existir
    { upsert: true }, // Insere um novo documento se não encontrar um correspondente
  )
}

export default { getAPI, addData, getData, updateData }
