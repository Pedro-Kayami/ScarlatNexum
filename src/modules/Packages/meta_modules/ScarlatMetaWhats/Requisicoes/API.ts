import axios from 'axios'

import { sendApiRequest } from '@/modules/Packages/meta_modules/ScarlatMetaWhats/enums/enumRequest'
import { getIdMedia } from '@/modules/Packages/meta_modules/ScarlatMetaWhats/utils/utils'

const token = process.env.TOKEN_META
const code = process.env.CODE_META
const url = process.env.URL_META + code

function sendMessage(from, message) {
  const data: sendApiRequest = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: from,
    type: 'text',
    text: {
      preview_url: false,
      body: message.text,
    },
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  }
  axios
    .post(url + '/messages', data, {
      headers,
    })
    .then((response) => {
      console.log('Resposta da API:', response.data)
    })
    .catch((error) => {
      console.error('Erro na requisição:', error)
    })
}

async function sendFile(identifier, base64, filename, type) {
  const idMedia = await getIdMedia(base64, filename, type)

  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  }

  const data: sendApiRequest = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: identifier,
  }

  if (type === 'image') {
    data.type = 'image'
    data.image = {
      id: idMedia,
    }
  } else if (type === 'document') {
    data.type = 'document'
    data.document = {
      id: idMedia,
    }
  } else if (type === 'ptt') {
    data.type = 'audio'
    data.audio = {
      id: idMedia,
    }
  }

  const response = await axios({
    url: url + '/media',
    method: 'POST',
    headers,
    data,
  })
  return response.data
}

function sendTemplate(from, template, components) {
  const data: sendApiRequest = {
    messaging_product: 'whatsapp',
    to: from,
    type: 'template',
    template: {
      name: template,
      language: {
        code: 'pt_BR',
      },
    },
  }
  if (components) {
    data.template.components = components
  }
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  }

  return axios
    .post(url + '/messages', data, {
      headers,
    })
    .then((response) => {
      console.log('Resposta da API:', response.data)
      return response
    })
    .catch((error) => {
      console.error('Erro na requisição:', error)

      return {
        status: 'error',
        message: 'Ocorreu um erro na requisição.',
        details: error,
      }
    })
}

const client = {
  sendMessage,
  sendTemplate,
  sendFile,
}

const getClient = () => {
  if (!client) {
    throw new Error('Client not connected')
  }
  return client
}

const ScarlatMetaWhats = {
  getClient,
}

export default ScarlatMetaWhats
