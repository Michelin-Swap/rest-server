import { findSequenceForSignedTx } from '@cosmjs/launchpad';
import express = require('express');
import { sign, wasmTransfer } from './services';
import * as fs from 'fs';
import { buildWallet } from './utils';
const app: express.Application = express();
const port = 3000;
const hostname = '0.0.0.0';

app.use(express.json()); // for parsing application/json

app.get('/', (req: any, res: any) => res.send('Hello World!'));
app.post('/sign', async function (req: any, res: any) {
  const msgs = req.body['msg'];
  const key_name = req.body['key_name'];
  const memo = req.body['memo'];
  const account_number = req.body['account_number'];
  const sequence = req.body['sequence'];

  let mnemonic: string;
  try {
    const keystore = fs.readFileSync(`./src/keys/${key_name}.json`, { encoding: 'utf-8' });
    const key = JSON.parse(keystore);
    mnemonic = key.mnemonic;

  } catch (err) {
    res.send(JSON.stringify({ error: err }));
  }

  const signer = await buildWallet(mnemonic, 0);
  const result = await sign(signer, msgs, memo, account_number, sequence);

  res.send(JSON.stringify({ result: result }));
});


app.post('/wasm-transfer', async function (req: any, res: any) {

  const msgs = req.body['msg'];
  const memo = req.body['memo'];
  const result = await wasmTransfer(msgs, memo);
  res.send(JSON.stringify(result));
});

app.listen(port, hostname, () => console.log(`Example app listening on port ${port}!`));
