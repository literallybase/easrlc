const { config } = require('../easrlc');
const get = require('../functions/get');
const EventEmitter = require('node:events');
const fs = require('fs');
const path = require('path');

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
      `Client options must be of type object - received ${typeof options}`
    );
    const { ServerKey, GlobalAuth = '', EnableEvents = false } = options;

    assert(
      typeof ServerKey === 'string',
      `"ServerKey" must be of type string - received ${typeof ServerKey}`
    );
    assert(
      typeof GlobalAuth === 'string',
      `"GlobalAuth" must be of type string - received ${typeof GlobalAuth}`
    );
    assert(
      typeof EnableEvents === 'boolean',
      `"EnableEvents" must be of type bool - received ${typeof EnableEvents}`
    );

    super();
    this.serverKey = ServerKey;
    this.globalAuth = GlobalAuth;
    this.enableEvents = EnableEvents;
    this.cache = this._readCache();
  }

  async initiate() {
    config.serverKey = this.serverKey;
    config.globalAuth = this.globalAuth;
    if (this.enableEvents) {
      this._startEventSystem();
    }
    return await get('/server');
  }

  _readCache() {
    try {
      const cachePath = path.resolve(__dirname, '../../cache.json');
      if (fs.existsSync(cachePath)) {
        const data = fs.readFileSync(cachePath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      this.emit('error', new Error(`Failed to read cache: ${error.message}`));
    }
    return {
      joins: [],
      kills: [],
      calls: [],
      bans: [],
      commands: [],
    };
  }

  _writeCache(cache) {
    try {
      const cachePath = path.resolve(__dirname, '../../cache.json');
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
    } catch (error) {
      this.emit('error', new Error(`Failed to write cache: ${error.message}`));
    }
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

        this._emitEvents('join', joins, 'joins');
        this._emitEvents('kill', kills, 'kills');
        this._emitEvents('call', calls, 'calls');
        this._emitEvents('ban', bans, 'bans');
        this._emitEvents('command', commands, 'commands');
      } catch (error) {
        this.emit('error', error);
      }
    }, 5000);

    this.cacheClearInterval = setInterval(() => {
      this.cache = {
        joins: [],
        kills: [],
        calls: [],
        bans: [],
        commands: [],
      };
      this._writeCache(this.cache);
      this.emit('info', 'Cache cleared');
    }, 1000 * 60 * 60);
  }

  _emitEvents(eventName, newData, cacheKey) {
    if (!Array.isArray(newData)) {
      if (newData && typeof newData === 'object') {
        newData = [newData];
      } else {
        this.emit(
          'error',
          new Error(
            `Expected an array for ${eventName}, but received: ${typeof newData}`
          )
        );
        return;
      }
    }

    const cache = this._readCache();
    const currentCache = cache[cacheKey] || [];

    newData.forEach((data) => {
      if (
        !currentCache.some(
          (cached) => JSON.stringify(cached) === JSON.stringify(data)
        )
      ) {
        this.emit(eventName, data);
        currentCache.push(data);
      }
    });

    cache[cacheKey] = currentCache;
    this._writeCache(cache);
  }

  _stopEventSystem() {
    if (this.eventInterval) {
      clearInterval(this.eventInterval);
      this.eventInterval = null;
    }
    if (this.cacheClearInterval) {
      clearInterval(this.cacheClearInterval);
      this.cacheClearInterval = null;
    }
  }
};
