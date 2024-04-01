import axios from 'axios'

import decreaseImageQuality from '@/modules/Packages/utils/utilsAll.js'

export async function getType(client, message) {
  const type = message.type
  if (type === 'chat') {
    return message.body
  } else if (type === 'document') {
    const base = await client.downloadMedia(message.id)
    const baseFormat = base.split('base64,')
    return {
      type: 'base64',
      message: {
        type: 'document',
        fileName: message.fileName,
        fileBase: baseFormat[1],
        mimeType: baseFormat[0].replace('data:', '').replace(';', ''),
      },
    }
    // ...
  } else if (type === 'image') {
    const base = await client.downloadMedia(message.id)
    try {
      const resizedBase64Data = (await decreaseImageQuality(base, 60)) as string
      return {
        type: 'base64',
        message: {
          type: 'image',
          fileBase: resizedBase64Data,
        },
      }
    } catch (error) {
      console.error(error)
    }
  } else if (type === 'ptt') {
    const base = await client.downloadMedia(message.id)
    const baseFormat = base.split('base64,')[1]
    return {
      type: 'base64',
      message: {
        type: 'ptt',
        fileBase: baseFormat,
      },
    }
  }
}

export async function getBase64Image(client, from) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const Foto = await client.getProfilePicFromServer(from)
    if (Foto.imgFull) {
      resolve(await imageUrlToBase64(Foto.imgFull))
    } else {
      resolve(null)
    }
  })
}
async function imageUrlToBase64(url) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
    })
    const buffer = Buffer.from(response.data, 'binary')
    const base64String = buffer.toString('base64')
    return base64String
  } catch (error) {
    throw new Error('Erro ao converter imagem para base64: ' + error.message)
  }
}
