import axios from 'axios'
import * as https from 'https'

export function dispararHook(params) {
  const paramsmessage = params
  console.log('Disparando Hook: ', paramsmessage)
  console.log('Disparando URL: ', process.env.URL_WEBHOOK_MENSAGENS)

  const webhookUrl = process.env.URL_WEBHOOK_MENSAGENS || ''
  axios
    .post(webhookUrl, paramsmessage, {
      headers: {
        'Content-Type': 'application/json',
      },
      httpsAgent,
    })
    .then((response) => {
      console.log('Response: ', response.data)
    })
    .catch((error) => {
      console.log(
        'Error occurred while sending the request: ',
        error.response.data,
      )
    })
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})
