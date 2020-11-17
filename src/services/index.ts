import { MsgExecuteContract } from '@cosmjs/cosmwasm';
import { coins, StdFee } from '@cosmjs/launchpad';
import { MsgTransfer } from '../types';
import { getSigningCosmWasmClient } from '../utils';

export async function signAndBroadcast(msgs: any, memo: string) {
    const {client, address} = await getSigningCosmWasmClient();
    const fee: StdFee = {
        amount: coins(5000000, 'umdse'),
        gas: '90000000',
      };
    const result = await client.signAndBroadcast(msgs, fee, memo);
    return result;

}

export async function wasmTransfer(wasmMsgs: MsgTransfer[], memo: string) {
   const msgs = [];
   const {client, address} = await getSigningCosmWasmClient();
   const myAddress = address;

    for (let i = 0; i < wasmMsgs.length; i++) {
      const wasmMsg = wasmMsgs[i];
      const msg: MsgExecuteContract = {
          type: 'wasm/MsgExecuteContract',
          value: {
              sender: myAddress,
              contract: wasmMsg.tokenAddress,
              msg: {transfer: { recipient: wasmMsg.toAddress, amount: wasmMsg.amount} },
              sent_funds: [],
          }
      };
      msgs.push(msg);

    }

    const fee: StdFee = {
      amount: coins(5000000, 'umdse'),
      gas: '90000000',
    };
    try {
      const result = await client.signAndBroadcast(msgs, fee, memo);
      return {'result': result};
    } catch (e) {
      return {'error': e.message};
    }


}