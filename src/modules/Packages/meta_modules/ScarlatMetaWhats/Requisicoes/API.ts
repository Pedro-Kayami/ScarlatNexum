// import axios from 'axios'
// import utils from './utils.ts'; // Import the 'utils' module

// const token = process.env.TOKEN_META
// const url = process.env.URL_META

// function sendMessage(from, message) {
//   const data = {
//     messaging_product: 'whatsapp',
//     recipient_type: 'individual',
//     to: from,
//     type: 'text',
//     text: {
//       preview_url: false,
//       body: message,
//     },
//   }

//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: token,
//   }

//   axios
//     .post(url, data, {
//       headers,
//     })
//     .then((response) => {
//       console.log('Resposta da API:', response.data)
//     })
//     .catch((error) => {
//       console.error('Erro na requisição:', error)
//     })
// }

// async function sendFile(identifier, base64, filename, type) {
//     const idMedia = await utils.getIdMedia(base64, filename, type)

//     const headers = {
//       'Content-Type': 'application/json',
//       Authorization: token,
//     }

//     const data = {
//       messaging_product: 'whatsapp',
//       recipient_type: 'individual',
//       to: identifier,
//     }

//     if (type === 'image') {
//       data.type = 'image'
//       data.image = {
//         id: idMedia,
//       }
//     } else if (type === 'document') {
//       data.type = 'document'
//       data.document = {
//         id: idMedia,
//       }
//     }
//       data.type = 'document'
//       data.document = {
//         id: idMedia,
//       }
//     } else if (type === 'ptt') {
//       data.type = 'audio'
//       data.audio = {
//         id: idMedia,
//       }
//     }

//     const response = await axios({
//       url: process.env.URL_META,
//       method: 'POST',
//       headers,
//       data,
//     })
//     return response.data
// }

// function sendTemplate(from, template, components) {
//   let data
//   if (components.lenght <= 0) {
//     data = {
//       messaging_product: 'whatsapp',
//       to: from,
//       type: 'template',
//       template: {
//         name: template,
//         language: {
//           code: 'pt_BR',
//         },
//       },
//     }
//   } else {
//     data = {
//       messaging_product: 'whatsapp',
//       to: from,
//       type: 'template',
//       template: {
//         name: template,
//         language: {
//           code: 'pt_BR',
//         },
//         components: [
//           {
//             type: 'body',
//             parameters: components,
//           },
//         ],
//       },
//     }
//   }
//   const headers = {
//     'Content-Type': 'application/json',
//     Authorization: token,
//   }

//   return axios
//     .post(url, data, {
//       headers,
//     })
//     .then((response) => {
//       console.log('Resposta da API:', response.data)
//       return response
//     })
//     .catch((error) => {
//       console.error('Erro na requisição:', error)

//       return {
//         status: 'error',
//         message: 'Ocorreu um erro na requisição.',
//         details: error,
//       }
//     })
// }

// const client = {
//   sendMessage,
//   sendTemplate,
//   sendFile,
// }
// export default client
