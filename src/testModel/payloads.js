module.exports = {
  defaultPayload: {
    nome: 'Igor Iwashita',
    email: 'igoriwashita@gmail.com',
    senha: '1234',
    telefones: [
      {
        numero: '987342319',
        ddd: '11',
      },
    ],
  },
  signInPayload: {
    email: 'igoriwashita@gmail.com',
    senha: '1224',
  },
  notRegisteredUser: {
    email: 'oliveiraigorr@hotmail.com',
    senha: '1234',
  },
  differentUserPayload: {
    nome: 'Teste',
    email: 'anotheremail@gmail.com',
    senha: '1234',
    telefones: [
      {
        numero: '987342319',
        ddd: '11',
      },
    ],
  },
  findUserPayload: {
    user_id: 'a067dabe-6bf9-4c92-8f83-707717e164de',
  },
};
