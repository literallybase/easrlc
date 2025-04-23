const get = require('../get');

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await get('/server/bans'));
    } catch (error) {
      reject(error);
    }
  });
};
