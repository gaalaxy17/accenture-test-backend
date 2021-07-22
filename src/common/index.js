const Boom = require('@hapi/boom');

module.exports = {
  buildErrorResponse: (error) => ({
    mensagem: error.message,
  }),
  verifyJwt: (req, res) => {
    if (!req.headers.authorization) throw (Boom.unauthorized('Não autorizado'));

    const [bearer, token] = req.headers.authorization.split(' ');

    if (bearer !== 'Bearer') throw (Boom.badRequest('Missing Bearer'));

    req.headers.authorization = token;

    return res;
  },
};
