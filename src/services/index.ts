import { MsgExecuteContract } from '@cosmjs/cosmwasm';
import { coins, makeSignDoc, makeStdTx, OfflineSigner, StdFee } from '@cosmjs/launchpad';
import { chainId } from '../config';
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

export async function sign(signer: OfflineSigner, msgs: any, memo: string, account_number: string|number, sequence: string|number) {
  const [{ address: myAddress }] = await signer.getAccounts();
  const fee: StdFee = {
    amount: coins(5000000, 'umdse'),
    gas: '89000000',
  };
  const signDoc = makeSignDoc(msgs, fee, chainId, memo, account_number, sequence);

  const { signed, signature } = await signer.sign(myAddress, signDoc);
  const signedTx = makeStdTx(signed, signature);
  return signedTx;
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