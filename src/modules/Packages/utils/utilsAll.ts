import ffmpeg from 'fluent-ffmpeg'
import fs from 'fs'
import sharp from 'sharp'

async function decreaseImageQuality(base64Data, quality) {
  return new Promise((resolve, reject) => {
    try {
      if (!base64Data) {
        reject(new Error('Os dados Base64 estão nulos ou vazios.'))
        return
      }

      const buffer = Buffer.from(
        base64Data.replace(/^data:image\/\w+;base64,/, ''),
        'base64',
      )

      sharp(buffer)
        .metadata()
        .then((metadata) => {
          const maxWidth = Math.round(
            (metadata.width || 0) / 3 + (metadata.width || 0) / 3,
          )
          const maxHeight = Math.round(
            (metadata.height || 0) / 3 + (metadata.height || 0) / 3,
          )

          sharp(buffer)
            .resize({
              width: maxWidth,
              height: maxHeight,
              fit: 'inside',
            })
            .jpeg({
              quality,
            })
            .toBuffer()
            .then((resizedBuffer) => {
              const resizedBase64Data = resizedBuffer.toString('base64')
              resolve(resizedBase64Data)
            })
            .catch((err) => {
              console.error(`Erro ao processar a imagem: ${err}`)
              reject(err)
            })
        })
        .catch((err) => {
          console.error(`Erro ao obter metadados da imagem: ${err}`)
          reject(err)
        })
    } catch (error) {
      console.error(`Erro inesperado: ${error}`)
      reject(error)
    }
  })
}

async function convertWebMtoMP3(base64WebM: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const buffer = Buffer.from(base64WebM, 'base64')

      fs.writeFileSync('temp.webm', buffer)
    } catch (err) {
      console.error('An error occurred while writing the file:', err)
      return reject(err)
    }

    // Configure ffmpeg to convert the .webm file to .mp3
    ffmpeg('temp.webm')
      .output('output.mp3')
      .audioCodec('libmp3lame')
      .on('end', () => {
        try {
          const outputBuffer = fs.readFileSync('output.mp3')
          const base64Output = outputBuffer.toString('base64')
          resolve(base64Output)
        } catch (err) {
          console.error('An error occurred while reading the file:', err)
          reject(err)
        }
      })
      .on('error', (err) => {
        console.error('An error occurred while converting the file:', err)
        reject(err)
      })
      .run()
  })
}

function isWebM(base64Data) {
  const data = Buffer.from(base64Data, 'base64').toString('binary')
  const webmSignature = '\x1A\x45\xDF\xA3'
  return data.startsWith(webmSignature)
}

export default { convertWebMtoMP3, decreaseImageQuality, isWebM }
