import utilsAll from '@/modules/Packages/utils/utilsAll.js'

// import ScarlatMetaWhats from '../Packages/meta_modules/ScarlatMetaWhats/Requisicoes/API.js'
import ScarlatWhatsWpp from '../Packages/wpp_modules/ScarlatWpp/Sistema/sistema.js'

function getClient(provider: string) {
  if (provider === 'whats_wpp') {
    return ScarlatWhatsWpp.client
  } else if (provider === 'whats_meta') {
    // return ScarlatMetaWhats.client
  } else if (provider === 'telegram') {
    // return ScarlatTelegrama.bot.telegram;
  }
}

async function sendTextClient(params: unknown) {
  const { identifier, provider, message } = (
    params as {
      body: { identifier: string; provider: string; message: unknown }
    }
  ).body
  const client = getClient(provider)
  try {
    if (provider === 'whats_wpp') {
      const identifierUs = identifier + '@c.us'
      client.sendText(identifierUs, message)
    } else if (provider === 'whats_meta' || provider === 'telegram') {
      client.sendMessage(identifier, message)
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
  const { identifier, provider, message, components } = (
    params as {
      body: {
        identifier: string
        provider: string
        message: unknown
        components: unknown
      }
    }
  ).body
  const client = getClient(provider)
  try {
    if (provider === 'whats_meta') {
      client.sendTemplate(identifier, message, components)

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
  try {
    const { identifier, provider, message } = (
      params as {
        body: { identifier: string; provider: string; message: unknown }
      }
    ).body
    const client = getClient(provider)
    let base64 = (message as { fileBase: string }).fileBase

    const quality = 80 // Add the declaration for the quality variable
    if ((message as { type: string; fileBase: string }).type === 'image') {
      base64 = await (
        utilsAll as unknown as {
          decreaseImageQuality: (
            base64Data: string,
            quality: unknown,
          ) => Promise<string>
        }
      ).decreaseImageQuality(
        (message as { fileBase: string }).fileBase,
        quality,
      )
    }

    if (provider === 'telegram') {
      // ScarlatTelegram.sendFile(identifier, base64, message.fileName, message.type)
    } else if (provider === 'whats_wpp') {
      const identifierUs = identifier + '@c.us'
      client.sendFile(
        identifierUs,
        `data:${(message as { mimeType: string }).mimeType};base64,${base64}`,
        (message as { fileName: string }).fileName,
      )
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
    console.log(error)
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
