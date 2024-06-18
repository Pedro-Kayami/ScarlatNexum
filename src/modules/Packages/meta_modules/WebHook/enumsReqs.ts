interface profile {
  name: string
}

interface value {
  messages: []
  contacts: [profile]
}

export interface entry {
  changes: [value]
  type: string
}

export interface webhook {
  entry
  from: string
}
