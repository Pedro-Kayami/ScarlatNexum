import axios from 'axios'
import fs from 'fs'
import path from 'path'

import decreaseImageQuality from '@/modules/Packages/utils/utilsAll.js'

const token = process.env.TOKEN_META

export async function getType(entry: Text) {
  let type = (entry as unknown as { type: string }).type
  if (type === 'text') {
    type = 'chat'
    return (entry as unknown as { text: string }).text
  } else if (type === 'audio') {
    // eslint-disable-next-line no-unused-expressions
    type = 'ptt'
    return {
      fileBase: await getArchive(
        (entry as unknown as { audio: { id: string } }).audio.id,
      ),
    }
  } else if (type === 'image' && 'image' in entry) {
    // eslint-disable-next-line no-unused-expressions
    type === 'image'
    const archive = await getArchive(
      (entry as { image: { id: string } }).image.id,
    )
    return {
      fileBase: await decreaseImageQuality(archive, 60),
    }
  } else if (type === 'document' && 'document' in entry) {
    // eslint-disable-next-line no-unused-expressions
    type === 'document'
    return {
      fileBase: await getArchive(
        (entry as { document: { id: string } }).document.id,
      ),
      fileName: (entry as { document: { filename: string } }).document.filename,
    }
  }
}

export async function getIdMedia(base64, fileName, type) {
  try {
    let buffer
    // eslint-disable-next-line n/no-path-concat
    const url = process.env.URL_META_MEDIA
    // ...

    if (type === 'image') {
      buffer = Buffer.from(
        (await decreaseImageQuality(base64, 60)) as string,
        'base64',
      )
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      buffer = Buffer.from(base64 as string, 'base64')
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
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token,
      },
    })
    // ...
    return response.data.id
  } catch (error) {
    console.error('Erro ao enviar imagem para o Facebook:', error)
  } finally {
    // eslint-disable-next-line n/no-path-concat
    const tempFilePath = `${__dirname}/${fileName}`
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
      url: 'https://graph.facebook.com/v17.0/' + media,
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
