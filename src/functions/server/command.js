const post = require('../post');

module.exports = (command) => {
  return new Promise(async (resolve, reject) => {
    try {
      const body = JSON.stringify({ command: `${command}` });
      resolve(await post('/server/command', body));
    } catch (error) {
      reject(error);
    }
  });
};
