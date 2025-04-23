const { config } = require('../easrlc');

module.exports = function (endpoint, body) {
  return new Promise(async (resolve, reject) => {
    try {
      const fetch = await import('node-fetch');
      const response = await fetch.default(
        `https://api.policeroleplay.community/v1${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Server-Key': config.serverKey,
          },
          body: body,
        }
      );

      const data = await response.json().catch((err) => {
        return reject(err);
      });

      if (!response.ok) {
        reject(data);
      }

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
