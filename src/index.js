const { server } = require('./server');

const initServer = async () => {
  const sv = await server;
  try {
    await sv.start();

    console.log(`Server running on ${sv.info.uri}`);
  } catch (e) {
    console.log(`Error ${e.message}`);
  }
};

initServer();
