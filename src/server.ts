import express = require('express');
import { wasmTransfer } from './services';
const app: express.Application = express();
const port = 3000;
const hostname = '0.0.0.0';

app.use(express.json()); // for parsing application/json

app.get('/', (req: any, res: any) => res.send('Hello World!'));
app.post('/wasm-transfer', async function (req: any, res: any) {

    const msgs = req.body['msg'];
    const memo = req.body['memo'];
    const result = await wasmTransfer(msgs, memo);
    res.send(JSON.stringify(result));
  });

app.listen(port, hostname, () => console.log(`Example app listening on port ${port}!`));
