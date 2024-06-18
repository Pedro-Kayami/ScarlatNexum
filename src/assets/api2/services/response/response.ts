/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-async-promise-executor */
import { BSON, Collection, ObjectId } from 'mongodb'

import { conversation, message } from '@/assets/api2/enums/enumRequest.js'
import {
  MessageResponse,
  statusResponse,
} from '@/assets/api2/enums/enumResponse.js'
import { getClient } from '@/assets/database/dataBase.js'
import Client from '@/modules/Client/client.js'

export async function addMessageUser(
  conversationId: string,
  type: string,
  identifier: string,
  message: message,
  to: string,
  read: boolean,
  name?: string,
  photo?: string,
): Promise<MessageResponse> {
  try {
    const dateMessage = new Date()

    const db = await getClient()
    const collection: Collection = db.collection('MENSAGENS')
    const uuid = new BSON.ObjectId()
    const conversationIdBson = new BSON.ObjectId(conversationId)

    const data = {
      _id: uuid,
      conversationId: conversationIdBson,
      type,
      dateMessage: dateMessage.toISOString(),
      message,
      identifier,
      read,
      to,
    }

    await collection.insertOne(data)
    // @ts-expect-error
    data._id = data._id.toHexString()
    // @ts-expect-error
    data.name = name
    // @ts-expect-error
    data.photo = photo
    // @ts-expect-error
    data.conversationId = data.conversationId.toHexString()

    if (to === 'U') {
      await updateName(conversationIdBson, name, photo)
    }
    return {
      data,
      status: 'success',
    }
  } catch (error) {
    console.error('Create ConversationId: ', error)
    throw error
  }
}

async function updateName(
  conversationId: ObjectId,
  name: string,
  photo: unknown,
) {
  const db = await getClient()
  const filter = {
    _id: conversationId,
  }
  const collection: Collection = db.collection('PROTOCOLOS')
  await collection.updateMany(filter, {
    $set: {
      name,
      photo,
    },
  })
}

export async function readMessage(idMessage: string) {
  try {
    await updateReading(idMessage)
    return {
      status: 'success',
    }
  } catch (error) {
    console.error('error updateNotReads', error)
    return {
      status: 'error',
    }
  }
}

export async function getExisting(conversationId: string): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getClient()
      const collection = db.collection('PROTOCOLOS')

      const result: unknown = await collection.findOne({
        _id: new BSON.ObjectId(conversationId),
        status: 'A',
      })

      if (result) {
        resolve(true)
      } else {
        resolve(false)
      }
    } catch (error) {
      console.error('Get Existing ConversationId: ', error)
      reject(error)
    }
  })
}

export async function updateReading(idMessage: string): Promise<unknown> {
  try {
    const db = await getClient()

    const collectionPROTOCOLOS: Collection = db.collection('PROTOCOLOS')
    const result = await collectionPROTOCOLOS
      .find({
        _id: new BSON.ObjectId(idMessage),
      })
      .toArray()

    const collectionMENSAGENS: Collection = db.collection('MENSAGENS')

    const updatePromises = result.map((element) =>
      collectionMENSAGENS.updateMany(
        {
          conversationId: new BSON.ObjectId(element._id),
        },
        {
          $set: {
            read: true,
          },
        },
      ),
    )

    await Promise.all(updatePromises)

    return true
  } catch (error) {
    console.error('Error updateNotRead ', error)
    throw error
  }
}

export async function getConversation(
  conversationId: string,
): Promise<ObjectId> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getClient()
      const collection = db.collection('PROTOCOLOS')

      const result = await collection.findOne({
        _id: new BSON.ObjectId(conversationId),
      })

      if (result) {
        resolve(result._id)
      } else {
        resolve(null)
      }
    } catch (error) {
      console.error('Get Existing ConversationId: ', error)
      reject(error)
    }
  })
}

