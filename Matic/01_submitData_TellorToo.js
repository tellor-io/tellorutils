/**************************Matic Auto data feed********************************************/

//                         TellorToo price feed                                   //

/******************************************************************************************/

// node Matic/01_submitData_TellorToo.js network

require('dotenv').config()
const fs = require('fs');
const ethers = require('ethers');
const fetch = require('node-fetch-polyfill')
const path = require("path")
const loadJsonFile = require('load-json-file')

var _UTCtime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
var gas_limit = 400000


console.log(_UTCtime)
console.log('not working:  https://gasstation-mainnet.matic.network')
console.log('network',process.argv[2])

function sleep_s(secs) {
    secs = (+new Date) + secs * 1000;
    while ((+new Date) < secs);
}

//https://ethgasstation.info/json/ethgasAPI.json
//works: https://www.etherchain.org/api/gasPriceOracle
//const URL2 = 'https://gasstation-mainnet.matic.network'
async function fetchGasPrice() {
    const URL = `https://gasstation-mainnet.matic.network`;
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
    //console.log("response", response)
    const jsonData = await response.json();
    console.log(jsonData);
    const priceNow = await jsonData[pointer][currency];
    console.log(priceNow);
    const priceNow2 = await priceNow*1000000
    console.log(priceNow2)
    const priceNow3 = await Number(priceNow2.toFixed(0))
    return(priceNow3);
  } catch(e){
    throw Error(e);
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
    var maticKey = process.env.MATIC_ACCESS_TOKEN
    console.log("maticKey", maticKey)

    try {
        if (net == "matic") {
            var network = "matic"
            var etherscanUrl = "https://explorer-mainnet.maticvigil.com/"
            var tellorTooAddress = '0x77352E8f026cb5D880AcFe06F9Acc215E0711F85'
            var pubAddr = process.env.MATIC_PUB
            var privKey = process.env.MATIC_PK
            var url = "https://rpc-mainnet.maticvigil.com/v1/" + maticKey
            var provider = new ethers.providers.JsonRpcProvider(url)
        } else if (net == "mumbai") {
            var network = "mumbai"
            var etherscanUrl = "https://explorer-mumbai.maticvigil.com/"
            var tellorTooAddress = '0xBf8a66DeC65A004B6D89950079B66013A4ac9f0D'
            var pubAddr = process.env.MUMBAI_MATIC_PUB
            var privKey = process.env.MUMBAI_MATIC_PK
            var url = "https://rpc-mumbai.maticvigil.com/v1/" + maticKey
            var provider = new ethers.providers.JsonRpcProvider(url)      
        } else {
            console.log("network not defined")
        }
        
        console.log("TellorToo Address: ", tellorTooAddress)
        console.log("nework", network)
    } catch (error) {
        console.error(error)
        console.log("network error or environment not defined")
        process.exit(1)
    }



    try {
        //var gasP = await fetchGasPrice()
        var gasP = 4000000000
        console.log("gasP1", gasP)
    } catch (error) {
        console.error(error)
        console.log("no gas price fetched")
        process.exit(1)
    }

    try {
        let wallet = new ethers.Wallet(privKey, provider);
        let abi = await loadJsonFile(path.join("abi", "abiTellorToo.json"))
        let contract = new ethers.Contract(tellorTooAddress, abi, provider)
        var contractWithSigner = contract.connect(wallet);

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
            console.log("Requester Matic Balance", balNow)
            var txestimate = (gasP * gas_limit / 1e18);
        } catch (error) {
            console.error(error)
            process.exit(1)
        }

    
        if (gasP != 0 && txestimate < balNow ) {
            console.log("Send data to TellorToo")
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
                timestamp = (Date.now())/1000 | 0
                console.log("timestamp", timestamp)

                //send update to TellorToo
                let tx = await contractWithSigner.submitData(req, timestamp, apiPrice, { from: pubAddr, gasLimit: gas_limit, gasPrice: gasP })
                var link = "".concat(etherscanUrl, '/tx/', tx.hash)
                var ownerlink = "".concat(etherscanUrl, '/address/', tellorTooAddress)
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