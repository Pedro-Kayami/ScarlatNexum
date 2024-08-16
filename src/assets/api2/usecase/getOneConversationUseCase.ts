import { NextFunction, Request, Response } from 'express'

import { getOneConversation } from '@/assets/api2/services/request/request.js'

export async function GetOneConversationUseCase(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let conversationId
    if (req.query.conversationId) {
      conversationId = Number(req.query.conversationId)
    }

    const data = await getOneConversation(conversationId)
    if (!data) {
      res
        .status(404)
        .json({ error: 'No conversation found', status: 'error', data: {} })
      return
    }
    res.status(200).json({ data, status: 'success' })
  } catch (error) {
    console.error('Ocorreu um erro no getConversations: ', error)
    res.status(500).json({
      error: 'An error occurred while processing your request',
      status: 'error',
    })
    next(error)
  }
}
