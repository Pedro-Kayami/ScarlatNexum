import { Request, Response } from 'express'

import { patchReadMessageRequest } from '@/assets/api2/enums/enumRequest.js'
import { statusResponse } from '@/assets/api2/enums/enumResponse.js'
import { readMessage } from '@/assets/api2/services/response/response.js'
export async function PatchReadMessageUseCase(req: Request, res: Response) {
  try {
    const { conversationId }: patchReadMessageRequest = req.body
    if (!conversationId) {
      res.status(400).json({
        error: 'Invalid request: conversationId is required',
        status: 'error',
      })
      return
    }
    const retorno: statusResponse = await readMessage(conversationId)
    if (retorno.status === 'success') {
      res.status(200).json(retorno)
      return
    }
    res.status(400).json(retorno)
  } catch (error) {
    console.error('error updateNotReads', error)
    res.status(400).json({
      status: 'error',
    })
  }
}
