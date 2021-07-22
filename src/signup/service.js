/* eslint-disable no-underscore-dangle */
const Jwt = require('@hapi/jwt');
const Bcrypt = require('bcrypt');
const Boom = require('@hapi/boom');
const { v4: uuidv4 } = require('uuid');
const { mongoDb } = require('../repository');
const env = require('../enviroment');

const signUp = async ({ payload, onSuccess, onError }) => {
  try {
    const results = await mongoDb.findOneByEmail(payload.email);
    if (results) return onError(Boom.conflict('E-mail já existente'));

    const salt = await Bcrypt.genSalt(10);
    const hashPass = await Bcrypt.hash(payload.senha, salt);

    const userId = uuidv4();

    const token = Jwt.token.generate({
      _id: userId,
      nome: payload.nome,
      email: payload.email,
    }, env.auth.secret, {
      expiresIn: env.auth.tokenExpirationMinutes * 60,
    });

    const hashToken = await Bcrypt.hash(token, salt);

    const now = new Date();

    const user = {
      _id: userId,
      nome: payload.nome,
      email: payload.email,
      senha: hashPass,
      telefones: payload.telefones,
      data_criacao: now,
      data_atualizacao: now,
      ultimo_login: now,
      token: hashToken,
    };

    await mongoDb.insertOne(user);

    user.token = token;

    return onSuccess(user);
  } catch (e) {
    return onError(Boom.boomify(e, { statusCode: 500 }));
  }
};

const signIn = async ({ payload, onSuccess, onError }) => {
  try {
    const results = await mongoDb.findOneByEmail(payload.email);
    if (!results) return onError(Boom.notFound('Usuário e/ou senha inválidos'));

    const match = await Bcrypt.compare(payload.senha, results.senha);
    if (!match) return onError(Boom.unauthorized('Usuário e/ou senha inválidos'));

    const salt = await Bcrypt.genSalt(10);

    const token = Jwt.token.generate({
      _id: results._id,
      nome: payload.nome,
      email: payload.email,
    }, env.auth.secret, {
      expiresIn: env.auth.tokenExpirationMinutes * 60,
    });

    const hashToken = await Bcrypt.hash(token, salt);

    results.ultimo_login = new Date();
    results.token = hashToken;

    await mongoDb.updateTokenAndLastLogin(results);

    results.token = token;

    return onSuccess(results);
  } catch (e) {
    return onError(Boom.boomify(e, { statusCode: 500 }));
  }
};

const findUser = async (
  {
    payload, headers, onSuccess, onError,
  },
) => {
  try {
    const token = headers.authorization;
    const user = await mongoDb.findOne(payload.user_id);

    if (!user) return onError(Boom.notFound('Usuário não encontrado'));

    const match = await Bcrypt.compare(token, user.token);
    if (!match) return onError(Boom.unauthorized('Não autorizado'));

    const now = new Date();

    if (new Date(user.ultimo_login) < new Date(now.getTime() - (30 * 60000))) {
      return onError(Boom.unauthorized('Sessão inválida'));
    }

    return onSuccess(user);
  } catch (e) {
    return onError(Boom.boomify(e, { statusCode: 500 }));
  }
};

module.exports = {
  signUp, signIn, findUser,
};
