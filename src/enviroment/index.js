require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT,
    host: process.env.HOST,
  },
  db: {
    url: process.env.DB_URL,
    db_name: process.env.DB_NAME,
    collection: process.env.COLLECTION_NAME,
  },
  auth: {
    tokenExpirationMinutes: parseInt(process.env.TOKEN_EXPIRATION_MINUTES, 10),
    secret: process.env.SECRET,
  },
};
