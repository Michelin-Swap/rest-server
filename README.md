install:
yarn
yarn build

run:
yarn start

api:

path: /wasm-transfer
method: post
request: {msg:[{}Wasmtransfer],memo}

curl -X POST "http://localhost:3000/wasm-transfer" -H  "accept: application/json" -H  "Content-Type: application/json" -d \
"{  \"msg\":  [ {\"toAddress\":\"midas1ln3cxx4h4zn0q8e0wrm8xvr0k4u3jqsyueks8d\",\"tokenAddress\":\"midas1wgh6adn8geywx0v78zs9azrqtqdegufuhe9kf7\",\"amount\":\"20\"},{\"toAddress\":\"midas1d776tau32m3h3edcusudjk27d86h3p0s60hwz3\",\"tokenAddress\":\"midas1wgh6adn8geywx0v78zs9azrqtqdegufuhe9kf7\",\"amount\":\"33333\"} ],  \"memo\":\"\" }"

response:
{"result":{}}|{"error:""}


数据结构：
Wasmtransfer: {toAddress:string,tokenAddress:string,amount:string}, // amount= (humanAmount*10**decimails).toString()
