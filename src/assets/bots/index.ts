import { MessageResponse } from '@/assets/api2/enums/enumResponse'
// import { addMessageUser } from '@/assets/api2/services/response/response.js'
import { stagesBTC } from '@/assets/bots/btc/stages'
import { stagesSolicEmpres } from '@/assets/bots/solic_empres/stages'

export async function getBtc(message: MessageResponse, stageNumber: number) {
  const stages = await stagesBTC(message, stageNumber)

  return {
    id: 'btc',
    name: 'BTC',
    stages,
  }
}

export function getSolicEmpres(message: MessageResponse, stageNumber: number) {
  return {
    id: 'solic_empres',
    name: 'Solic Empres',
    stages: stagesSolicEmpres(message, stageNumber),
  }
}

export async function getBotById(
  id,
  message: MessageResponse,
  stageNumber: number,
) {
  switch (id) {
    case 'btc':
      return await getBtc(message, stageNumber)
    case 'solic_empres':
      return getSolicEmpres(message, stageNumber)
    default:
      return null
  }
}

export async function generateBot(
  message: MessageResponse,
  stageId: number,
  botId: string,
): Promise<MessageResponse> {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await getBotById(botId, message, stageId))
      // await addMessageUser(
      //   message.conversationId,
      //   message.type,
      //   message.identifier,
      //   response,
      //   'B',
      //   true,
      // )
    } catch (error) {
      console.error('Generate Bot: ', error)
      reject(error)
    }
  })
}
