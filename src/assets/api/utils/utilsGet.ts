import { Request, Response } from 'express'
import { BSON } from 'mongodb'

import { getClient } from '@/assets/database/dataBase.js'

export async function getMessagesId(req: Request, res: Response) {
  const conversationId: string = req.query.conversationId?.toString() || ''
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
        }

        res.status(200).json(returnObject)
      } else {
        res.status(404).send({
          status: 'error',
          mensagem: 'Messages not found',
        })
      }
    } else {
      res.status(404).send({
        status: 'error',
        mensagem: 'conversationId not found',
      })
    }
  } catch (error) {
    console.error('Ocorreu um erro no getMessages: ', error)
    res.json(error)
  }
}

// setInterval(() => {
//     dispararProtocolos()
// }, 5000);

export async function obterDadosProtocolos(req: unknown, res: unknown) {
  const db = await getClient()
  const collectionProtocolos = db.collection('PROTOCOLOS')
  const search: { operatorId?: number; status: string } = {
    status: '',
  }
  if (
    (req as Request).query.operatorId !== undefined &&
    (req as Request).query.operatorId !== null
  ) {
    search.operatorId = parseInt((req as Request).query.operatorId as string)
  }
  if (
    (req as Request).query.status !== undefined &&
    (req as Request).query.status !== null
  ) {
    search.status = (req as Request).query.status.toString()
  } else {
    search.status = 'A'
  }

  const dataProtocolos = await collectionProtocolos.find(search).toArray()

  const resultados: unknown[] = []

  await Promise.all(
    dataProtocolos.map(async (elemento) => {
      try {
        const messages: unknown = await getDataMessages(
          elemento._id.toHexString(),
        )

        const resultado = {
          conversationId: elemento._id.toHexString(),
          provider: elemento.provider,
          identifier: elemento.identifier,
          lastMessage: (messages as unknown[])[
            (messages as unknown[]).length - 1
          ],
          operatorId: elemento.operatorId,
          name: elemento.name,
          status: elemento.status,
          countNotReads: contarNaoLidas(messages as unknown[]), // Explicitly type messages as an array of unknowns
          photo: elemento.photo || null,
          dateCreated: elemento.dateCreated,
        }

        resultados.push(resultado)
      } catch (error) {
        console.error(
          'Error fetching data for Protocolo ID:',
          elemento._id,
          error,
        )
      }
    }),
  )

  return (res as Response).status(200).json(resultados)
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
    console.error(error)
    return error
  }
}
