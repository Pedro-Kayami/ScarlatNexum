import { BSON } from 'mongodb'
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

export interface message {
  type: string
  fileBase?: string
  mimeType?: string
  fileName?: string
  name?: string
  variables?: { [key: string]: string }
  text?: string
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
}

export interface conversation {
  _id: BSON.ObjectId
  firstContact: string
  operatorId?: string
  provider: string
  status: string
  identifier: string
  name?: string
  dateCreated: string
  messages?: message
  photo?: string
}

export interface updateConversationRequest {
  conversationId: string
  status: string
  type: string
  observation?: string
}

export interface updateOperatorRequest {
  conversationId: string
  operatorId: number
}
