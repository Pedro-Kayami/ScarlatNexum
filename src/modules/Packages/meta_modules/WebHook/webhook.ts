import express, { Request, Response } from 'express'

import meuEmitter from '@/modules/Events/Emitter.js'
import { getType } from '@/modules/Packages/meta_modules/utils/utils.js'

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
  const body: unknown = req.body

  if (
    (body as { entry?: unknown }).entry &&
    (body as { entry?: unknown }).entry[0].changes &&
    (body as { entry?: unknown }).entry[0].changes[0].value.messages
  ) {
    const entry = (body as { entry?: unknown }).entry[0].changes[0].value
      .messages[0]
    if (entry) {
      const bodyTyped = body as { entry?: unknown }
      const name = bodyTyped.entry[0].changes[0].value.contacts[0].profile.name

      const dados = {
        type: entry.type,
        identifier: Number,
        message: await getType(entry),
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
