import { message } from '@/assets/api2/enums/enumMessage'

export interface statusResponse {
  status: string
  error?: string
  data?: unknown
  conversationId?: string
}

export interface MessageResponse {
  conversationId?: string
  identifier?: string
  firstContact?: string
  name?: string
  type?: string
  operatorId?: string
  status?: string
  dateCreated?: string
  data?: unknown
  event?: string
  message?: message
  provider?: string
  botId?: string
  stage?: number
}
