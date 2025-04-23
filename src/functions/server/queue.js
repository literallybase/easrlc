const get = require('../get');

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await get('/server/queue'));
    } catch (error) {
      reject(error);
    }
  });
};
