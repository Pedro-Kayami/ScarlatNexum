// import storagesADO from '@/assets/bot/storage.js'
// import geraProtocoloMSG from '@/DB/gerarProtocolos/geraDadosProtocolo.js'
// import geraProtocolo from '@/DB/gerarProtocolos/geraProtocoloPrincipal.js'

// const initialStage = {
//   exec({ from, message }) {
//     if (message && message !== '' && message !== undefined) {
//       if (storagesADO.storage[from].protocolo) {
//         setTimeout(() => {
//           geraProtocoloMSG.CriarProtocoloMSG(
//             storagesADO.storage[from].protocolo,
//             message,
//           )
//         }, 2000)
//       } else {
//         setTimeout(() => {
//           const telnumber = from.replace('@c.us', '')
//           geraProtocolo
//             .CriarProtocoloPrincipal(telnumber)
//             .then((nextId) => {
//               storagesADO.storage[from].protocolo = nextId
//               storagesADO.storage[from].stage = 0

//               // eslint-disable-next-line no-undef
//               numProcotocolo = nextId

//               setTimeout(() => {
//                 geraProtocoloMSG.CriarProtocoloMSG(
//                   storagesADO.storage[from].protocolo,
//                   message,
//                 )
//               }, 1000)
//             })
//             .catch((error) => {
//               console.error('Erro ao criar protocolo:', error)
//             })
//         }, 2000)
//       }
//     }
//     return ''
//   },
// }

// exports.initialStage = initialStage
