/* eslint-disable no-underscore-dangle */
const Boom = require('@hapi/boom');
const { expect } = require('chai');
const { describe, it, afterEach } = require('mocha');
const sinon = require('sinon');
const Bcrypt = require('bcrypt');

const { signUp, signIn, findUser } = require('../signup/service');
const { mongoDb } = require('../repository');
const { users, payloads, headers } = require('../testModel');

describe('signUp()', () => {
  it('should return an error if an email already exists in the db', async () => {
    sinon.stub(mongoDb, 'insertOne').returns(Promise.resolve(undefined));
    sinon.stub(mongoDb, 'findOneByEmail').returns(Promise.resolve(users.defaultUser));

    let successResult;
    let errorResult;
    await signUp({
      payload: payloads.defaultPayload,
      onSuccess: (results) => {
        successResult = results;
      },
      onError: (err) => {
        errorResult = err;
      },
    });

    expect(successResult).to.equals(undefined);

    expect(Boom.isBoom(errorResult)).to.equal(true);
    expect(errorResult.output.statusCode).to.equal(409);
    expect(errorResult.output.payload.message).to.equal('E-mail já existente');
  });
  it('should save and return the model if email doesnt exist', async () => {
    sinon.stub(mongoDb, 'insertOne').returns(Promise.resolve(undefined));
    sinon.stub(mongoDb, 'findOneByEmail').returns(Promise.resolve(undefined));

    let successResult;
    let errorResult;

    await signUp({
      payload: payloads.differentUserPayload,
      onSuccess: (res) => {
        successResult = res;
      },
      onError: (err) => {
        errorResult = err;
      },
    });
    expect(errorResult).to.equals(undefined);

    expect(successResult).to.have.keys(['_id', 'nome', 'email', 'senha', 'telefones', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token']);
    expect(successResult.telefones).to.be.an('array');
  });
});

describe('signIn()', () => {
  it('should return an error if user not found', async () => {
    sinon.stub(mongoDb, 'updateTokenAndLastLogin').returns(Promise.resolve(undefined));
    sinon.stub(mongoDb, 'findOneByEmail').returns(Promise.resolve(undefined));

    let successResult;
    let errorResult;

    await signIn({
      payload: payloads.notRegisteredUser,
      onSuccess: (res) => {
        successResult = res;
      },
      onError: (err) => {
        errorResult = err;
      },
    });

    expect(successResult).to.equals(undefined);

    expect(Boom.isBoom(errorResult)).to.equal(true);
    expect(errorResult.output.statusCode).to.equal(404);
    expect(errorResult.output.payload.message).to.equal('Usuário e/ou senha inválidos');
  });
  it('should return an error if user was found but pass doesnt match', async () => {
    sinon.stub(mongoDb, 'updateTokenAndLastLogin').returns(Promise.resolve(undefined));
    sinon.stub(mongoDb, 'findOneByEmail').returns(Promise.resolve(users.defaultUser));
    sinon.stub(Bcrypt, 'compare').returns(Promise.resolve(false));
    let successResult;
    let errorResult;

    await signIn({
      payload: payloads.signInPayload,
      onSuccess: (res) => {
        successResult = res;
      },
      onError: (err) => {
        errorResult = err;
      },
    });

    expect(successResult).to.equals(undefined);

    expect(Boom.isBoom(errorResult)).to.equal(true);
    expect(errorResult.output.statusCode).to.equal(401);
    expect(errorResult.output.payload.message).to.equal('Usuário e/ou senha inválidos');
  });
  it('should return the model if user exists', async () => {
    sinon.stub(mongoDb, 'updateTokenAndLastLogin').returns(Promise.resolve(undefined));
    sinon.stub(mongoDb, 'findOneByEmail').returns(Promise.resolve(users.defaultUser));
    sinon.stub(Bcrypt, 'compare').returns(Promise.resolve(true));

    let successResult;
    let errorResult;

    await signIn({
      payload: payloads.signInPayload,
      onSuccess: (res) => {
        successResult = res;
      },
      onError: (err) => {
        errorResult = err;
      },
    });
    expect(errorResult).to.equals(undefined);

    expect(successResult).to.have.keys(['_id', 'nome', 'email', 'senha', 'telefones', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token']);
    expect(successResult.telefones).to.be.an('array');
  });
});

describe('findUser()', () => {
  it('should return error if user not found', async () => {
    sinon.stub(mongoDb, 'findOne').returns(Promise.resolve(undefined));
    let successResult;
    let errorResult;

    await findUser({
      payload: payloads.findUserPayload,
      headers: headers.authorizationHeader,
      onSuccess: (res) => {
        successResult = res;
      },
      onError: (err) => {
        errorResult = err;
      },
    });
    expect(successResult).to.equals(undefined);

    expect(Boom.isBoom(errorResult)).to.equal(true);
    expect(errorResult.output.statusCode).to.equal(404);
    expect(errorResult.output.payload.message).to.equal('Usuário não encontrado');
  });
  it('should return error if token is invalid', async () => {
    let successResult;
    let errorResult;

    sinon.stub(mongoDb, 'findOne').returns(Promise.resolve(users.defaultUser));
    sinon.stub(Bcrypt, 'compare').returns(Promise.resolve(false));

    await findUser({
      payload: payloads.findUserPayload,
      headers: headers.authorizationHeader,
      onSuccess: (res) => {
        successResult = res;
      },
      onError: (err) => {
        errorResult = err;
      },
    });
    expect(successResult).to.equals(undefined);

    expect(Boom.isBoom(errorResult)).to.equal(true);
    expect(errorResult.output.statusCode).to.equal(401);
    expect(errorResult.output.payload.message).to.equal('Não autorizado');
  });
  it('should return error if session is expired', async () => {
    let successResult;
    let errorResult;

    sinon.stub(mongoDb, 'findOne').returns(Promise.resolve(users.expiredDateUser));
    sinon.stub(Bcrypt, 'compare').returns(Promise.resolve(true));

    await findUser({
      payload: payloads.findUserPayload,
      headers: headers.authorizationHeader,
      onSuccess: (res) => {
        successResult = res;
      },
      onError: (err) => {
        errorResult = err;
      },
    });
    expect(successResult).to.equals(undefined);

    expect(Boom.isBoom(errorResult)).to.equal(true);
    expect(errorResult.output.statusCode).to.equal(401);
    expect(errorResult.output.payload.message).to.equal('Sessão inválida');
  });
  it('should return the model if user exists, token is valid and session is not expired', async () => {
    let successResult;
    let errorResult;

    sinon.stub(mongoDb, 'findOne').returns(Promise.resolve(users.defaultUser));
    sinon.stub(Bcrypt, 'compare').returns(Promise.resolve(true));

    await findUser({
      payload: payloads.findUserPayload,
      headers: headers.authorizationHeader,
      onSuccess: (res) => {
        successResult = res;
      },
      onError: (err) => {
        errorResult = err;
      },
    });
    expect(errorResult).to.equals(undefined);

    expect(successResult).to.have.keys(['_id', 'nome', 'email', 'senha', 'telefones', 'data_criacao', 'data_atualizacao', 'ultimo_login', 'token']);
    expect(successResult.telefones).to.be.an('array');
  });
});

afterEach(() => {
  sinon.restore();
});
