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
  operatorId?: string
  status?: string
  dateCreated?: string
  data?: unknown
  event?: string
}
