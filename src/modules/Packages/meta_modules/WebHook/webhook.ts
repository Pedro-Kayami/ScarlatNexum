import express, { Request, Response } from 'express'

import meuEmitter from '@/modules/Events/Emitter.js'
import client from '@/modules/Packages/meta_modules/ScarlatMetaWhats/utils/utils.js'
import { webhook } from '@/modules/Packages/meta_modules/WebHook/enumsReqs'

const router = express.Router()

router.use(express.json())
router.use(
  express.urlencoded({
    extended: true,
  }),
)

router.get('/webhook', (req: Request, res: Response) => {
  const query: unknown = req.query

  res.status(200).send(query['hub.challenge'])
})

router.post('/webhook', async (req: Request, res: Response) => {
  const body: webhook = req.body

  if (
    body.entry &&
    body.entry[0].changes &&
    body.entry[0].changes[0].value.messages
  ) {
    const entry = body.entry[0].changes[0].value.messages[0]
    if (entry) {
      const name = body.entry[0].changes[0].value.contacts[0].profile.name
      const returnType = await client.getType(entry)

      const dados = {
        identifier: entry.from,
        message: returnType.message,
        type: returnType.type,
        name,
        provider: 'whats_meta',
      }

      if (dados) {
        meuEmitter.emit('message', dados)
      }
    }
  }

  res.sendStatus(200)
})

export default router
