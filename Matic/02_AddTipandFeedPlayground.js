/**************************Ethereum Auto data tip or feed********************************************/

//               Tellor AddTip or SubmitValue to Playground          //

/******************************************************************************************/

// node Matic/02_AddTipAndFeedPlayground.js network
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


//url and jsonData.${expression}
//function that pulls data from API
async function fetchPrice(URL, pointer, currency) {

  //var test = `jsonData.${pointer}`;
  try {
    const fetchResult = fetch(URL);
    const response = await fetchResult;
    //console.log("response", response);
    const jsonData = await response.json();
    console.log(jsonData)
    const priceNow = await jsonData[pointer][currency];
    console.log(priceNow)
    const priceNow2 = await priceNow*1000000
    console.log(priceNow2)
    const priceNow3 = await Number(priceNow2.toFixed(0))
    return(priceNow3)
  } catch(e){
    throw Error(e)
  }
}

var dataAPIs = ['https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
           'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
           'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd',
           'https://api.coingecko.com/api/v3/simple/price?ids=tellor&vs_currencies=usd'
           ]
var pointers = ["bitcoin", "ethereum","matic-network", "tellor" ]
var currency = ["usd", "usd", "usd","usd"]
var requestIds = [1,2,31,50]

let run = async function (net) {
    try {
        if (net == "mainnet") {
            var network = "mainnet"
            var etherscanUrl = "https://etherscan.io"
            var tellorMasterAddress = '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5'
            var pubAddr = process.env.ETH_PUB
            var privKey = process.env.ETH_PK
        } else if (net == "goerli") {
            var network = "goerli"
            var etherscanUrl = "https://goeli.etherscan.io"
            //this is TellorPlayground
            var tellorMasterAddress = '0x20374E579832859f180536A69093A126Db1c8aE9'
            var pubAddr = process.env.RINKEBY_ETH_PUB
            var privKey = process.env.RINKEBY_ETH_PK
            
        } else {
            console.log("network not defined")
        }
        var infuraKey = process.env.INFURA_TOKEN
        console.log("infuraKey", infuraKey)
        console.log("Tellor Address: ", tellorMasterAddress)
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
        if (network == "mainnet"){
            var abi = await loadJsonFile(path.join("abi", "tellor.json"))

        } else if (network == "goerli") {
            var abi = await loadJsonFile(path.join("abi", "abiTellorPlayground.json"))
        } else {
            console.log("not a valid network. ABI not loaded")
        }

        let contract = new ethers.Contract(tellorMasterAddress, abi, provider)
        var contractWithSigner = contract.connect(wallet)

    } catch (error) {
        console.error(error)
        console.log("oracle not instantiated")
        process.exit(1)
    }


    var k = dataAPIs.length;
    for (i=0; i<k; i++){

        try {
            var balNow = ethers.utils.formatEther(await provider.getBalance(pubAddr))
            console.log("Requester Address", pubAddr)
            console.log("Requester ETH Balance", balNow)
            var ttbalanceNow = ethers.utils.formatEther(await contractWithSigner.balanceOf(pubAddr))
            console.log('Tellor Tributes balance', ttbalanceNow)
            var txestimate = (gasP * gas_limit / 1e18);
        } catch (error) {
            console.error(error)
            process.exit(1)
        }

    
        if (gasP != 0 && txestimate < balNow && ttbalanceNow > 1)  {
            console.log("Send data or tip to Tellor")
            try{
                let dat
                let point
                let cur
                let req
                let apiPrice
                let co
                let timestamp
                let rdat
                let rdat1

                dat = dataAPIs[i]
                point = pointers[i]
                cur = currency[i]
                req = requestIds[i]
                apiPrice = await fetchPrice(dat, point, cur)
                console.log("apiPrice", apiPrice)
                timestamp = ( (Date.now() /1000)| 0 ) + 3600
                console.log("timestamp", timestamp)

                if (network == "goerli")  {
                //send update to TellorToo
                    var tx = await contractWithSigner.submitValue(req, apiPrice, { from: pubAddr, gasLimit: gas_limit, gasPrice: gasP })
                } else if (network == "mainnet") {
                    var tx = await contractWithSigner.addTip(req, 1, { from: pubAddr, gasLimit: gas_limit, gasPrice: gasP })
                } else {
                    console.log("not a valid network. SubmitData or addTip were not sent")
                }


                var link = "".concat(etherscanUrl, '/tx/', tx.hash)
                var ownerlink = "".concat(etherscanUrl, '/address/', tellorMasterAddress)
                console.log('Yes, price data was sent for request ID: ', req)
                console.log("Hash link: ", link)
                console.log("Contract link: ", ownerlink)
                console.log('Waiting for the transaction to be mined')
                await tx.wait() // If there's an out of gas error the second parameter is the receipt.


                rdat = await contractWithSigner.retrieveData(req, timestamp);
                console.log(rdat*1)
                rdat1 = rdat*1
                if (apiPrice == rdat1) {
                    console.log("Data is on chain, save a copy")
                    // //***************uncomment to save data to a file****/
                    // //save entry on txt file/json
                    // let saving  = "requestId" + i;
                    //     saving = {Id: i,
                    //     time: timestamp,
                    //     value: apiPrice,
                    //     desc: point & "/" & cur,
                    //     api: dat
                    //     }
                    // let jsonName = JSON.stringify(saving);
                    // console.log("InitialReqID info", jsonName);
                    // let filename = "./savedData/MaticMumbaireqID" + i + ".json";
                    // fs.writeFile(filename, jsonName, function(err) {
                    // if (err) {
                    //     console.log(err);
                    // }
                    // });
                    // //***************uncomment to save data to a file****/
                }

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