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


export interface EventTokenTransfer{
  readonly txHash:string;
  readonly height:string;
  readonly timestamp:string;
  readonly index:number;
  readonly from:string;
  readonly to:string;
  readonly contractAddress:string;

}
export interface TokenTransfer {
  readonly index:number;
  readonly from:string;
  readonly to:string;
  readonly contractAddress:string;
}

export interface TxLog {
  readonly msg_index:number;
  log:string;
  events:LogEvent[]
}

interface LogEvent {
  readonly type:string;
  readonly attributes:EventAttribute[]
}

interface EventAttribute {
  key:string;
  value:string;
}