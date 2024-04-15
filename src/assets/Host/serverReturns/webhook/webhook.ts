import axios from 'axios'
import * as https from 'https'

export function dispararHook(params: { message: unknown }) {
  console.log('Disparando Hook: ', params)
  console.log('Disparando URL: ', process.env.LINK_WEBHOOK_MENSAGENS)

  const message =
    typeof params.message === 'string'
      ? JSON.parse(params.message)
      : params.message

  const webhookUrl = process.env.LINK_WEBHOOK_MENSAGENS || ''
  axios
    .post(webhookUrl, message, {
      headers: {
        'Content-Type': 'application/json',
      },
      httpsAgent,
    })
    .then((response) => {
      console.log('Response: ', response.data)
      console.log('Request body: ', message)
    })
    .catch((error) => {
      console.log(
        'Error occurred while sending the request: ',
        error.response ? error.response.data : error.message,
      )
      console.log('Request body: ', message)
    })
}

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
})
