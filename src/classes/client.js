const { config } = require('../easrlc');
const get = require('../functions/get');
const EventEmitter = require('node:events');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * @typedef {Object} ClientConfig
 * @property {string} ServerKey
 * @property {string} [GlobalAuth]
 * @property {boolean} [EnableEvents]
 */

module.exports = class Client extends EventEmitter {
  /**
   * @constructor
   * @param {ClientConfig} options
   */
  constructor(options) {
    assert(
      typeof options === 'object',
      `Client options must be of type object - recieved ${typeof options}`
    );
    const { ServerKey, GlobalAuth = '', EnableEvents = false } = options;

    assert(
      typeof ServerKey === 'string',
      `"ServerKey" must be of type string - recieved ${typeof serverKey}`
    );
    assert(
      typeof GlobalAuth === 'string',
      `"GlobalAuth" must of of type string - recieved ${typeof GlobalAuth}`
    );
    assert(
      typeof EnableEvents === 'boolean',
      `"EnableEvents" must be of type bool - recieved ${typeof enableEvents}`
    );

    super();
    this.serverKey = ServerKey;
    this.globalAuth = GlobalAuth;
    this.enableEvents = EnableEvents;
    this.cache = {
      joins: [],
      kills: [],
      calls: [],
      bans: [],
      commands: [],
    };
  }

  async initiate() {
    config.serverKey = this.serverKey;
    config.globalAuth = this.globalAuth;
    if (this.enableEvents) {
      this._startEventSystem();
    }
    return await get('/server');
  }

  _startEventSystem() {
    this.eventInterval = setInterval(async () => {
      try {
        const [joins, kills, calls, bans, commands] = await Promise.all([
          get('/server/joinlogs'),
          get('/server/killlogs'),
          get('/server/modcalls'),
          get('/server/bans'),
          get('/server/commandlogs'),
        ]);

        this._emitEvents('join', joins, this.cache.joins);
        this._emitEvents('kill', kills, this.cache.kills);
        this._emitEvents('call', calls, this.cache.calls);
        this._emitEvents('ban', bans, this.cache.bans);
        this._emitEvents('command', commands, this.cache.commands);
      } catch (error) {
        this.emit('error', error);
      }
    }, 5000);
  }

  _emitEvents(eventName, newData, cache) {
    newData.forEach((data) => {
      if (
        !cache.some((cached) => JSON.stringify(cached) === JSON.stringify(data))
      ) {
        this.emit(eventName, data);
        cache.push(data);
      }
    });
  }

  _stopEventSystem() {
    if (this.eventInterval) {
      clearInterval(this.eventInterval);
      this.eventInterval = null;
    }
  }
};
