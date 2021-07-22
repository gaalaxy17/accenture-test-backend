const hapiSwaggered = require('hapi-swaggered');
const hapiSwaggeredUi = require('hapi-swaggered-ui');
const inert = require('inert');
const vision = require('vision');

module.exports = [
  inert,
  vision,
  {
    plugin: hapiSwaggered,
    options: {
      auth: false,
      stripPrefix: '/v1',
      info: {
        title: 'API',
        description: 'Accenture Backend Test',
        version: '1.0.0',
      },
    },
  },
  {
    plugin: hapiSwaggeredUi,
    options: {
      auth: false,
      title: 'Swagger UI',
      path: '/docs',
      swaggerOptions: {
        validatorUrl: null,
      },
    },
  },
];
