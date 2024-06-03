// eslint-disable-next-line @typescript-eslint/no-var-requires
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as wpp from '@wppconnect-team/wppconnect'

import meuEmitter from '@/modules/Events/Emitter.js'
import {
  getBase64Image,
  getType,
} from '@/modules/Packages/wpp_modules/ScarlatWpp/utils/utils.js'
let client: wpp.Whatsapp
export const loadClient = async () => {
  if (client) {
    return client
  }

  try {
    client = await wpp.create({
      session: process.env.BOT_NAME,
      headless: true,
      debug: process.env.NODE_ENV === 'development',
      deviceName: process.env.WHATSAPP_DEVICE_NAME,
      whatsappVersion: process.env.WHATSAPP_VERSION,
      autoClose: 1000000,
      disableWelcome: true,
      updatesLog: true,
      waitForLogin: false,
      logQR: true,
      browserArgs: ['--no-sandbox'],
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
          // eslint-disable-next-line no-undef
          message: returnType.message,
          name: message.notifyName,
          provider: 'whats_wpp',
          type: returnType.type,
          // eslint-disable-next-line no-undef
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
