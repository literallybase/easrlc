# easrlc

A Node.js wrapper for the PRC client with 100% API coverage.

## Features
- 100& API Coverage
- Event System
- Rate Limit Handling (Coming Soon...)
- Queuing System (Coming Soon...)

## Installation

Install the package using NPM.

```bash
npm install easrlc
```

## Auth

Login to the client using the initialize function. If needed, you can include a global API key for increased rate limits.

```javascript
const { Client } = require('easrlc');

const client = new Client({
  ServerKey: 'server key',
  GlobalAuth: 'global key', // if needed
});

client
  .initiate()
  .then((server) => {
    console.log(`Connected to ${server.Name}`);
  })
  .catch(console.error);
```

## Events

To start getting events, set the EnableEvents client property to true. Here's a quick example on how to use events.

```javascript
const { Client } = require('easrlc');
require('dotenv').config();

const client = new Client({
  ServerKey: process.env.SERVERKEY,
  EnableEvents: true, // set to true to start emitting events
});

client.on('command', (command) => {
  console.log(
    `${command.Player} ran ${command.Command} at ${command.Timestamp}`
  );
});

client
  .initiate()
  .then((server) => {
    console.log(`Connected to ${server.Name}`);
  })
  .catch(console.error);
```

### Event List
- Bans
- Calls
- Commands
- Errors
- Joins
- Kills