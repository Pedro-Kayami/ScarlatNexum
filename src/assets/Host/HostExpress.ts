import bodyParser from 'body-parser'
import ejs from 'ejs'
import express from 'express'
import http from 'http'
import path from 'path'

import userMensagemPost from '@/assets/api/routes/requestPost.js'
import { authenticateToken } from '@/assets/auth/middleware/middlewareAuth.js'
import Auth from '@/assets/auth/routes/authRoutes.js'
import { createCollectionIfNotExists } from '@/assets/database/dataBase.js'

// import ScarlatMeta from '../../modules/Packages/meta_modules/WebHook/webhook'
import userMensagemGet from '../api/routes/requestGet.js'

const port: number = 8080
const app = express()
const server: http.Server = http.createServer(app)

app.engine('html', ejs.renderFile)
app.set('view engine', 'html')
app.use(express.static(path.join(__dirname, '/public')))
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
)

app.get('/status', (req, res) => {
  res.json({
    status: 'OK',
  })
})

app.use('/', Auth)
// app.use('/', ScarlatMeta)

app.use('/', authenticateToken)
app.use('/', userMensagemGet)
app.use('/', userMensagemPost)

createCollectionIfNotExists()

server.listen(port, () => {
  console.log(`The app is running on port ${port}`)
})

export default app
