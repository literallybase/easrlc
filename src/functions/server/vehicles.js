const get = require('../get');

module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await get('/server/vehicles'));
    } catch (error) {
      reject(error);
    }
  });
};
