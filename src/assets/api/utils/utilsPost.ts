import { Request, Response } from 'express'

import Client from '@/modules/Client/client.js'
import {
  addMessageUser,
  createConversation,
  getExisting,
  getProviderResp,
  getReadMessage,
  updateOperatorId,
  updateReading,
  updateStatusConversation,
} from '@/modules/Conversations/generateConversations.js'

export async function updateNotReads(req: Request, res: Response) {
  const idMessage = req.body._id
  try {
    if (await getReadMessage(idMessage)) {
      await updateReading(idMessage)
      res.status(200).json({
        status: 'success',
      })
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Already read or not available',
      })
    }
  } catch (error) {
    console.error('error updateNotReads', error)
    res.status(400).json({
      status: 'error',
    })
  }
}

export async function createConversationId(req: Request, res: Response) {
  try {
    const retorno: unknown = await createConversation(req.body)
    if ((retorno as { status: string }).status === 'sucess') {
      res.status(200).json(retorno)
    } else {
      res.status(400).json(retorno)
    }
  } catch (error) {
    console.error('error createConversationId', error)
    res.status(400).json({
      status: 'error',
    })
  }
}

export async function updateConversation(req: Request, res: Response) {
  try {
    const retorno: unknown = await updateStatusConversation(req.body)
    if ((retorno as { status: string }).status === 'sucess') {
      res.status(200).json(retorno)
    } else {
      res.status(400).json(retorno)
    }
  } catch (error) {
    console.error('error updateNotReads', error)
    res.status(400).json({
      status: 'error',
    })
  }
}

export async function sendAPI(req: Request, res: Response) {
  try {
    let type
    if (req.body && 'type' in req.body) {
      type = req.body.type
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Missing or undefined type',
      })
      return
    }

    let retorno
    const requestBody = req.body as {
      isConversation?: boolean
      conversationId?: string
    }
    if (
      requestBody.isConversation &&
      !getExisting(requestBody.conversationId)
    ) {
      res.status(400).json({
        status: 'error',
        message: 'Not conversationId existing',
      })
    }

    if (!(await getProviderResp(requestBody))) {
      res.status(400).json({
        status: 'error',
        message: 'You are not responsible',
      })
    }

    if (type === 'chat') {
      retorno = await Client.sendTextClient(req)
    } else if (type === 'template') {
      retorno = await Client.sendTemplateClient(req)
    } else if (type === 'base64') {
      retorno = await Client.sendFileBase64Client(req)
    }

    if (retorno.status === 'error') {
      res.status(400).json(retorno)
    } else {
      if (req.body.isConversation) {
        await updateOperatorId(req.body.conversationId, req.body.operatorId)
        res.status(200).json(await addMessageUser(req.body, 'B', true))
      } else {
        res.status(200).json(retorno)
      }
    }
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: 'error',
    })
  }
}
