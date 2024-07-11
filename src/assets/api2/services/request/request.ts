import { BSON } from 'mongodb'

import { getClient } from '@/assets/database/dataBase.js'
import client from '@/modules/Client/client.js'

export async function getMessagesId(conversationId: string) {
  try {
    const dataConversation: string = await getDataConversation(conversationId)

    if (dataConversation) {
      const dadosMensagens: unknown = await getDataMessages(conversationId)

      if (dadosMensagens) {
        const dataConversation: unknown =
          await getDataConversation(conversationId)

        interface IDataConversation {
          conversationId: string
          identifier: string
          dateMessage: string
          name: string
          operatorId: string
          status: string
          dateCreated: string
          deptoId: string
        }

        const data = dataConversation as IDataConversation

        const returnObject = {
          conversationId: data?.conversationId,
          identifier: data?.identifier,
          firstContact: data?.dateMessage,
          name: data?.name,
          operatorId: data?.operatorId,
          status: data?.status,
          dateCreated: data?.dateCreated,
          messages: dadosMensagens,
          deptoId: data?.deptoId,
        }

        return returnObject
      }
    }
  } catch (error) {
    console.error('Ocorreu um erro no getMessages: ', error)
    return error
  }
}

export async function getQrCode() {
  return await client.getQrCode()
}

export async function getPages(
  operatorId: string,
  status: unknown,
  deptoId: string,
) {
  const db = await getClient()
  const collectionProtocolos = db.collection('PROTOCOLOS')
  interface SearchType {
    operatorId?: unknown
    status?: unknown
    deptoId?: unknown
  }
  const search: SearchType = {}
  if (
    operatorId !== null &&
    operatorId !== undefined &&
    operatorId !== 'emptyOperator' &&
    operatorId !== 'all'
  ) {
    search.operatorId = parseInt(operatorId.toString())
  } else if (operatorId === 'emptyOperator') {
    search.operatorId = null
  }
  if (status) {
    search.status = status
  }
  if (
    deptoId !== null &&
    deptoId !== undefined &&
    deptoId !== 'all' &&
    deptoId !== 'emptyDepto'
  ) {
    search.deptoId = parseInt(deptoId.toString())
  } else if (deptoId === 'emptyDepto') {
    search.deptoId = null
  }
  const totalCount = await collectionProtocolos.countDocuments(search)

  return totalCount
}

export async function getConversations(
  operatorId: string,
  status: unknown,
  deptoId: string,
  page?: number,
  pageSize?: number,
) {
  const db = await getClient()
  const collectionProtocolos = db.collection('PROTOCOLOS')
  interface SearchType {
    operatorId?: unknown
    status?: unknown
    deptoId?: unknown
  }
  const search: SearchType = {}
  if (
    !Number.isNaN(operatorId) &&
    operatorId &&
    operatorId !== null &&
    operatorId !== undefined &&
    operatorId !== 'emptyOperator' &&
    operatorId !== 'all'
  ) {
    search.operatorId = parseInt(operatorId.toString())
  } else if (operatorId === 'emptyOperator') {
    search.operatorId = null
  }
  if (status) {
    search.status = status
  }
  if (
    !Number.isNaN(deptoId) &&
    deptoId &&
    deptoId !== null &&
    deptoId !== undefined &&
    deptoId !== 'all' &&
    deptoId !== 'emptyDepto'
  ) {
    search.deptoId = parseInt(deptoId.toString())
  } else if (deptoId === 'emptyDepto') {
    search.deptoId = null
  }
  console.log('search', search)

  let query = collectionProtocolos.find(search)

  // Apply pagination only if page and pageSize are defined
  if (page !== undefined && pageSize !== undefined) {
    const skips = pageSize * (page - 1)
    query = query.skip(skips).limit(pageSize)
  }

  const dataProtocolos = await query.toArray()
  console.log('dataProtocolos', dataProtocolos)
  const resultados: unknown[] = []

  await Promise.all(
    dataProtocolos.map(async (elemento) => {
      try {
        if (elemento.status === 'A') {
          const messages: unknown = await getDataMessages(
            elemento._id.toHexString(),
          )
          let lastMessage = {}
          if (Array.isArray(messages)) {
            const lastMessagePos = messages[messages.length - 1]
            lastMessage = {
              _id: lastMessagePos._id,
              message: lastMessagePos.message,
              read: lastMessagePos.read,
              to: lastMessagePos.to,
              type: lastMessagePos.type,
              conversationId: lastMessagePos.conversationId,
              dateMessage: lastMessagePos.dateMessage,
            }

            const resultado = {
              conversationId: elemento._id.toHexString(),
              provider: elemento.provider,
              identifier: elemento.identifier,
              lastMessage,
              operatorId: elemento.operatorId,
              name: elemento.name,
              status: elemento.status,
              countNotReads: contarNaoLidas(messages),
              photo: elemento.photo || null,
              dateCreated: elemento.dateCreated,
              botId: elemento.botId,
              stage: elemento.stage,
              deptoId: elemento.deptoId,
            }

            resultados.push(resultado)
          }
        } else {
          const resultado = {
            conversationId: elemento._id.toHexString(),
            provider: elemento.provider,
            identifier: elemento.identifier,
            operatorId: elemento.operatorId,
            name: elemento.name,
            status: elemento.status,
            photo: elemento.photo || null,
            deptoId: elemento.deptoId,
            dateCreated: elemento.dateCreated,
            finalization: {
              type: elemento.type,
              observation: elemento.observation,
              dateFinalization: elemento.dateFinalization,
            },
          }

          resultados.push(resultado)
        }
      } catch (error) {
        console.error(
          'Error fetching data for Protocolo ID:',
          elemento._id,
          error,
        )
      }
    }),
  )
  return resultados
}

function contarNaoLidas(array: unknown[]) {
  let naoLidas = 0

  for (let i = 0; i < array.length; i++) {
    if (!(array[i] as { read: boolean }).read) {
      naoLidas++
    }
  }

  return naoLidas
}

async function getDataMessages(conversationId: string) {
  const db = await getClient()
  const collection = db.collection('MENSAGENS')
  const data: unknown = await collection
    .find({
      conversationId: new BSON.ObjectId(conversationId),
    })
    .toArray()
  return data
}

async function getDataConversation(conversationId: string) {
  try {
    const db = await getClient()
    const collection = db.collection('PROTOCOLOS')

    const search: unknown = {
      _id: new BSON.ObjectId(conversationId),
    }

    const data = await collection.findOne(search)

    return data
  } catch (error) {
    console.error('Erro getDataConversation', error)
    return error
  }
}
