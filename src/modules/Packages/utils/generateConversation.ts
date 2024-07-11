/* eslint-disable no-async-promise-executor */
import { BSON } from 'mongodb'

import {
  conversation,
  MessageRequest,
} from '@/assets/api2/enums/enumRequest.js'
import { MessageResponse } from '@/assets/api2/enums/enumResponse.js'
import {
  addMessageUser,
  createConversation,
  getUUID,
} from '@/assets/api2/services/response/response.js'
import { getClient } from '@/assets/database/dataBase.js'

export async function getStage(conversationId: string): Promise<conversation> {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getClient()
      const collection = db.collection('PROTOCOLOS')

      const result = await collection.findOne({
        _id: new BSON.ObjectId(conversationId),
      })

      const data: conversation = {
        conversationId: result._id.toHexString(),
        identifier: result.identifier,
        firstContact: result.firstContact,
        name: result.name,
        operatorId: result.operatorId,
        status: result.status,
        provider: result.provider,
        dateCreated: result.dateCreated,
        photo: result.photo,
        stage: result.stage,
        botId: result.botId,
      }
      resolve(data)
    } catch (error) {
      console.error('Get Existing ConversationId: ', error)
      reject(error)
    }
  })
}

export async function generateId(
  message: MessageRequest,
  to: string,
): Promise<MessageResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const existingId = await getUUID(message.identifier, message.provider)

      if (existingId) {
        message.conversationId = existingId.toHexString()
        message.event = 'existingConversation'
      } else {
        message.conversationId = await (
          await createConversation(
            message.identifier,
            message.provider,
            message.name,
            null,
            null,
            message.photo,
          )
        ).conversationId
        message.event = 'newConversation'
      }
      const data: MessageResponse = await addMessageUser(
        message.conversationId,
        message.type,
        message.identifier,
        message.message,
        to,
        false,
        message.name,
        message.photo,
      )
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      data.data.event = message.event

      resolve(data)
    } catch (error) {
      console.error('Error in generateId function:', error)
      reject(error)
    }
  })
}
