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
            'Content-Type': 'application/json',
          },
          body: body,
        }
      );

      const rateLimitHeaders = {
        limit: response.headers.get('x-ratelimit-limit'),
        remaining: response.headers.get('x-ratelimit-remaining'),
        reset: response.headers.get('x-ratelimit-reset'),
      };

      const data = await response.json().catch((err) => {
        return reject(err);
      });

      if (!response.ok) {
        console.log('not ok')
        reject(data);
      }

      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
