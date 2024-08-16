import { Request, Response } from 'express'

import { updateOperatorRequest } from '@/assets/api2/enums/enumRequest.js'
import { updateOperatorId } from '@/assets/api2/services/response/response.js'

export async function PutUpdateOperatorUseCase(req: Request, res: Response) {
  try {
    const { conversationId, operatorId, deptoId }: updateOperatorRequest =
      req.body
    if (!conversationId) {
      res.status(400).json({
        error: 'Invalid request: conversationId, operatorId are required',
        status: 'error',
      })
      return
    }
    const response = await updateOperatorId(conversationId, operatorId, deptoId)

    res.status(200).send(response)
  } catch (error) {
    console.error('error updateOperator', error)
    res.status(500).send({ error: 'error updateOperator' })
  }
}