export async function getUUID(
  identifier: string,
  provider: string,
): Promise<ObjectId> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getClient()
      const collection = db.collection('PROTOCOLOS')

      const result: { _id: ObjectId } = await collection.findOne({
        identifier,
        provider,
        status: 'A',
      })

      if (result) {
        resolve(result._id)
      } else {
        resolve(null)
      }
    } catch (error) {
      console.error('Get Existing ConversationId: ', error)
      reject(error)
    }
  })
}

export async function createConversation(
  identifier: string,
  provider: string,
  name: string,
  operatorId: string,
  photo?: string,
): Promise<statusResponse> {
  return new Promise(async (resolve, reject) => {
    const dateMessage = new Date()

    const conversationIdExisting: ObjectId = await getUUID(identifier, provider)
    if (conversationIdExisting) {
      return resolve({
        status: 'error',
        error: 'There is already an open conversationId',
        conversationId: conversationIdExisting.toHexString(),
      })
    }
    try {
      const uuid = new BSON.ObjectId()
      const db = await getClient()
      const collection: Collection = db.collection('PROTOCOLOS')
      const data: conversation = {
        _id: uuid,
        identifier,
        firstContact: dateMessage.toISOString(),
        name: name || '',
        operatorId: operatorId || null,
        status: 'A',
        provider,
        dateCreated: dateMessage.toISOString(),
        photo: photo || '',
      }

      await collection.insertOne(data)

      resolve({
        status: 'success',
        conversationId: uuid.toHexString(),
      })
    } catch (error) {
      console.error('Error createConversation ', error)
      reject({
        status: 'error',
      })
    }
  })
}

export async function updateOperatorId(
  conversationId: string,
  operatorId: number,
): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getClient()
      const collection: Collection = db.collection('PROTOCOLOS')

      if (operatorId) {
        await collection.updateMany(
          {
            _id: new BSON.ObjectId(conversationId),
          },
          {
            $set: {
              operatorId,
            },
          },
        )
      }
      resolve({
        status: 'success',
        conversationId,
      })
    } catch (error) {
      console.error('Get Existing ConversationId: ', error)
      reject(error)
    }
  })
}

export async function updateStatusConversation(
  conversationId: string,
  status: string,
  type: string,
  observation?: string,
) {
  return new Promise(async (resolve, reject) => {
    if (!(await getExisting(conversationId))) {
      return resolve({
        status: 'error',
        message: 'Not conversationId existing or it is finished',
      })
    }
    if (!(status === 'F' || status === 'C')) {
      return resolve({
        status: 'error',
        message: 'Invalid status',
      })
    }

    try {
      const dateMessage = new Date()
      const db = await getClient()
      const collection: Collection = db.collection('PROTOCOLOS')

      await collection.updateMany(
        {
          _id: new BSON.ObjectId(conversationId),
        },
        {
          $set: {
            status,
            type,
            observation: observation || '',
            dateFinalization: dateMessage.toISOString(),
          },
        },
      )

      resolve({
        status: 'success',
      })
    } catch (error) {
      console.error('Error updateStatusConversation ', error)
      reject({
        status: 'error',
      })
    }
  })
}

export async function sendAPI(
  conversationId: string,
  operatorId: string,
  type: string,
  message: message,
  identifier: string,
  isConversation: boolean,
  provider: string,
  name: string,
) {
  let retorno = null

  if (isConversation && process.env.NXZAP_LITE === 'false') {
    const existing = await getExisting(conversationId)
    if (!existing) {
      return {
        status: 'error',
        error: 'Conversation not found',
      }
    }
  }
  try {
    if (type === 'chat') {
      retorno = await Client.sendTextClient(identifier, provider, message, name)
    } else if (type === 'template') {
      retorno = await Client.sendTemplateClient(identifier, provider, message)
    } else if (type === 'base64') {
      retorno = await Client.sendFileBase64Client(identifier, provider, message)
    }

    if (
      retorno.status === 'success' &&
      isConversation &&
      process.env.NXZAP_LITE === 'false'
    ) {
      retorno = await addMessageUser(
        conversationId,
        type,
        identifier,
        message,
        'B',
        isConversation,
      )
    }
    return retorno
  } catch (error) {
    console.log(error)
    return {
      status: 'error',
    }
  }
}
