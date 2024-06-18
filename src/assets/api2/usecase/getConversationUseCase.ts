import { NextFunction, Request, Response } from 'express'

import { getConversations } from '@/assets/api2/services/request/request.js'

export async function GetConversationUseCase(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const operatorId = String(req.query.operatorId)
    const status = String(req.query.status)
    const page = Number(req.query.page)
    const pageSize = Number(req.query.pageSize)

    const data = await getConversations(operatorId, status, page, pageSize)
    if (!data || data.length === 0) {
      res
        .status(404)
        .json({ error: 'No conversations found', status: 'error', data: [] })
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
