# easrlc

A Node.js wrapper for the PRC client with 100% API coverage.

## Installation

First things first, you need to install the package.

```bash
npm install easrlc
```

### Usage

Using the package is very easy. Just require/import the package and initialize the client with your server key! An example in Javascript and Typescript will be shown below.

```javascript
// index.js
const easrlc = require('easrlc');
require('dotenv').config();

new easrlc.Client(process.env.SERVERKEY).initiate();

easrlc
  .getServer()
  .then((server) => {
    console.log(server);
  })
  .catch(console.error);
```

```typescript
// index.ts
import easrlc from 'easrlc';
import { config } from 'dotenv';
config();

new easrlc.Client(process.env.SERVERKEY as string).initiate();

easrlc
  .getServer()
  .then((server) => {
    console.log(server);
  })
  .catch(console.error);
```