/* eslint-disable no-async-promise-executor */
import { MessageRequest } from '@/assets/api2/enums/enumRequest.js'
import { MessageResponse } from '@/assets/api2/enums/enumResponse.js'
import {
  addMessageUser,
  createConversation,
  getUUID,
} from '@/assets/api2/services/response/response.js'

export async function generateId(
  message: MessageRequest,
  to: string,
): Promise<MessageResponse> {
  return new Promise(async (resolve, reject) => {
    try {
      const existingId = await getUUID(message.identifier, message.provider)

      if (existingId) {
        message.conversationId = existingId.toHexString()
      } else {
        message.conversationId = await (
          await createConversation(
            message.identifier,
            message.provider,
            message.name,
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

      console.log(data)
      resolve(data)
    } catch (error) {
      console.error('Error in generateId function:', error)
      reject(error)
    }
  })
}
