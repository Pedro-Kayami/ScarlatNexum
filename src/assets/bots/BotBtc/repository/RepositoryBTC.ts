import { createCollections, getClient } from '@/assets/database/dataBase'

interface dataBTC {
  conversationId?: string
  service?: string
}

async function addData(
  conversationId: string,
  dataBTC: dataBTC,
): Promise<void> {
  await createCollections('btc')
  const client = await getClient()
  const collection = client.collection('btc')

  await collection.updateOne(
    { conversationId },
    { $setOnInsert: dataBTC },
    { upsert: true },
  )
}

async function getData(conversationId: string): Promise<dataBTC> {
  const client = await getClient()
  const collection = client.collection('btc')

  const data = collection.findOne({ conversationId })
  return data as dataBTC
}

async function updateData(
  conversationId: string,
  dataBTC: dataBTC,
): Promise<void> {
  await createCollections('btc') // Certifique-se de que a coleção existe
  const client = await getClient() // Obtém o cliente do banco de dados
  const collection = client.collection('btc') // Seleciona a coleção

  await collection.updateOne(
    { conversationId }, // Filtro para encontrar o documento
    { $set: dataBTC }, // Atualiza os dados se o documento existir
    { upsert: true }, // Insere um novo documento se não encontrar um correspondente
  )
}

export default { addData, getData, updateData }
