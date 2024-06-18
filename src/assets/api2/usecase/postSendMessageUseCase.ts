import { Request, Response } from 'express'

import { MessageRequest } from '@/assets/api2/enums/enumRequest.js'
import { sendAPI } from '@/assets/api2/services/response/response.js'

export async function PostSendMessageUseCase(req: Request, res: Response) {
  const {
    conversationId,
    operatorId,
    message,
    provider,
    isConversation,
    type,
    identifier,
    name,
  }: MessageRequest = req.body

  if (!message || !provider || !type || !identifier) {
    throw new Error('Missing required request body parameters.')
  }

  if (type !== 'chat' && type !== 'base64' && type !== 'template') {
    res.status(400).json({
      status: 'error',
      error: 'Invalid type',
    })
  }

  try {
    const data = await sendAPI(
      conversationId,
      operatorId,
      type,
      message,
      identifier.replace(/[^a-zA-Z0-9]/g, ''),
      isConversation,
      provider,
      name,
    )
    if (data.status === 'success') {
      res.status(200).json({
        ...data,
      })
    } else {
      res.status(400).json({
        ...data,
      })
    }
  } catch (error) {
    console.error('Ocorreu um erro no sendMessage: ', error)
    res.status(500).json({
      error: 'An error occurred while processing your request',
      status: 'error',
    })
  }
}
