import { Request, Response } from 'express'

import { controllerBotRequest } from '@/assets/api2/enums/enumRequest.js'
import { setBot } from '@/assets/bots/utils/utils'
export async function PostControllerBotUseCase(req: Request, res: Response) {
  try {
    const { botId, conversationId }: controllerBotRequest = req.body
    if (!botId || !conversationId) {
      res.status(400).json({
        error: 'Invalid request: botId, conversationId are required',
        status: 'error',
      })
      throw new Error('Invalid request: botId, conversationId are required')
    }

    const response = await setBot(conversationId, botId, 0)

    res.status(200).send(response)
  } catch (error) {
    console.error('error createConversationId', error)
    res.status(500).send({ error: 'error createConversationId' })
  }
}
