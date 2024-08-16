import { NextFunction, Request, Response } from 'express'

import { getConversations } from '@/assets/api2/services/request/request.js'

export async function GetConversationUseCase(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let deptoId
    let operatorId
    let status
    let page
    let pageSize
    let botId
    if (req.query.page) {
      page = Number(req.query.page)
    }
    if (req.query.pageSize) {
      pageSize = Number(req.query.pageSize)
    }
    if (req.query.status) {
      status = String(req.query.status)
    }
    if (req.query.operatorId) {
      operatorId = String(req.query.operatorId)
    }
    if (req.query.deptoId) {
      deptoId = String(req.query.deptoId)
    }
    if (req.query.botId) {
      botId = String(req.query.botId)
    }

    const data = await getConversations(
      operatorId,
      status,
      deptoId,
      page,
      pageSize,
      botId,
    )
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
