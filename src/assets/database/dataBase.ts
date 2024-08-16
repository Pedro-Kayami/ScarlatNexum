import { Db, MongoClient } from 'mongodb'

const dbName = process.env.DB_NAME
const collections = ['PROTOCOLOS', 'MENSAGENS', 'STAGES', 'users']

const clientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
}

export interface ClientResult {
  client: MongoClient
  db: Db
}

export async function createCollectionIfNotExists(): Promise<void> {
  let client: MongoClient | undefined

  try {
    client = await MongoClient.connect(process.env.DB_URL)
    const db = client.db(dbName)

    for (const collectionName of collections) {
      const existingCollections = await db
        .listCollections({
          name: collectionName,
        })
        .toArray()

      if (existingCollections.length > 0) {
        console.log(`A coleção ${collectionName} já existe.`)
      } else {
        await db.createCollection(collectionName)
        console.log(`A coleção ${collectionName} foi criada com successo.`)
      }
    }
  } catch (error) {
    console.error('Erro ao conectar e criar a coleção:', error)
  } finally {
    if (client) {
      await client.close()
    }
  }
}

export async function createCollections(collection: string): Promise<void> {
  try {
    const client = await MongoClient.connect(process.env.DB_URL)
    const db = client.db(dbName)

    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((col) => col.name)

    if (collectionNames.includes(collection)) {
      console.log(`A coleção ${collection} já existe.`)
      return
    }

    await db.createCollection(collection)
    console.log(`A coleção ${collection} foi criada com sucesso.`)

    client.close()
  } catch (error) {
    console.error('Erro ao criar a coleção:', error)
  }
}

export async function getClient(): Promise<Db> {
  try {
    const client = await MongoClient.connect(process.env.DB_URL, {
      ...clientOptions,
      serverApi: '1',
    })
    const db = client.db(dbName)

    setTimeout(() => {
      client.close()
    }, 5000)

    return db
  } catch (error) {
    console.error('Erro ao obter o cliente:', error)
    throw error
  }
}
