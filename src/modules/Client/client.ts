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

async function sendTextClient(params: unknown) {
  const { identifier, provider, message } = (
    params as {
      body: { identifier: string; provider: string; message: object }
    }
  ).body
  const client = await getClient(provider)
  try {
    if (provider === 'whats_wpp') {
      const identifierUs = identifier + '@c.us'
      client.sendText(identifierUs, (message as { text: string }).text)
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

async function sendTemplateClient(params: unknown) {
  const { provider } = (
    params as {
      body: {
        identifier: string
        provider: string
        message: unknown
        components: unknown
      }
    }
  ).body
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

async function sendFileBase64Client(params: unknown) {
  console.log(params)
  try {
    let data: string = ''
    const { identifier, provider, message } = (
      params as {
        body: { identifier: string; provider: string; message: unknown }
      }
    ).body
    const client = await getClient(provider)
    let base64: unknown = (message as { type: string; fileBase: string })
      .fileBase
    data = `data:${(message as { mimeType: string }).mimeType};base64,${base64}`
    const quality = 80
    if ((message as { type: string; fileBase: string }).type === 'image') {
      const { fileBase } = message as { type: string; fileBase: string }
      base64 = await utilsAll.decreaseImageQuality(fileBase as string, quality)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      data = `data:${(message as { mimeType: string }).mimeType};base64,${base64}`
    }
    if ((message as { type: string; fileBase: string }).type === 'ptt') {
      let base64: string = (
        message as { type: string; fileBase: string }
      ).fileBase.toString()
      if (utilsAll.isWebM(base64)) {
        base64 = await utilsAll.convertWebMtoMP3(base64)
        console.log('base64', base64)
        data = `data:audio/mp3;base64,${base64}`
      }
    }

    if (provider === 'telegram') {
      // ScarlatTelegram.sendFile(identifier, base64, message.fileName, message.type)
    } else if (provider === 'whats_wpp') {
      const identifierUs = identifier + '@c.us'
      client.sendFile(identifierUs, data)
    } else if (provider === 'whats_meta') {
      client.sendFile(
        identifier,
        `${base64}`,
        (message as { fileName: string }).fileName,
        (message as { type: string }).type,
      )
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

export default {
  sendTextClient,
  sendTemplateClient,
  sendFileBase64Client,
}
