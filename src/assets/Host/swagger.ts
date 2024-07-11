// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerAutogen = require('swagger-autogen')()

export function generateSwagger() {
  const doc = {
    info: {
      title: 'My API',
      description: 'API Description',
    },
    host: 'localhost:8080',
    schemes: ['http'],
  }

  const outputFile = './swagger_output.json'
  const endpointsFiles = ['./HostExpress.ts']

  swaggerAutogen(outputFile, endpointsFiles, doc)
}
