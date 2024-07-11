export interface parameters {
  name_parameter: string
  type: string
}

export interface components {
  parameters?: [parameters]
}

export interface templateMessage {
  name?: string
  components: [components]
}
// sendListMessage('[number]@c.us', {
//   buttonText: 'Click Me!', //required
//   description: "Hello it's list message", //required
//   title: 'Hello user', //optional
//   footer: 'Click and choose one', //optional
//   sections: [{
//     title: 'Section 1',
//     rows: [{
//       rowId: 'rowid1',
//       title: 'Row 1',
//       description: "Hello it's description 1",
//     },{
//       rowId: 'rowid2',
//       title: 'Row 2',
//       description: "Hello it's description 2",
//     }]
//   }]
// });
export interface row {
  id?: string
  rowId?: string
  title?: string
  description?: string
}

export interface section {
  title?: string
  rows?: [row]
}

export interface listMessage {
  buttonText?: string
  description?: string
  title?: string
  footer?: string
  sections: [section]
}

export interface message {
  type: string
  fileBase?: string
  mimeType?: string
  fileName?: string
  template?: templateMessage
  list?: listMessage
  text?: string
}
