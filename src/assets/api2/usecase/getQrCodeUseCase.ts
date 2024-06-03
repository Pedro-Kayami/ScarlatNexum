import { Request, Response } from 'express'

import { getQrCode } from '../services/request/request.js'

export async function GetQrCodeUseCase(req: Request, res: Response) {
  res.status(200).json(await getQrCode())
}
