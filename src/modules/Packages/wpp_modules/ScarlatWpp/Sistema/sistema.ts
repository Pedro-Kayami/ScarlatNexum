// eslint-disable-next-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as wpp from '@wppconnect-team/wppconnect'

import meuEmitter from '@/modules/Events/Emitter.js'
import {
  getBase64Image,
  getType,
} from '@/modules/Packages/wpp_modules/ScarlatWpp/utils/utils.js'
let client: wpp.Whatsapp
const getConnection = async () => {
  if (client || process.env.NXZAP_WPP === 'false') {
    return
  }

  try {
    client = await wpp.create({
      session: process.env.BOT_NAME,
      headless: true,
      debug: process.env.NODE_ENV === 'development',
      deviceName: process.env.WHATSAPP_DEVICE_NAME,
      autoClose: 1000000,
      disableWelcome: true,
      updatesLog: true,
      waitForLogin: false,
      logQR: true,
      browserArgs: [
        '--no-sandbox',
        '--aggressive-cache-discard',
        '--disable-cache',
        '--disable-application-cache',
        '--disable-offline-load-stale-cache',
        '--disk-cache-size=0',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-first-run',
        '--safebrowsing-disable-auto-update',
        '--ignore-certificate-errors',
        '--ignore-ssl-errors',
        '--ignore-certificate-errors-spki-list',
      ],
    })

    client.onStateChange(async (state) => {
      console.log('State changed: ', state)
      if (state === 'CONNECTED') {
        console.log('Conectado')
      } else if (state === 'UNPAIRED') {
        console.log('Desconectado')
      } else if (state === 'CONFLICT') {
        console.log('Conflito')
      } else if (state === 'UNLAUNCHED') {
        console.log('Não iniciado')
      }
    })

    client.onMessage(async (message) => {
      console.log(message)
      if (
        !message.isGroupMsg &&
        message.from !== 'status@broadcast' &&
        message.type !== 'gp2' &&
        message.type !== 'ciphertext' &&
        message.type !== 'e2e_notification'
      ) {
        const returnType = await getType(client, message)
        const arrumarbody = {
          identifier: message.from.replace('@c.us', ''),
          message: returnType.message,
          name: message.notifyName,
          provider: 'whats_wpp',
          type: returnType.type,
          photo: await getBase64Image(client, message.from),
        }
        meuEmitter.emit('message', arrumarbody)
      }
    })

    return client
  } catch (error) {
    console.error(error)
  }
}

const getClient = () => {
  if (!client) {
    throw new Error('Client not connected')
  }
  return client
}

const ScarlatWpp = {
  getConnection,
  getClient,
}
export default ScarlatWpp
