import { BSON, ObjectId } from 'mongodb'

import { getClient } from '@/assets/database/dataBase.js'

interface Message {
  _id: unknown
  identifier: string
  conversationId?: unknown
  dateMessage?: Date
  firstContact: string
  name: string
  operatorId?: string | null
  status?: string
  provider: string
  type?: string
  read?: boolean
  message?: string
  lastMessage?: unknown
  photo?: unknown
  dateCreated?: unknown
}

export function conversatioExisting(
  message: Message,
  to: string,
): Promise<unknown> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const existingId: string = message.conversationId as string

      const result = await getExisting(existingId)

      if (result) {
        resolve(await addMessageUser(message, to, true))
      } else {
        resolve({
          status: 'error',
          message: 'Not conversationId existing or its is finished',
        })
      }
    } catch (error) {
      console.error('Error in conversatioExisting function:', error)
      reject(error)
    }
  })
}

async function generateId(message: Message, to: string): Promise<Message> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const existingId = await getUUID(message.identifier, message.provider)

      if (existingId) {
        message.conversationId = (existingId as BSON.ObjectId).toHexString()
      } else {
        message = (await createConversationId(message)) as Message // Cast the return value of createConversationId to Message
      }
      const messageusr = await addMessageUser(message, to, false)

      const messageData = (messageusr as Message).message // Cast messageusr to Message and access the 'message' property

      message.message = messageData // Assign the 'message' property from messageData to the 'message' variable

      resolve(message)
    } catch (error) {
      console.error('Error in generateId function:', error)
      reject(error)
    }
  })
}
async function addMessageUser(
  message: unknown,
  to: string,
  read: boolean,
): Promise<unknown> {
  try {
    const dateMessage = new Date()

    const db = await getClient()
    const collection: unknown = db.collection('MENSAGENS')
    const uuid = new BSON.ObjectId()
    const conversationId = new BSON.ObjectId(
      (message as { conversationId: string }).conversationId,
    )

    const data = {
      _id: uuid,
      conversationId: new BSON.ObjectId(
        (message as { conversationId: string }).conversationId,
      ),
      type: (message as { type: string }).type,
      dateMessage: dateMessage.toISOString(),
      message: (message as { message: string }).message,
      read,
      to,
    }

    const dataretorno = {
      _id: uuid.toHexString(),
      conversationId: (message as { conversationId: string }).conversationId,
      type: (message as { type: string }).type,
      dateMessage: dateMessage.toISOString(),
      message: (message as { message: string }).message,
      read,
      to,
    }

    await collection.insertOne(data)

    if (to === 'U') {
      await updateName(conversationId, message.name, db, message.photo)
    }

    return {
      _id: uuid.toHexString(),
      conversationId: message.conversationId,
      message: dataretorno,
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
  db: unknown,
  photo: unknown,
) {
  const filter = {
    _id: conversationId,
  }
  const collection: unknown = db.collection('PROTOCOLOS')
  await collection.updateMunknown(filter, {
    $set: {
      name,
      photo,
    },
  })
}

async function createConversationId(message: Message): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const dateMessage = new Date() // Substitua isso pela sua data original

      const db = await getClient()
      const collection: unknown = db.collection('PROTOCOLOS')
      const uuid = new BSON.ObjectId()

      const data = {
        _id: uuid,
        identifier: message.identifier,
        firstContact: dateMessage.toISOString(),
        name: message.name,
        operatorId: message.operatorId || null,
        status: 'A',
        provider: message.provider,
        photo: message.photo || null,
        dateCreated: dateMessage.toISOString(),
      }

      await collection.insertOne(data)

      message.conversationId = uuid.toHexString()

      resolve(message)
    } catch (error) {
      console.error('Create ConversationId: ', error)
      reject(error)
    }
  })
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

export async function getProviderResp(params: unknown) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getClient()
      const collection = db.collection('PROTOCOLOS')

      const result: unknown = await collection.findOne({
        _id: new BSON.ObjectId(params.conversationId),
        status: 'A',
      })

      if (result) {
        if (params.operatorId) {
          if (params.operatorId.toString() == result.operatorId.toString()) {
            resolve(true)
          } else {
            resolve(false)
          }
        } else {
          resolve(true)
        }
      } else {
        resolve(true)
      }
    } catch (error) {
      console.error('Get Existing ConversationId: ', error)
      reject(error)
    }
  })
}

async function getUUID(identifier: string, provider: string): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getClient()
      const collection = db.collection('PROTOCOLOS')

      const result: unknown = await collection.findOne({
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

export async function updateOperatorId(
  conversationId: string,
  operatorId: number,
): Promise<unknown> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getClient()
      const collection = db.collection('PROTOCOLOS')

      const result: unknown = await collection.findOne({
        _id: new BSON.ObjectId(conversationId),
        status: 'A',
      })

      if (!result.operatorId) {
        await collection.updateMunknown(
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
      resolve('sucesso')
    } catch (error) {
      console.error('Get Existing ConversationId: ', error)
      reject(error)
    }
  })
}

export async function getReadMessage(idMessage: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getClient()
      const collection = db.collection('MENSAGENS')

      const result: unknown = await collection.findOne({
        _id: new BSON.ObjectId(idMessage),
        read: false,
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
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getClient()
      const collection = db.collection('MENSAGENS')

      await collection.updateMunknown(
        {
          _id: new BSON.ObjectId(idMessage),
        },
        {
          $set: {
            read: true,
          },
        },
      )

      resolve('sucesso')
    } catch (error) {
      console.error('Error updateNotRead ', error)
      reject(error)
    }
  })
}

export async function createConversation(params: unknown) {
  return new Promise(async (resolve, reject) => {
    const dateMessage = new Date() // Substitua isso pela sua data original

    const conversationIdExisting = await getUUID(
      params.identifier,
      params.provider,
    )
    if (conversationIdExisting) {
      return resolve({
        status: 'error',
        message: 'There is already an open conversationId',
        conversationId: conversationIdExisting,
      })
    }
    try {
      const uuid = new BSON.ObjectId(params.conversationId)
      const db = await getClient()
      const collection = db.collection('PROTOCOLOS')
      const data: Message = {
        _id: uuid,
        identifier: params.identifier,
        firstContact: dateMessage.toISOString(),
        name: params.name,
        operatorId: params.operatorId,
        status: 'A',
        provider: params.provider,
        dateCreated: dateMessage.toISOString(),
      }

      await collection.insertOne(data)

      resolve({
        status: 'sucesso',
        conversationId: uuid,
      })
    } catch (error) {
      console.error('Error createConversation ', error)
      reject({
        status: 'error',
      })
    }
  })
}

export async function updateStatusConversation(params: unknown) {
  return new Promise(async (resolve, reject) => {
    const conversationId = params.conversationId
    const status = params.status || 'A'
    const operatorId = params.operatorId // Assuming operatorId is passed in params

    if (!(await getExisting(conversationId))) {
      return resolve({
        status: 'error',
        message: 'Not conversationId existing or it is finished',
      })
    }

    try {
      const db = await getClient()
      const collection = db.collection('PROTOCOLOS')

      const updateObject: unknown = {
        $set: {
          status,
        },
      }

      if (operatorId !== undefined && operatorId !== null) {
        updateObject.$set.operatorId = operatorId
      }

      await collection.updateMunknown(
        {
          _id: new BSON.ObjectId(conversationId),
        },
        updateObject,
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

export { addMessageUser, generateId }
