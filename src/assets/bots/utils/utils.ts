import { BSON } from 'mongodb'

import { getClient } from '@/assets/database/dataBase.js'
export async function setBot(
  conversationId: string,
  botId: string,
  stageId: number,
) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    try {
      const db = await getClient()
      const collection = db.collection('PROTOCOLOS')
      await collection.updateOne(
        { _id: new BSON.ObjectId(conversationId) },
        { $set: { botId, stage: stageId } },
      )
      resolve({
        status: 'success',
      })
    } catch (error) {
      console.error('Set Bot: ', error)
      reject(error)
    }
  })
}
