import { NextFunction, Request, Response } from 'express'

import { getPages } from '@/assets/api2/services/request/request.js'

export async function GetPages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const operatorId = String(req.query.operatorId)
    const status = String(req.query.status)
    const deptoId = String(req.query.deptoId)

    const countData = await getPages(operatorId, deptoId, status)
    res.status(200).json({ countData, status: 'success' })
  } catch (error) {
    console.error('Ocorreu um erro no getPages: ', error)
    res.status(500).json({
      error: 'An error occurred while processing your request',
      status: 'error',
    })
    next(error)
  }
}
