const Hapi = require('@hapi/hapi');
const Joi = require('joi');
const Jwt = require('@hapi/jwt');
const plugins = require('./plugins');
const env = require('./enviroment');

const signUpRoutes = require('./signup/routes');

const init = async () => {
  const server = Hapi.server({
    port: env.server.port || 3000,
    host: env.server.host || 'localhost',
  });

  await server.register(Jwt);

  server.auth.strategy('default_strategy', 'jwt', {
    keys: env.auth.secret,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: env.auth.tokenExpirationMinutes * 60,
      timeSkewSec: 15,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: { user: artifacts.decoded.payload.user },
    }),
  });

  server.auth.default('default_strategy');

  server.route(signUpRoutes);

  await server.register(plugins);

  server.validator(Joi);

  return server;
};

module.exports = {
  server: init(),
};
