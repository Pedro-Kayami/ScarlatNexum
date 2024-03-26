// import axios from 'axios'
// import moment from 'moment-timezone'
// const criarConexao = '@/assets/database/gerarProtocolos/criarConexao'

// async function CriarProtocoloPrincipal(numero) {
//   try {
//     console.log(`CriarProtocoloPrincipal`)
//     const dataAtualFormatada = moment
//       .tz('America/Sao_Paulo')
//       .format('YYYY-MM-DD HH:mm:ss')
//     // eslint-disable-next-line no-undef
//     const Nome = await clientInstance.client.getChatById(numero + '@c.us')
//     const nomeWhatsapp = Nome.contact.pushname
//     // eslint-disable-next-line no-undef
//     const Foto = await clientInstance.client.getProfilePicFromServer(
//       numero + '@c.us',
//     )
//     // Uso da função
//     let foto = ''
//     if (Foto.tag != null) {
//       await imageUrlToBase64(Foto.imgFull)
//         .then((base64String) => (foto = base64String))
//         .catch((error) =>
//           console.error('Erro ao converter imagem para base64:', error),
//         )
//     } else {
//       foto = null
//     }
//     // eslint-disable-next-line no-undef
//     const db = await obterCliente()
//     const collection = db.collection('PROTOCOLOS')

//     const lastDocument = await collection.findOne(
//       {},
//       {
//         sort: {
//           _id: -1,
//         },
//       },
//     )
//     const nextId = lastDocument ? lastDocument._id + 1 : 1

//     await collection.insertOne({
//       _id: nextId,
//       NUMERO: numero,
//       DATA_CRIACAO: dataAtualFormatada,
//       ULTIMO_CONTATO: dataAtualFormatada,
//       NOME: nomeWhatsapp,
//       FOTOPERFIL: foto,
//       STATUS: 'A',
//     })

//     // eslint-disable-next-line no-undef
//     entradaCount++

//     // eslint-disable-next-line no-undef
//     if (entradaCount >= MAX_ENTRADAS) {
//       // eslint-disable-next-line no-undef
//       entradaCount = 0
//       // eslint-disable-next-line no-undef
//       await cachedClient.close()
//       // eslint-disable-next-line no-undef
//       cachedClient = null
//       // eslint-disable-next-line no-undef
//       cachedDb = null
//     }

//     return nextId
//   } catch (error) {
//     // Lida com o erro relacionado à conexão fechada ou expirada
//     console.log(error)
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
//       // eslint-disable-next-line no-undef
//       cachedClient = await criarConexao.Client()
//       // eslint-disable-next-line no-undef
//       cachedDb = cachedClient.db('ScarlatDataBase')
//       // eslint-disable-next-line no-undef
//       if (entradaCount < MAX_ENTRADAS) {
//         return CriarProtocoloPrincipal(numero)
//       } else {
//         console.error('Erro ao conectar e inserir documentos:', error)
//       }
//     } else {
//       console.error('Erro ao conectar e inserir documentos:', error)
//     }
//   }
// }

// async function UpdateUltimoContrato(id) {
//   try {
//     console.log(`UpdateUltimoContrato`)
//     const dataAtualFormatada = moment
//       .tz('America/Sao_Paulo')
//       .format('YYYY-MM-DD HH:mm:ss')

//     // eslint-disable-next-line no-undef
//     const db = await obterCliente()
//     const collection = db.collection('PROTOCOLOS')

//     await collection.updateOne(
//       {
//         _id: id,
//       },
//       {
//         $set: {
//           ULTIMO_CONTATO: dataAtualFormatada,
//         },
//       },
//     )
//   } catch (error) {
//     // Lida com o erro relacionado à conexão fechada ou expirada
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
//         return UpdateUltimoContrato(id)
//       } else {
//         console.error('Erro ao conectar e inserir documentos:', error)
//       }
//     }
//   }
// }

// async function AlteraStatusProtocolo(id, status) {
//   try {
//     console.log(`AlteraStatusProtocolo`)
//     // eslint-disable-next-line no-undef
//     const db = await obterCliente()
//     const collection = db.collection('PROTOCOLOS')

//     await collection.updateOne(
//       {
//         _id: id,
//       },
//       {
//         $set: {
//           STATUS: status,
//         },
//       },
//     )
//   } catch (error) {
//     // Lida com o erro relacionado à conexão fechada ou expirada
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
//         return AlteraStatusProtocolo(id, status)
//       } else {
//         console.error('Erro ao conectar e inserir documentos:', error)
//       }
//     }
//   }
// }

// async function imageUrlToBase64(url) {
//   try {
//     const response = await axios.get(url, {
//       responseType: 'arraybuffer',
//     })
//     const buffer = Buffer.from(response.data, 'binary')
//     const base64String = buffer.toString('base64')
//     return base64String
//   } catch (error) {
//     throw new Error('Erro ao converter imagem para base64: ' + error.message)
//   }
// }

// exports.UpdateUltimoContrato = UpdateUltimoContrato
// exports.CriarProtocoloPrincipal = CriarProtocoloPrincipal
// exports.AlteraStatusProtocolo = AlteraStatusProtocolo
