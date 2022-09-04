/* istanbul ignore file */
const pinoLogger = require('pino');

module.exports = pinoLogger(
  {
    level: process.env.NODE_ENV === 'test' ? 'debug' : 'info',
    formatters: {
      level: (label) => ({ level: label }),
    },
  },
);
