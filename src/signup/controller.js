const service = require('./service');
const common = require('../common');

const signUp = (request, response) => service.signUp({
  payload: request.payload,
  onSuccess: (data) => response.response(data).code(200),
  onError: (error) => response.response(common.buildErrorResponse(error))
    .code(error.output.statusCode),
});

const signIn = (request, response) => service.signIn({
  payload: request.payload,
  onSuccess: (data) => response.response(data).code(200),
  onError: (error) => response.response(common.buildErrorResponse(error))
    .code(error.output.statusCode),
});

const findUser = (request, response) => service.findUser({
  payload: request.params,
  headers: request.headers,
  onSuccess: (data) => response.response(data).code(200),
  onError: (error) => response.response(common.buildErrorResponse(error))
    .code(error.output.statusCode),
});

module.exports = {
  signUp, signIn, findUser,
};
