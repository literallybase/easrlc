const { config } = require('../easrlc');

module.exports = (endpoint) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fetch = await import('node-fetch');
      const response = await fetch.default(
        `https://api.policeroleplay.community/v1${endpoint}`,
        {
          method: 'GET',
          headers: {
            'Server-Key': config.serverKey,
            Authorization: config.globalAuth,
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        return reject(data);
      }

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};