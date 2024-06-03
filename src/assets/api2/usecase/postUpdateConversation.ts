import { Request, Response } from 'express'

import { updateConversationRequest } from '@/assets/api2/enums/enumRequest.js'
import { updateStatusConversation } from '@/assets/api2/services/response/response.js'

export async function PostUpdateConversation(req: Request, res: Response) {
  try {
    const {
      conversationId,
      status,
      type,
      observation,
    }: updateConversationRequest = req.body
    if (!conversationId || !status || !type) {
      res.status(400).json({
        error: 'Invalid request: conversationId, status and type are required',
        status: 'error',
      })
      return
    }

    if (status !== 'A' && status !== 'F') {
      res.status(400).json({
        error: 'Invalid status',
        status: 'error',
      })
      return
    }
    const response = await updateStatusConversation(
      conversationId,
      status,
      type,
      observation,
    )

    res.status(200).send(response)
  } catch (error) {
    console.error('error updateConversation', error)
    res.status(500).send({ error: 'error updateConversation' })
  }
}
