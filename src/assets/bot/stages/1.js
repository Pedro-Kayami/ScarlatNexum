// import { get, post } from 'axios'

// import { CriarProtocoloMSG } from '../../DB/gerarProtocolos/geraDadosProtocolo.js'
// import { AlteraStatusProtocolo } from '../../DB/gerarProtocolos/geraProtocoloPrincipal.js'
// import { storage } from '../storage.js'

// const opStage = {
//   exec({ from, message }) {
//     const params = storage[from].params
//     let mensagem = ''
//     if (storage[from].params.opcoes) {
//       setTimeout(() => {
//         CriarProtocoloMSG(storage[from].protocolo, message)
//       }, 2000)
//       const ops = storage[from].params.opcoes
//       const posArray = ops.find((opcao) => opcao.id === message)
//       if (posArray) {
//         if (posArray.reply) {
//           mensagem = posArray.reply.toString()
//         }
//         const type = posArray.type.toString()
//         if (type === 'CALLBACK') {
//           typeCallback(posArray)
//           AlteraStatusProtocolo(storage[from].protocolo, 'F')
//           storage[from].stage = 0
//         } else if (type === 'TEXTO') {
//           storage[from].stage = 0
//         } else if (type === 'C' || type === 'F') {
//           AlteraStatusProtocolo(storage[from].protocolo, type)
//           storage[from].stage = 0
//         } else {
//           console.log('ERRO')
//         }

//         return mensagem
//       }
//     }
//     return `Desculpe, Não entendi\n\n${params.message}\n${params.opcoes.map((opcao) => `${opcao.id} - ${opcao.text}`).join('\n')}`
//   },
// }

// function typeCallback(posArray) {
//   const url = posArray.callback
//   const method = posArray.method.toUpperCase()

//   if (method === 'GET' || method === 'POST') {
//     const axiosPromise = method === 'GET' ? get(url) : post(url)

//     axiosPromise
//       .then(() => {
//         console.log('sucesso')
//       })
//       .catch((error) => {
//         console.error('Erro na solicitação:', error)
//         throw error
//       })
//   } else {
//     console.error('Método inválido:', method)
//   }
// }

// const _opStage = opStage
// export { _opStage as opStage }
