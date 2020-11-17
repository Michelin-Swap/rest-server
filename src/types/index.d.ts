export interface MsgWasmTransfer {

    readonly transfer: {
      /** Bech32 account address */
      readonly recipient: string;
      readonly amount: string;

    };
  }

export interface MsgTransfer {
  readonly toAddress:string;
  readonly tokenAddress:string;
  readonly amount:string;
}