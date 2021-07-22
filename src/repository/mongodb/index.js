/* eslint-disable no-underscore-dangle */
const { MongoClient } = require('mongodb');
const env = require('../../enviroment');

const client = new MongoClient(env.db.url);

const insertOne = async (payload) => {
  try {
    await client.connect();

    const database = client.db(env.db.db_name);
    const collection = database.collection(env.db.collection);

    return await collection.insertOne(payload);
  } finally {
    await client.close();
  }
};

const findOneByEmail = async (email) => {
  try {
    await client.connect();

    const database = client.db(env.db.db_name);
    const collection = database.collection(env.db.collection);

    return await collection.findOne({ email: { $eq: email } });
  } finally {
    await client.close();
  }
};

const findOne = async (id) => {
  try {
    await client.connect();

    const database = client.db(env.db.db_name);
    const collection = database.collection(env.db.collection);

    return await collection.findOne({ _id: { $eq: id } });
  } finally {
    await client.close();
  }
};

const updateTokenAndLastLogin = async (payload) => {
  try {
    await client.connect();

    const database = client.db(env.db.db_name);
    const collection = database.collection(env.db.collection);

    return await collection.updateOne(
      { _id: { $eq: payload._id } },
      { $set: { ultimo_login: payload.ultimo_login, token: payload.token } },
    );
  } finally {
    await client.close();
  }
};

module.exports = {
  insertOne, findOneByEmail, updateTokenAndLastLogin, findOne,
};
