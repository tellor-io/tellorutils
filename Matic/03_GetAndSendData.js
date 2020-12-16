/**************************Ethereum Auto data push to Matic********************************************/

//                       TellorSender  getCurrentValueAndSend                  //

/******************************************************************************************/

// node Matic/03_GetAndSendData.js network
require('dotenv').config()
const ethers = require('ethers');
const fetch = require('node-fetch-polyfill')
const path = require("path")
const loadJsonFile = require('load-json-file')

var _UTCtime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
var gas_limit = 400000

console.log(_UTCtime)
console.log('https://www.etherchain.org/api/gasPriceOracle')
console.log('network',process.argv[2])

function sleep_s(secs) {
    secs = (+new Date) + secs * 1000;
    while ((+new Date) < secs);
}

//https://ethgasstation.info/json/ethgasAPI.json
//https://www.etherchain.org/api/gasPriceOracle
async function fetchGasPrice() {
    const URL = `https://www.etherchain.org/api/gasPriceOracle`;
    try {
        const fetchResult = fetch(URL);
        const response = await fetchResult;
        const jsonData = await response.json();
        const gasPriceNow = await jsonData.fast * 1;
        const gasPriceNow2 = await (gasPriceNow) * 1000000000;
        return (gasPriceNow2);
    } catch (e) {
        throw Error(e);
    }
}


var requestIds = [1,2,31,50]

let run = async function (net) {
    try {
        if (net == "mainnet") {
            var network = "mainnet"
            var etherscanUrl = "https://etherscan.io"
            var tellorSenderAddress = '0xb9516057dc40c92f91b6ebb2e3d04288cd0446f1'
            var pubAddr = process.env.ETH_PUB
            var privKey = process.env.ETH_PK
        } else if (net == "goerli") {
            var network = "goerli"
            var etherscanUrl = "https://goeli.etherscan.io"
            var tellorSenderAddress = '0x050514e7d074F670758114AaCcE776943A95E105'
            var pubAddr = process.env.RINKEBY_ETH_PUB
            var privKey = process.env.RINKEBY_ETH_PK
            
        } else {
            "network not defined"
        }
        var infuraKey = process.env.INFURA_TOKEN
        console.log("infuraKey", infuraKey)
        console.log("Tellor Address: ", tellorSenderAddress)
        console.log("nework", network)
    } catch (error) {
        console.error(error)
        console.log("network error or environment not defined")
        process.exit(1)
    }



    try {
        var gasP = await fetchGasPrice()
        console.log("gasP1", gasP)
    } catch (error) {
        console.error(error)
        console.log("no gas price fetched")
        process.exit(1)
    }

    try {
        var provider = ethers.getDefaultProvider(network, infuraKey)
        let wallet = new ethers.Wallet(privKey, provider)
        var abi = await loadJsonFile(path.join("abi", "abiTellorSender.json"))
        let contract = new ethers.Contract(tellorSenderAddress, abi, provider)
        var contractWithSigner = contract.connect(wallet)

    } catch (error) {
        console.error(error)
        console.log("oracle not instantiated")
        process.exit(1)
    }


    var k = requestIds.length;
    for (i=0; i<k; i++){

        try {
            var balNow = ethers.utils.formatEther(await provider.getBalance(pubAddr))
            console.log("Requester Address", pubAddr)
            console.log("Requester ETH Balance", balNow)
            var txestimate = (gasP * gas_limit / 1e18);
        } catch (error) {
            console.error(error)
            process.exit(1)
        }

    
        if (gasP != 0 && txestimate < balNow)  {
            console.log("Send data or tip to Tellor")
            try{
    
                let req
                let timestamp
                let rdat
                let rdat1
   
                req = requestIds[i]
                timestamp = ( (Date.now() /1000)| 0 ) + 3600
                console.log("timestamp", timestamp)
                var tx = await contractWithSigner.getCurrentValueAndSend(req, { from: pubAddr, gasLimit: gas_limit, gasPrice: gasP })
                var link = "".concat(etherscanUrl, '/tx/', tx.hash)
                var ownerlink = "".concat(etherscanUrl, '/address/', tellorSenderAddress)
                console.log('Yes, price data was sent for request ID: ', req , " to Matic")
                console.log("Hash link: ", link)
                console.log("Contract link: ", ownerlink)
                console.log('Waiting for the transaction to be mined')
                await tx.wait() // If there's an out of gas error the second parameter is the receipt.

            } catch(error){
                console.error(error);
                console.log("data not sent for request id: ", req);
                process.exit(1)
            }
        } else{
            console.log("not enough balance");
        }
    
    }
    
    process.exit()
}

run(process.argv[2])