import swaggerDocument from './swagger.json' assert { type: "json" };
import * as swaggerUi from 'swagger-ui-express';

const swagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}

export default swagger;