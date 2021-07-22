const controller = require('./controller');
const schemas = require('./schemas');
const { verifyJwt } = require('../common');

const signUp = {
  path: '/v1/signup',
  method: 'POST',
  config: {
    tags: ['api'],
    handler: controller.signUp,
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: schemas.request.signUp.payload,
    },
    auth: false,
  },
};

const signIn = {
  path: '/v1/signin',
  method: 'POST',
  config: {
    tags: ['api'],
    handler: controller.signIn,
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: schemas.request.signIn.payload,
    },
    auth: false,
  },
};

const findUser = {
  path: '/v1/find/{user_id}',
  method: 'GET',
  config: {
    tags: ['api'],
    pre: [{ method: verifyJwt }],
    handler: controller.findUser,
    validate: {
      options: {
        allowUnknown: true,
      },
      params: schemas.request.findUser.params,
      headers: schemas.request.findUser.headers,
    },
  },
};

module.exports = [
  signUp, signIn, findUser,
];
