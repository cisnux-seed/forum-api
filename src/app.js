require('dotenv').config();
const createServer = require('./Infrastructures/http/createServer');
const container = require('./Infrastructures/container');
const logger = require('./Commons/utils/logger');

(async () => {
  const server = await createServer(container);
  await server.start();
  logger.info(`server start at ${server.info.uri}`);
})();
