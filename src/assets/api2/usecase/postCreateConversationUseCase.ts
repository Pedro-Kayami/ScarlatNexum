import { Request, Response } from 'express'

import { createConversationRequest } from '@/assets/api2/enums/enumRequest.js'
import { createConversation } from '@/assets/api2/services/response/response.js'
export async function PostCreateConversationUseCase(
  req: Request,
  res: Response,
) {
  try {
    const {
      identifier,
      provider,
      name,
      operatorId,
    }: createConversationRequest = req.body
    if (!identifier || !provider) {
      res.status(400).json({
        error: 'Invalid request: identifier, provider are required',
        status: 'error',
      })
      throw new Error('Invalid request: identifier, provider are required')
    }

    if (provider === 'whats_wpp' || provider === 'whats_meta') {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/
      const isValidNumber = phoneRegex.test(identifier)

      if (!isValidNumber) {
        res.status(400).json({
          status: 'error',
          error: 'Invalid phone number',
        })
        return
      }
    }
    const response = await createConversation(
      identifier,
      provider,
      name,
      operatorId,
    )

    res.status(200).send(response)
  } catch (error) {
    console.error('error createConversationId', error)
    res.status(500).send({ error: 'error createConversationId' })
  }
}
