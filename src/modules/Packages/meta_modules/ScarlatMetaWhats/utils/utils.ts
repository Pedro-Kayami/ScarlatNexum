import axios from 'axios'
import fs from 'fs'
import { url } from 'inspector'
import path from 'path'

import utilsAll from '@/modules/Packages/utils/utilsAll.js'

const token = process.env.TOKEN_META

export async function getType(message) {
  if (message.type === 'text') {
    return {
      type: 'chat',
      message: {
        type: 'text',
        text: message.text.body,
      },
    }
  } else if (message.type === 'audio') {
    const base = await getArchive(message.audio.id)
    const baseFormat = base.split('base64,')[1]
    return {
      type: 'base64',
      message: {
        type: 'ptt',
        fileBase: baseFormat,
      },
    }
  } else if (message.type === 'image') {
    const base = await getArchive(message.image.id)
    try {
      const resizedBase64Data: string = (await utilsAll.decreaseImageQuality(
        base,
        60,
      )) as string
      const baseFormat = resizedBase64Data.split('base64,')[1]

      return {
        type: 'base64',
        message: {
          type: 'image',
          fileBase: baseFormat,
        },
      }
    } catch (error) {
      console.error(error)
    }
  } else if (message.type === 'document') {
    const base = await getArchive(message.document.id)
    const baseFormat = base.split('base64,')[1]
    return {
      type: 'base64',
      message: {
        type: 'document',
        fileName: message.fileName,
        fileBase: baseFormat[1],
        mimeType: baseFormat[0].replace('data:', '').replace(';', ''),
      },
    }
  }
}

export async function getIdMedia(base64, fileName, type) {
  try {
    let buffer
    if (type === 'image') {
      buffer = Buffer.from(
        (await utilsAll.decreaseImageQuality(base64, 60)) as string,
        'base64',
      )
    } else {
      buffer = Buffer.from(base64, 'base64')
    }
    const tempFilePath = path.join(__dirname, fileName)
    fs.writeFileSync(tempFilePath, buffer)

    const formData = new FormData()
    const fileStream = fs.createReadStream(tempFilePath)
    const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = []
      fileStream.on('data', (chunk: Buffer) => chunks.push(chunk))
      fileStream.on('end', () => resolve(Buffer.concat(chunks)))
      fileStream.on('error', (error: Error) => reject(error))
    })
    const fileBlob = new Blob([fileBuffer])
    formData.append('file', fileBlob, fileName)
    const response = await axios.post(url + '/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token,
      },
    })
    return response.data.id
  } catch (error) {
    console.error('Erro ao enviar imagem para o Facebook:', error)
  } finally {
    const tempFilePath = path.join(__dirname, fileName)
    await fs.unlinkSync(tempFilePath)
  }
}

async function getArchive(media) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  }

  try {
    const response = await axios({
      url: url + '/' + media,
      method: 'GET',
      headers,
    })

    return await getBase64(response.data.url)
  } catch (error) {
    console.error(error)
    return null
  }
}

async function getBase64(link) {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  }

  try {
    const response = await axios({
      url: link,
      method: 'GET',
      headers,
      responseType: 'arraybuffer',
    })

    const base64 = Buffer.from(response.data, 'binary').toString('base64')
    return base64
  } catch (error) {
    console.error(error)
    return null
  }
}

const client = {
  getIdMedia,
  getType,
}

export default client
