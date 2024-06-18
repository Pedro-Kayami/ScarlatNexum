import { NextFunction, Request, Response } from 'express'

import { getMessagesId } from '@/assets/api2/services/request/request.js'

export async function GetMessagesUseCase(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const conversationId: string = req.query.conversationId as string
  if (!conversationId) {
    res.status(400).json({
      error: 'Invalid request: conversationId is required',
      status: 'error',
    })
    return
  }

  try {
    const data = await getMessagesId(conversationId)
    res.status(200).json({ data, status: 'success' })
  } catch (error) {
    console.error('Ocorreu um erro no getMessages: ', error)
    res.status(500).json({
      error: 'An error occurred while processing your request',
      status: 'error',
    })
    next(error)
  }
}
