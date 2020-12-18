**环境**  
ubuntu，nodejs

**安装**
1. 在代码目录下运行命令： yarn  
2. 修改 config.tx 中的httpUrl 成 你要要连接的 rest-server。 rest-server 启动见 节点搭建文件夹。

**运行**  
   yarn build && yarn start  

**api:**

**1. 生成新地址**

根据输入的钱包,key_name 对应的是 keys/${key_name}.json 里的助记词，生产对应{index} 的地址。。钱包地址按照bip32,bip39,bip44来生产的。

path: /new-address    
method: post  
request: {key_name:string,index:0}   // in body
response:
{"result":string|{"error":object}  //成功返回 result,值是地址; 失败返回 error 

    curl -X POST "http://localhost:3000/new-address" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{  \"key_name\":  \"default\",\"index\":0 }"




**2. 代币发送**  
path: /wasm-transfer/:key_name/:index
method: post
request body: {msg:[{}Wasmtransfer],memo,fromAddress:string,index:number}     

    curl -X POST "http://localhost:3000/wasm-transfer/default/0" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{  \"msg\":  [ {\"toAddress\":\"midas1ln3cxx4h4zn0q8e0wrm8xvr0k4u3jqsyueks8d\",\"tokenAddress\":\"midas18vd8fpwxzck93qlwghaj6arh4p7c5n895h5ptt\",\"amount\":\"20\"},{\"toAddress\":\"midas1d776tau32m3h3edcusudjk27d86h3p0s60hwz3\",\"tokenAddress\":\"midas18vd8fpwxzck93qlwghaj6arh4p7c5n895h5ptt\",\"amount\":\"33333\"} ], \"fromAddress\":\"midas1jp2flp47zz54pddjyxvpz9kj6jnthu5mw27j9w\", \"memo\":\"\"}"

response:
{"result":{}}|{"error:{}}


**数据结构：**
Wasmtransfer: {toAddress:string,tokenAddress:string,amount:string}, // amount= (humanAmount*10**decimals).toString() 


toAddress:收款地址 
tokenAddress: 代币的合约地址 
amount :  发送代币的数量，(humanAmount*10**decimals).toString()

result:{ } 
error: {"height":number,"transactionHash":string,"code":number!=0 }

msg说明：转一笔就是msg里只有一个Wasmtransfer，多笔就是msg里有个个Wasmtransfer。 一个事务里含有多笔交易，hash一个，使用idnex区别开来。



**3. 签名**  
path: /sign/:key_name  

request: {"msg":[object], "memo":string,"account_number":string, "sequence":string}   //in body

    curl -X POST "http://localhost:3000/sign" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{  \"msg\": [{\"type\":\"wasm/MsgExecuteContract\",\"value\":{\"sender\":\"midas1jp2flp47zz54pddjyxvpz9kj6jnthu5mw27j9w\",   \"contract\":\"midas1wgh6adn8geywx0v78zs9azrqtqdegufuhe9kf7\",\"msg\":{\"transfer\":{\"recipient\":\"midas1ln3cxx4h4zn0q8e0wrm8xvr0k4u3jqsyueks8d\",\"amount\":\"20\"}},\"sent_funds\":[]}},{\"type\":\"wasm/MsgExecuteContract\",\"value\":{\"sender\":\"midas1jp2flp47zz54pddjyxvpz9kj6jnthu5mw27j9w\",\"contract\":\"midas1wgh6adn8geywx0v78zs9azrqtqdegufuhe9kf7\",\"msg\":{\"transfer\":{\"recipient\":\"midas1d776tau32m3h3edcusudjk27d86h3p0s60hwz3\",\"amount\":\"33333\"}},\"sent_funds\":[]}}] ,  \"key_name\":\"default\",\"account_number\":\"9\",\"sequence\":\"12058\" }"




path: /sign 

request: {"msg":[object], "memo":string,"mnemonic":string,"account_number":string, "sequence":string}   //in body

    curl -X POST "http://localhost:3000/sign" -H  "accept: application/json" -H  "Content-Type: application/json" -d "{  \"msg\": [{\"type\":\"wasm/MsgExecuteContract\",\"value\":{\"sender\":\"midas1jp2flp47zz54pddjyxvpz9kj6jnthu5mw27j9w\",   \"contract\":\"midas1wgh6adn8geywx0v78zs9azrqtqdegufuhe9kf7\",\"msg\":{\"transfer\":{\"recipient\":\"midas1ln3cxx4h4zn0q8e0wrm8xvr0k4u3jqsyueks8d\",\"amount\":\"20\"}},\"sent_funds\":[]}},{\"type\":\"wasm/MsgExecuteContract\",\"value\":{\"sender\":\"midas1jp2flp47zz54pddjyxvpz9kj6jnthu5mw27j9w\",\"contract\":\"midas1wgh6adn8geywx0v78zs9azrqtqdegufuhe9kf7\",\"msg\":{\"transfer\":{\"recipient\":\"midas1d776tau32m3h3edcusudjk27d86h3p0s60hwz3\",\"amount\":\"33333\"}},\"sent_funds\":[]}}] ,  \"mnemonic\":\"dynamic forest govern fault woman beef culture canal deny citizen heavy silly option march junior bicycle truth tumble cheese total luxury this glare saddle\",\"account_number\":\"9\",\"sequence\":\"12058\" }"







**4. 代币转账事件查询**
path: /wasm-transfer-event
method:get
request params: 
contract_address:string  //代币合约的地址,require
from_address:string   //发送地址
to_address:string    //接收地址
min_height:string    //开始区块
max_height:string   //结束区块
page:int             //第几页,default:1
limit:int           //每页记录数,default:10

response:
{"total_count":"14979","count":"30","page_number":"1","page_total":"500","limit":"30","items":[transfer]]}

transfer：  //转账记录
{
    height: 区块高度,
    txHash: 事务hash
    index: 序号，一个事务里多笔转账，从0开始标识，表示在该事务里第几笔转账
    contract: 代币的合约地址
    romAddress: 发送地址
    toAddress: 接收地址
    amount: 发送数量
}


    curl -X GET "http://localhost:3000/wasm-transfer-event?contract_address=midas1zwr262fppwh9kg35v8sfffec00xt6hxg3esztz" -H  "accept: application/json" -H  "Content-Type: application/json"  


**5. 余额查询**  
path: /wasm-balance/:contract/:address  
method: get  

contrct: 代币合约地址  
address： 要查询余额的地址  

**6. 事务查询**  
path: /txs/:transactionHash  
method:get  

respsone:  {  
  readonly height: string;  
  readonly txhash: string;  
  /** 🤷‍♂️ */  
  readonly codespace?: string;  
  /** Falsy when transaction execution succeeded. Contains error code on error. */  
  readonly code?: number;  
  readonly raw_log: string;  
  readonly logs?: unknown[];  
  readonly tx: WrappedStdTx;  
  /** The gas limit as set by the user */  
  readonly gas_wanted?: string;  
  /** The gas used by the execution */  
  readonly gas_used?: string;  
  readonly timestamp: string;  
}  

成功：返回数据结构里，如果code存在并 code >0 ,代表事务执行失败。    
失败：code==0 代表事务成功，一般成功返回结构体里不含code字段。  

**补充说明：**
**1.节点搭建：**
见节点文件夹的readme.md

这个服务连接的是节点的 rest-server 的 api 。更多api 请你参考 cosmos restful api：
https://cosmos.network/rpc/


**2. 接口使用方法：**  
1.  给每个用户生成一个充值地址;使用 生成新地址 接口， 利用bip44,bip32,bip39特性， 用一个助记词管理N个钱包地址;通过 index增长获取第n个地址。  
2.  充值监听，可通过 代币转账事件查询 接口， 定时扫描 指定 条件 {区块（min_height，max_height），代币（ contract_address ） 和 （收款地址）to_address} 获取转账到 to_address 地址的交易记录。    
3.  提现， 通过 代币发送 接口给用户提现。   

4. 在 keys 目录下添加多个助记词文件，每个文件对一个助记词钱包，供不同功能使用。

cac代币合约地址：midas1zwr262fppwh9kg35v8sfffec00xt6hxg3esztz 


