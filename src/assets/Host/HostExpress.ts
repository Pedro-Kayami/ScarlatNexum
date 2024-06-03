import bodyParser from 'body-parser'
import express from 'express'

// import ScarlatMeta from '../../modules/Packages/meta_modules/WebHook/webhook'
import userController from '@/assets/api2/controller/RestController.js'
import { authenticateToken } from '@/assets/auth/middleware/middlewareAuth.js'
import Auth from '@/assets/auth/routes/authRoutes.js'
import { createCollectionIfNotExists } from '@/assets/database/dataBase.js'

const port: number = 8080
const app = express()

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
app.use('/', userController)

createCollectionIfNotExists()

app.listen(port, () => {
  console.log(`The app is running on port ${port}`)
})
