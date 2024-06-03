import { Request, Response } from 'express'

import { updateOperatorRequest } from '@/assets/api2/enums/enumRequest.js'
import { updateOperatorId } from '@/assets/api2/services/response/response.js'

export async function PutUpdateOperator(req: Request, res: Response) {
  try {
    const { conversationId, operatorId }: updateOperatorRequest = req.body
    if (!conversationId || !operatorId) {
      res.status(400).json({
        error: 'Invalid request: conversationId, operatorId are required',
        status: 'error',
      })
      return
    }
    const response = await updateOperatorId(conversationId, operatorId)

    res.status(200).send(response)
  } catch (error) {
    console.error('error updateOperator', error)
    res.status(500).send({ error: 'error updateOperator' })
  }
}
