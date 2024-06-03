import { message } from '@/assets/api2/enums/enumRequest.js'
import utilsAll from '@/modules/Packages/utils/utilsAll.js'
// import ScarlatMetaWhats from '../Packages/meta_modules/ScarlatMetaWhats/Requisicoes/API.js'
import { loadClient } from '@/modules/Packages/wpp_modules/ScarlatWpp/Sistema/sistema.js'

async function getClient(provider: string) {
  if (provider === 'whats_wpp') {
    return await loadClient()
  } else if (provider === 'whats_meta') {
    // return   .client
  } else if (provider === 'telegram') {
    // return ScarlatTelegrama.bot.telegram;
  }
}

async function sendTextClient(
  identifier: string,
  provider: string,
  message: message,
  name?: string,
) {
  const client = await getClient(provider)
  try {
    if (provider === 'whats_wpp') {
      if (await !client.checkNumberStatus(identifier + '@c.us')) {
        return {
          status: 'error',
          message: 'Number not found',
        }
      }
      const identifierUs = identifier + '@c.us'
      let sendText = message.text
      if (name) {
        sendText = `*${name}*\n${sendText}`
      }
      if (await !client.sendText(identifierUs, sendText)) {
        return {
          status: 'error',
          message: 'Error sending message',
        }
      }
    } else if (provider === 'whats_meta' || provider === 'telegram') {
      // client.sendMessage(identifier, message)
    } else {
      throw Error()
    }
    return {
      status: 'success',
    }
  } catch (error) {
    console.error('Error sendTextClient: ', error)
    return {
      status: 'error',
    }
  }
}

async function sendTemplateClient(
  identifier: string,
  provider: string,
  // message: templateMessage,
) {
  // const client = await getClient(provider)
  try {
    if (provider === 'whats_meta') {
      // client.sendTemplate(identifier, message, components)

      return {
        status: 'success',
      }
    } else {
      return {
        status: 'error',
        message: `This action is not possible with ${provider}`,
      }
    }
  } catch (error) {
    console.error('Error sendTextClient: ', error)
    return {
      status: 'error',
    }
  }
}

async function sendFileBase64Client(
  identifier: string,
  provider: string,
  message: message,
) {
  try {
    const quality = 80

    let data: string = ''
    const client = await getClient(provider)
    let base64, mimeType
    if (message.type === 'document') {
      base64 = message.fileBase
      mimeType = message.mimeType
    }
    if (message.type === 'image') {
      base64 = await utilsAll.decreaseImageQuality(message.fileBase, quality)
      mimeType = message.mimeType
    }
    if (message.type === 'ptt') {
      base64 = message.fileBase
      mimeType = message.mimeType
      if (utilsAll.isWebM(base64)) {
        base64 = await utilsAll.convertWebMtoMP3(base64)
        console.log('base64', base64)
        data = `data:audio/mp3;base64,${base64}`
      }
    }

    data = `data:${mimeType};base64,${base64}`

    if (provider === 'telegram') {
      // ScarlatTelegram.sendFile(identifier, base64, message.fileName, message.type)
    } else if (provider === 'whats_wpp') {
      const identifierUs = identifier + '@c.us'
      client.sendFile(identifierUs, data)
    } else if (provider === 'whats_meta') {
      // client.sendFile(
      //   identifier,
      //   `${base64}`,
      //   .fileName,
      //   (message as { type: string }).type,
      // )
    } else {
      throw Error()
    }

    return {
      status: 'success',
    }
  } catch (error) {
    console.log('Erro sendFileBase64Client', error)
    return {
      status: 'error',
    }
  }
}

async function getQrCode() {
  const client = await getClient('whats_wpp')
  if ((await client.getConnectionState()).toString() === 'CONNECTED') {
    return {
      status: 'success',
      message: 'Connected',
      qrCode: null,
    }
  } else {
    return {
      status: 'success',
      qrCode: (await client.getQrCode()).base64Image,
    }
  }
}

export default {
  getQrCode,
  sendTextClient,
  sendTemplateClient,
  sendFileBase64Client,
}
