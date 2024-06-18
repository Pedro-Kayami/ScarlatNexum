export interface language {
  code: string
}

export interface image {
  id: string
}

export interface document {
  id: string
}

export interface audio {
  id: string
}

export interface text {
  preview_url: boolean
  body: string
}

export interface components {
  type: string
  parameters: []
}

export interface template {
  name: string
  language: language
  components?: [components]
}

export interface sendApiRequest {
  messaging_product?: string
  recipient_type?: string
  to: string
  type?: string
  image?: image
  document?: document
  audio?: audio
  text?: text
  template?: template
}
