import * as fs from 'fs';
import { CosmWasmClient, MsgExecuteContract, SigningCosmWasmClient } from '@cosmjs/cosmwasm';
import { BroadcastMode, coins, isBroadcastTxFailure, isBroadcastTxSuccess, LcdClient, makeSignDoc, makeStdTx, OfflineSigner, StdFee } from '@cosmjs/launchpad';
import { chainId, mnemonic, httpUrl } from '../config';
import { MsgTransfer } from '../types';
import { getSigningCosmWasmClient } from '../utils';
import { createInterfaceDeclaration } from 'typescript';

export async function signAndBroadcast(msgs: any, memo: string, client: SigningCosmWasmClient) {

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

export async function wasmTransfer(wasmMsgs: MsgTransfer[], memo: string, client: SigningCosmWasmClient, sendAddress: string) {
   const msgs = [];

    for (let i = 0; i < wasmMsgs.length; i++) {
      const wasmMsg = wasmMsgs[i];
      const msg: MsgExecuteContract = {
          type: 'wasm/MsgExecuteContract',
          value: {
              sender: sendAddress,
              contract: wasmMsg.tokenAddress,
              msg: {transfer: { recipient: wasmMsg.toAddress, amount: wasmMsg.amount} },
              sent_funds: [],
          }
      };
      msgs.push(msg);

    }


    const fee: StdFee = {
      amount: coins(0, 'umdse'),
      gas: '200000',
    };
    try {
      const result = await client.signAndBroadcast(msgs, fee, memo);
     if (isBroadcastTxSuccess(result)) {
      return {'result': {transactionHash: result.transactionHash}};
     }
     if (isBroadcastTxFailure(result)) {
       return {'error': result};
     }

    } catch (e) {
      return {'error': e.message};
    }


}


export  async function get_mnemonic(key_name: string): Promise<string> {
  const keystore = fs.readFileSync(`./src/keys/${key_name}.json`, { encoding: 'utf-8' });
  const key = JSON.parse(keystore);
  const mnemonic = key.mnemonic;
  return mnemonic;
}


export async function get_cw_balance(contractAddress: string, address: string ) {
  const client = new CosmWasmClient(httpUrl, BroadcastMode.Block);
  const queryMsg = { balance: { address: address } };

  const balanceMsg = await client.queryContractSmart(contractAddress, queryMsg);

  return balanceMsg;

}

export async function get_transaction(transction: string) {
  const client = new LcdClient(httpUrl, BroadcastMode.Block);
   const txsResponse = await client.txById(transction);

  return txsResponse;
}