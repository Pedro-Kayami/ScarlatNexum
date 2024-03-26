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
      session: 'Scarlat',
      headless: true,
      debug: process.env.NODE_ENV === 'development',
      deviceName: 'Scarlat',
    })

    client.onMessage(async (message) => {
      if (
        !message.isGroupMsg &&
        message.from !== 'status@broadcast' &&
        message.type !== 'gp2'
      ) {
        const arrumarbody = {
          identifier: message.from.replace('@c.us', ''),
          // eslint-disable-next-line no-undef
          message: await getType(client, message),
          name: message.notifyName,
          provider: 'whats_wpp',
          type: message.type,
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
