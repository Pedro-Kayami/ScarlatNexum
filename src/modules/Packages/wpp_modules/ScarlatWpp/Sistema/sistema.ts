// eslint-disable-next-line @typescript-eslint/no-var-requires
import meuEmitter from '@/modules/Events/Emitter.js'
import {
  getBase64Image,
  getType,
} from '@/modules/Packages/wpp_modules/ScarlatWpp/utils/utils.js'
let exportedClient
// eslint-disable-next-line @typescript-eslint/no-var-requires
const wpp = require('@wppconnect-team/wppconnect')
wpp
  .create({
    session: 'Scarlat',
    headless: true,
  })
  .then((client) => start(client))
  .catch((error) => console.log(error))

function start(client) {
  exportedClient = client
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
}

export default exportedClient
