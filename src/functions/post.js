const { config } = require('../easrlc');

module.exports = (endpoint, body) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fetch = await import('node-fetch');
      const response = await fetch.default(
        `https://api.policeroleplay.community/v1${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Server-Key': config.serverKey,
            Authorization: config.globalAuth,
            'Content-Type': 'application/json',
          },
          body: body,
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