/**************************Addresses Balances********************************************/

//     Notify if there isn't enough ETH, TRB, or MATIC for Daily Tx's                         //

/******************************************************************************************/
//node AMPL/02_pushTellor.js network

require('dotenv').config()
const ethers = require('ethers');
const fetch = require('node-fetch-polyfill')
const path = require("path")
const loadJsonFile = require('load-json-file')



var _UTCtime  = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
var gas_limit= 300000
var no_txusingETH = 10
var nmb_txusingTRB = 5
var nmb_txusingmumbai = 4
var nbm_txusingmatic = 4

console.log(_UTCtime)
console.log('network',process.argv[2])


function sleep_s(secs) {
  secs = (+new Date) + secs * 1000;
  while ((+new Date) < secs);
}

//https://ethgasstation.info/json/ethgasAPI.json
//https://www.etherchain.org/api/gasPriceOracle
async function fetchGasPrice(URL) {
  try {
    const fetchResult = fetch(URL);
    const response = await fetchResult;
    const jsonData = await response.json();
    const gasPriceNow = await jsonData.fast*1;
    const gasPriceNow2 = await (gasPriceNow)*1000000000;
    console.log(jsonData);
    return(gasPriceNow2);
  } catch(e){
    throw Error(e);
  }
}



let run = async function (net) {
    try {
        if (net == "mainnet") {
            var network = "mainnet"
            var etherscanUrl = "https://etherscan.io"
            var tellorMasterAddress = '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5'
            var pubAddr = process.env.ETH_PUB
            var privKey = process.env.ETH_PK
            var URL = `https://www.etherchain.org/api/gasPriceOracle`
            var networkKey = process.env.INFURA_TOKEN
            var provider = ethers.getDefaultProvider(network, networkKey);
            console.log("Tellor Address: ", tellorMasterAddress)

        } else if (net == "rinkeby") {
            var network = "rinkeby"
            var etherscanUrl = "https://rinkeby.etherscan.io"
            var tellorMasterAddress = '0xFe41Cb708CD98C5B20423433309E55b53F79134a'
            var pubAddr = process.env.RINKEBY_ETH_PUB
            var privKey = process.env.RINKEBY_ETH_PK
            var URL = `https://www.etherchain.org/api/gasPriceOracle`
            var networkKey = process.env.INFURA_TOKEN
            var provider = ethers.getDefaultProvider(network, networkKey);
            console.log("Tellor Address: ", tellorMasterAddress)
            
        }  else if (net == "goerli") {
            var network = "goerli"
            var etherscanUrl = "https://rinkeby.etherscan.io"
            //tellorPlayground for goerli
            var tellorMasterAddress = '0x20374E579832859f180536A69093A126Db1c8aE9'
            var pubAddr = process.env.RINKEBY_ETH_PUB
            var privKey = process.env.RINKEBY_ETH_PK
            var URL = `https://www.etherchain.org/api/gasPriceOracle`
            var networkKey = process.env.INFURA_TOKEN
            var provider = ethers.getDefaultProvider(network, networkKey);
            console.log("Tellor Address: ", tellorMasterAddress)

        }  else if (net == "mumbai") {
            var network = "mumbai"
            var etherscanUrl = "https://explorer-mumbai.maticvigil.com/"
            var tellorTooAddress = '0xBf8a66DeC65A004B6D89950079B66013A4ac9f0D'
            var pubAddr = process.env.MUMBAI_MATIC_PUB
            var privKey = process.env.MUMBAI_MATIC_PK
            var URL = 'https://gasstation-mainnet.matic.network'
            //var URL = `https://www.etherchain.org/api/gasPriceOracle`
            var networkKey = process.env.MATIC_ACCESS_TOKEN
            var maticprovurl = "https://rpc-mumbai.maticvigil.com/v1/" + networkKey
            var provider = new ethers.providers.JsonRpcProvider(maticprovurl)  
            console.log("Tellor Too Address: ", tellorTooAddress)
    
        }  else if (net == "matic") {
            var network = "matic"
            var etherscanUrl = "https://explorer-mainnet.maticvigil.com/"
            var tellorTooAddress = '0x77352E8f026cb5D880AcFe06F9Acc215E0711F85'
            var pubAddr = process.env.MATIC_PUB
            var privKey = process.env.MATIC_PK
            //const URL = 'https://gasstation-mainnet.matic.network'
            var URL = `https://www.etherchain.org/api/gasPriceOracle`
            var networkKey = process.env.MATIC_ACCESS_TOKEN
            var maticprovurl = "https://rpc-mumbai.maticvigil.com/v1/" + networkKey
            var provider = new ethers.providers.JsonRpcProvider(maticprovurl) 
            console.log("Tellor Too Address: ", tellorTooAddress)
            
            
        }  else {
            console.log("network not defined")

        }
        
        //console.log("provider", provider)
        console.log("nework", network)
    } catch (error) {
        console.error(error)
        console.log("network error or environment not defined")
        process.exit(1)
    }




    try {
        //var gasP = 1
        var gasP = await fetchGasPrice(URL)
        console.log("gasP", gasP)
    } catch (error) {
        console.error(error)
        console.log("no gas price fetched")
        process.exit(1)
    }


if (network == "mainnet" | network == "rinkeby" | network == "goerli"){

    try {
        
        var wallet = new ethers.Wallet(privKey, provider);
        let abi = await loadJsonFile(path.join("abi", "tellor.json"))
        let contract = new ethers.Contract(tellorMasterAddress, abi, provider);
        var contractWithSigner = contract.connect(wallet);

    } catch (error) {
        console.error(error)
        console.log("oracle not instantiated")
        process.exit(1)
    }

    try{
        var balNow = ethers.utils.formatEther(await provider.getBalance(pubAddr))
        console.log("Requester Address", pubAddr)   
        console.log("Requester ETH Balance",  balNow)

        var ttbalanceNow = ethers.utils.formatEther(await contractWithSigner.balanceOf(pubAddr))
        console.log('Tellor Tributes balance', ttbalanceNow)
        var txestimate = (gasP * gas_limit / 1e18) * no_txusingETH;
        console.log("txestimate", txestimate)
        if (gasP != 0 && txestimate < balNow && ttbalanceNow > nmb_txusingTRB) {
            console.log("Enough balance for 10 daily tasks at 300K gas limit and gas price of ", gasP, ".")
        } else {
            console.log("Not enough balance for today's transactions")

        }
    } catch(error) {
        console.error(error);
        var diffEth = txestimate - balNow
        var diffTRB =  ttbalanceNow - nmb_txusingTRB
        console.log("Not enough ETH or TRB, short this much ETH " , diffEth, ". OR short this much TRB ", diffTRB, ".")
        process.exit(1)
    }
} else if (network == "mumbai" | network == "matic") {

    try { 
        var wallet = new ethers.Wallet(privKey, provider)
        let abi = await loadJsonFile(path.join("abi", "abiTellorToo.json"))
        let contract = new ethers.Contract(tellorTooAddress, abi, provider)
        var contractWithSigner = contract.connect(wallet);

    } catch (error) {
        console.error(error)
        console.log("oracle not instantiated")
        process.exit(1)
    }

    try {
            var balNow = ethers.utils.formatEther(await provider.getBalance(pubAddr))
            console.log("Requester Address", pubAddr)
            console.log("Requester Matic token Balance on ", network, " is ", balNow)
            var txestimate = (gasP * gas_limit / 1e18) * 4
            if (gasP != 0 && txestimate < balNow ) {
                console.log("Enough balance for 10 daily tasks at 300K gas limit and gas price of ", gasP, ".")
            } else {
                //var fail = gasP/1
                console.log(fail, "Not enough Matic or Mumbai tokens for daily transactions")
                process.exit(1)

            }

        } catch (error) {
            console.error(error)
            console.log("not enouph matic token on ", network)
            process.exit(1)
        }
}




    process.exit()

}

run(process.argv[2])
