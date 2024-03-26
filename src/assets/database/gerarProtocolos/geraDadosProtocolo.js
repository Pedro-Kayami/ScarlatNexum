// // Scarpim: Id do protocolo (puxar da principal), mensagem enviada,data de envio,ordem
// // const criarConexao = require('../BancoDeDados');
// import { tz } from 'moment-timezone'

// import {
//   AlteraStatusProtocolo,
//   UpdateUltimoContrato,
// } from '../gerarProtocolos/geraProtocoloPrincipal'

// async function CriarProtocoloMSG(id, msg) {
//   try {
//     console.log(`CriarProtocoloMSG`)
//     const dataAtualFormatada = tz('America/Sao_Paulo').format(
//       'YYYY-MM-DD HH:mm:ss',
//     )
//     // eslint-disable-next-line no-undef
//     const client = await criarConexao.Client()
//     const db = client.db('ScarlatDataBase')
//     const collection = db.collection('MENSAGENS')

//     // Encontrar o último valor de ORDEM para o mesmo PROTOCOLO_ID
//     const lastOrdem = await collection.findOne(
//       {
//         PROTOCOLO_ID: id,
//       },
//       {
//         sort: {
//           ORDEM: -1,
//         },
//       },
//     )
//     const nextOrdem = lastOrdem ? lastOrdem.ORDEM + 1 : 1

//     const lastid = await collection.findOne(
//       {},
//       {
//         sort: {
//           _id: -1,
//         },
//       },
//     )
//     const nextid = lastid ? lastid._id + 1 : 1

//     await collection.insertOne({
//       _id: nextid,
//       PROTOCOLO_ID: id,
//       MENSAGEM: msg,
//       DATA_ENVIO: dataAtualFormatada,
//       ORDEM: nextOrdem,
//       USUARIO: 'U',
//       LIDA: 'false',
//     })

//     client.close()
//     await UpdateUltimoContrato(id)

//     const delayMilliseconds = 1000 // 1 segundo
//     await new Promise((resolve) => setTimeout(resolve, delayMilliseconds))

//     // Continuar com o resto do código após o atraso
//     // ...
//   } catch (error) {
//     if (
//       error.message &&
//       (error.message.includes('closed') ||
//         error.message.includes('Client must be connected') ||
//         error.message.includes('duplicate key') ||
//         error.message.includes('Cannot use a session that has ended'))
//     ) {
//       console.warn(
//         'Conexão fechada, expirada ou não conectada. Tentando novamente...',
//       )
//       // Tenta obter uma nova conexão
//       // eslint-disable-next-line no-undef
//       cachedClient = await criarConexao.Client()
//       // eslint-disable-next-line no-undef
//       cachedDb = cachedClient.db('ScarlatDataBase')
//       // Recurso para evitar um loop infinito
//       // eslint-disable-next-line no-undef
//       if (entradaCount < MAX_ENTRADAS) {
//         return CriarProtocoloMSG(id, msg)
//       } else {
//         console.error('Erro ao conectar e inserir documentos:', error)
//       }
//     } else {
//       console.error('Erro ao conectar e inserir documentos:', error)
//     }
//   }
// }

// async function CriarProtocoloMSGBot(id, msg) {
//   try {
//     console.log(`CriarProtocoloMSGBot`)
//     const dataAtualFormatada = tz('America/Sao_Paulo').format(
//       'YYYY-MM-DD HH:mm:ss',
//     )
//     // eslint-disable-next-line no-undef
//     const client = await criarConexao.Client()
//     const db = client.db('ScarlatDataBase')
//     const collection = db.collection('MENSAGENS')

//     // Encontrar o último valor de ORDEM para o mesmo PROTOCOLO_ID
//     const lastOrdem = await collection.findOne(
//       {
//         PROTOCOLO_ID: id,
//       },
//       {
//         sort: {
//           ORDEM: -1,
//         },
//       },
//     )
//     const nextOrdem = lastOrdem ? lastOrdem.ORDEM + 1 : 1

//     const lastid = await collection.findOne(
//       {},
//       {
//         sort: {
//           _id: -1,
//         },
//       },
//     )
//     const nextid = lastid ? lastid._id + 1 : 1
//     await collection.insertOne({
//       _id: nextid,
//       PROTOCOLO_ID: id,
//       MENSAGEM: msg,
//       DATA_ENVIO: dataAtualFormatada,
//       ORDEM: nextOrdem,
//       USUARIO: 'B',
//       LIDA: 'true',
//     })
//     client.close()
//     await UpdateUltimoContrato(id)

