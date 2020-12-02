import {
    GasPrice,
    Secp256k1HdWallet,
    makeCosmoshubPath,
} from '@cosmjs/launchpad';
import {
    SigningCosmWasmClient
} from '@cosmjs/cosmwasm';
import { bech32prefix, httpUrl } from './config';



export const buildWallet = (mnemonic: string, index: number): Promise<Secp256k1HdWallet> => {
    return Secp256k1HdWallet.fromMnemonic(mnemonic, makeCosmoshubPath(index), bech32prefix);
};
export const getSigningCosmWasmClient = async (mnemonic: string, index: number): Promise<{client: SigningCosmWasmClient, address: string}> => {
    const gasPrice = GasPrice.fromString('0umdse');
    const wallet = await buildWallet(mnemonic, index);
    const [{ address }] = await wallet.getAccounts();
    const senderAddress = address;
    const client = new SigningCosmWasmClient(httpUrl, senderAddress, wallet, gasPrice);
    return {client: client, address: address};

};


export const contractTransferLogParser = (log: any) => {

};