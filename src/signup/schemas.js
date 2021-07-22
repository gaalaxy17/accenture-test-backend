const Joi = require('joi');

module.exports = {
  request: {
    signUp: {
      payload: Joi.object({
        nome: Joi.string().required(),
        email: Joi.string().required(),
        senha: Joi.string().required(),
        telefones: Joi.array().items(Joi.object({
          numero: Joi.string().required(),
          ddd: Joi.string().required(),
        })).required(),
      }),
    },
    signIn: {
      payload: Joi.object({
        email: Joi.string().required(),
        senha: Joi.string().required(),
      }),
    },
    findUser: {
      headers: Joi.object({
        authorization: Joi.string().required(),
      }),
      params: Joi.object({
        user_id: Joi.string().required(),
      }),
    },
  },
};