//     const delayMilliseconds = 1000 // 1 segundo
//     await new Promise((resolve) => setTimeout(resolve, delayMilliseconds))

//     // Continuar com o resto do código após o atraso
//     // ...
//   } catch (error) {
//     if (
//       error.message &&
//       (error.message.includes('closed') ||
//         error.message.includes('Client must be connected') ||
//         error.message.includes('duplicate key') ||
//         error.message.includes('Cannot use a session that has ended'))
//     ) {
//       console.warn(
//         'Conexão fechada, expirada ou não conectada. Tentando novamente...',
//       )
//       // Tenta obter uma nova conexão
//       // eslint-disable-next-line no-undef
//       cachedClient = await criarConexao.Client()
//       // eslint-disable-next-line no-undef
//       cachedDb = cachedClient.db('ScarlatDataBase')
//       // Recurso para evitar um loop infinito
//       // eslint-disable-next-line no-undef
//       if (entradaCount < MAX_ENTRADAS) {
//         return CriarProtocoloMSGBot(id, msg)
//       } else {
//         console.error('Erro ao conectar e inserir documentos:', error)
//       }
//     } else {
//       console.error('Erro ao conectar e inserir documentos:', error)
//     }
//   }
// }

// async function gravaMensagem(numero) {
//   try {
//     // Formatar o número para o formato desejado (remover @c.us e adicionar os parênteses, espaço e hífen)
//     const numeroFormatado = formatarNumero(numero)

//     // eslint-disable-next-line no-undef
//     const client = await criarConexao.Client()
//     const db = client.db('ScarlatDataBase')
//     const collection = db.collection('MENSAGENS')

//     // Utilizando uma expressão regular para encontrar o número no formato desejado
//     const regexNumero = new RegExp(`^${numeroFormatado}$`, 'i')
//     // Encontrar o último valor de ORDEM para o número formatado
//     const lastOrdem = await collection.findOne(
//       {
//         USUARIO: 'U',
//         MENSAGEM: regexNumero,
//       },
//       {
//         sort: {
//           ORDEM: -1,
//         },
//       },
//     )

//     client.close()

//     return lastOrdem ? lastOrdem.ORDEM : null
//   } catch (error) {
//     console.error('Erro ao conectar e consultar documentos:', error)
//     if (
//       error.message &&
//       (error.message.includes('closed') ||
//         error.message.includes('Client must be connected') ||
//         error.message.includes('duplicate key') ||
//         error.message.includes('Cannot use a session that has ended'))
//     ) {
//       console.warn(
//         'Conexão fechada, expirada ou não conectada. Tentando novamente...',
//       )
//       // Tenta obter uma nova conexão
//       // eslint-disable-next-line no-undef
//       cachedClient = await criarConexao.Client()
//       // eslint-disable-next-line no-undef
//       cachedDb = cachedClient.db('ScarlatDataBase')
//       // Recurso para evitar um loop infinito
//       // eslint-disable-next-line no-undef
//       if (entradaCount < MAX_ENTRADAS) {
//         return gravaMensagem(numero)
//       } else {
//         console.error('Erro ao conectar e inserir dados do Usuario:', error)
//       }
//     } else {
//       console.error('Erro ao conectar e inserir dados do Usuario:', error)
//     }
//     return null
//   }
// }

// function formatarNumero(numeroOriginal) {
//   // Extrair apenas os dígitos do número original
//   const numeros = numeroOriginal.match(/\d/g).join('')

//   // Formatar para (XX) XXXXX-XXXX
//   return `(${numeros.substring(2, 3)}) ${numeros.substring(4, 8)}-${numeros.substring(8)}`
// }

// function AlterarStatusPrincipal(id, status) {
//   AlteraStatusProtocolo(id, status)
// }

// const _CriarProtocoloMSG = CriarProtocoloMSG
// export { _CriarProtocoloMSG as CriarProtocoloMSG }
// const _AlterarStatusPrincipal = AlterarStatusPrincipal
// export { _AlterarStatusPrincipal as AlterarStatusPrincipal }
// const _CriarProtocoloMSGBot = CriarProtocoloMSGBot
// export { _CriarProtocoloMSGBot as CriarProtocoloMSGBot }
// const _gravaMensagem = gravaMensagem
// export { _gravaMensagem as gravaMensagem }
