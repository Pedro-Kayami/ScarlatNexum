import axios from 'axios'

// let cachedClient = null;
// let cachedDb = null;
// let entradaCount = 0;
// const MAX_ENTRADAS = 10;

export function dispararHook(params: unknown) {
  const urlMod = process.env.LINK_WEBHOOK_MENSAGENS
  axios
    .post(urlMod, params, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => {})
    .catch(() => {})
}

// const apiProtocolos =
//   'https://nxbr-demonstrativo-api.nexum.com.br/api/v1/webhooks/atendimento/conversas'

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// async function dispararProtocolos() {
//   const retorno = await obterDadosProtocolos()

//   axios
//     .post(apiProtocolos, retorno)
//     .then(() => {})
//     .catch(() => {})
// }

// setInterval(() => {
//     dispararProtocolos()
// }, 3000);

// async function obterDadosProtocolos() {
//   const db = await getClient()
//   const collectionProtocolos = db.collection('PROTOCOLOS')
//   const search: unknown = {
//     status: 'A',
//   }

//   const dataProtocolos = await collectionProtocolos.find(search).toArray()

//   const resultados: unknown[] = []

//   await Promise.all(
//     dataProtocolos.map(async (elemento) => {
//       try {
//         const messages: unknown = await getDataMessages(
//           elemento._id.toHexString(),
//         )

//         const resultado = {
//           conversationId: elemento._id.toHexString(),
//           provider: elemento.provider,
//           identifier: elemento.identifier,
//           lastMessage: (messages as unknown[])[
//             (messages as unknown[]).length - 1
//           ],
//           operatorId: elemento.operatorId,
//           name: elemento.name,
//           status: elemento.status,
//           countNotReads: contarNaoLidas(messages),
//           photo: elemento.photo || null,
//           dateCreated: elemento.dateCreated,
//         }

//         resultados.push(resultado)
//       } catch (error) {
//         console.error(
//           'Error fetching data for Protocolo ID:',
//           elemento._id,
//           error,
//         )
//       }
//     }),
//   )

//   return resultados
// }

// function contarNaoLidas(array: unknown) {
//   let naoLidas = 0

//   for (let i = 0; i < (array as Array<{ read: boolean }>).length; i++) {
//     if (!(array as Array<{ read: boolean }>)[i].read) {
//       naoLidas++
//     }
//   }

//   return naoLidas
// }

// function getDataMessages(conversationId: string) {
//   // eslint-disable-next-line no-async-promise-executor
//   return new Promise(async (resolve, reject) => {
//     try {
//       const db = await getClient()
//       const collection = db.collection('MENSAGENS')
//       const data: unknown = await collection
//         .find({
//           conversationId: new BSON.ObjectId(conversationId),
//         })
//         .toArray()
//       resolve(data)
//     } catch (error) {
//       reject(error)
//     }
//   })
// }
