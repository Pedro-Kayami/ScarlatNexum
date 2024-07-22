import { ClientType } from '@/assets/api2/enums/enumClient'
import { MessageResponse } from '@/assets/api2/enums/enumResponse'
import { addMessageUser } from '@/assets/api2/services/response/response'
import { setBot } from '@/assets/bots/utils/utils'
import { getClient } from '@/modules/Client/client'

export async function stage5(message: MessageResponse) {
  const client: ClientType = await getClient(message.provider)
  if (message.message.text === 'Operações') {
    const list = {
      type: 'list',
      buttonText: 'Clique aqui!', // required
      description: 'Selecione uma opção!', // required
      title: 'Qual operação deseja:',
      sections: [
        {
          title: 'Escolha uma opção:',
          rows: [
            {
              rowId: 'rowid1',
              title: 'Outras Operações',
            },
            {
              rowId: 'rowid2',
              title: 'Mercado Livre',
            },
          ],
        },
      ],
    }
    await addMessageUser(
      message.conversationId,
      'list',
      message.identifier,
      list,
      'B',
      true,
    )
    client.sendListMessage(message.identifier, list)
    await setBot(message.conversationId, 'coopmetro', 6)
  } else if (message.message.text === 'Lojas Cooperado') {
    const messageReturn = {
      type: 'text',
      text: 'Aguarde um momento, estou transferindo para um dos nosso consultores. Obrigado!',
    }
    await addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      messageReturn,
      'B',
      true,
    )
    client.sendText(message.identifier, messageReturn.text)
  } else if (message.message.text === 'Portal') {
    const messageReturn = {
      type: 'text',
      text: 'Para informações sobre cadastro e acesso aos dados do Portal, solicito que acesse o site #SITE. Lá você poderá verificar seus dados cadastrais, recuperar senhas e muito mais. Obrigado!',
    }
    await addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      messageReturn,
      'B',
      true,
    )
    client.sendText(message.identifier, messageReturn.text)
    await setBot(message.conversationId, 'NDA', null)
  } else {
    const messageReturn = {
      type: 'text',
      text: 'Opção não encontrada. Por favor, verifique se o número está correto e tente novamente.',
    }
    await addMessageUser(
      message.conversationId,
      'chat',
      message.identifier,
      messageReturn,
      'B',
      true,
    )
    client.sendText(message.identifier, messageReturn.text)
  }
}
