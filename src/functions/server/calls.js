const get = require('../get');

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await get('/server/modcalls'));
    } catch (error) {
      reject(error);
    }
  });
};
