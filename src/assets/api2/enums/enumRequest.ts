import { BSON } from 'mongodb'

import { message } from '@/assets/api2/enums/enumMessage'

export interface getMessagesRequest {
  conversationId: string
}

export interface getConversationRequest {
  operatorId: string
  status: string
}

export interface getQrCodeRequest {}

export interface patchReadMessageRequest {
  conversationId: string
  operatorId: string
}

export interface MessageRequest {
  event?: string
  conversationId: string
  operatorId: string
  message: message
  provider: string
  isConversation?: boolean
  type: string
  identifier: string
  name?: string
  photo?: string
}

export interface createConversationRequest {
  operatorId: string
  provider: string
  identifier: string
  name?: string
  deptoId?: string
}

export interface controllerBotRequest {
  conversationId: string
  botId: string
}

export interface finalization {
  type?: string
  observation?: string
  dateFinalization: string
}

export interface conversation {
  _id?: BSON.ObjectId
  firstContact?: string
  operatorId?: string
  provider: string
  status: string
  identifier: string
  name?: string
  dateCreated: string
  messages?: message
  conversationId?: string
  photo?: string
  stage?: number
  botId?: string
  type?: string
  observation?: string
  dateFinalization?: string
  deptoId?: string
  finalization?: finalization
}

export interface updateConversationRequest {
  conversationId: string
  status: string
  type: string
  observation?: string
}

export interface updateOperatorRequest {
  conversationId: string
  operatorId?: number | null
  deptoId?: number | null
}
