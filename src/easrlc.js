exports.config = { serverKey: '', globalAuth: '' };

exports.Client = require('./classes/client');

exports.getBans = require('./functions/server/bans');
exports.getCalls = require('./functions/server/calls');
exports.sendCommand = require('./functions/server/command');
exports.getCommands = require('./functions/server/commands');
exports.getJoins = require('./functions/server/joins');
exports.getKills = require('./functions/server/kills');
exports.getPlayers = require('./functions/server/players');
exports.getQueue = require('./functions/server/queue');
exports.getServer = require('./functions/server/server');
exports.getVehicles = require('./functions/server/vehicles');
