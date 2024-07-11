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

export interface row {
  id?: string
  rowId?: string
  title?: string
  description?: string
}

export interface sections {
  title?: string
  rows?: [row]
}

export interface action {
  button?: string
  sections?: [sections]
}

export interface body {
  text: string
}
export interface footer {
  text: string
}

export interface interactive {
  type: string
  header?: string
  body?: body
  footer?: footer
  buttons?: []
  action?: action
}

export interface sendApiRequest {
  messaging_product?: string
  interactive?: interactive
  recipient_type?: string
  to: string
  type?: string
  image?: image
  document?: document
  audio?: audio
  text?: text
  template?: template
}
