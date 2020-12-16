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
console.log('<https://www.etherchain.org/api/gasPriceOracle>')
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
            var AMPLInterAddress = "???"
            var pubAddr = process.env.ETH_PUB
            var privKey = process.env.ETH_PK
            var URL = `https://www.etherchain.org/api/gasPriceOracle`
            var networkKey = process.env.INFURA_TOKEN
            var provider = ethers.getDefaultProvider(network, networkKey);
            

        } else if (net == "rinkeby") {
            var network = "rinkeby"
            var etherscanUrl = "https://rinkeby.etherscan.io"
            var tellorMasterAddress = '0xFe41Cb708CD98C5B20423433309E55b53F79134a'
            var AMPLInterAddress = "0x1960f02aAC4fFd27A4439a0Fd8B9b6fc4dC01489"
            var pubAddr = process.env.RINKEBY_ETH_PUB
            var privKey = process.env.RINKEBY_ETH_PK
            var URL = `https://www.etherchain.org/api/gasPriceOracle`
            var networkKey = process.env.INFURA_TOKEN
            var provider = ethers.getDefaultProvider(network, networkKey);
            
        }  else if (net == "goerli") {
            var network = "rinkeby"
            var etherscanUrl = "https://rinkeby.etherscan.io"
            var tellorMasterAddress = '0xFe41Cb708CD98C5B20423433309E55b53F79134a'
            var AMPLInterAddress = "0x1960f02aAC4fFd27A4439a0Fd8B9b6fc4dC01489"
            var pubAddr = process.env.RINKEBY_ETH_PUB
            var privKey = process.env.RINKEBY_ETH_PK
            var URL = `https://www.etherchain.org/api/gasPriceOracle`
            var networkKey = process.env.INFURA_TOKEN
            var provider = ethers.getDefaultProvider(network, networkKey);

        }  else if (net == "mumbai") {
            var network = "rinkeby"
            var etherscanUrl = "https://rinkeby.etherscan.io"
            var tellorMasterAddress = '0xFe41Cb708CD98C5B20423433309E55b53F79134a'
            var AMPLInterAddress = "0x1960f02aAC4fFd27A4439a0Fd8B9b6fc4dC01489"
            var pubAddr = process.env.MUMBAI_ETH_PUB
            var privKey = process.env.MUMBAI_ETH_PK
            var URL = `https://www.etherchain.org/api/gasPriceOracle`
            var networkKey = process.env.MATIC_ACCESS_TOKEN
            var url = "https://rpc-mainnet.maticvigil.com/v1/" + networkKey
            var provider = new ethers.providers.JsonRpcProvider(url)
    
        }  else if (net == "matic") {
            var network = "rinkeby"
            var etherscanUrl = "https://rinkeby.etherscan.io"
            var tellorMasterAddress = '0xFe41Cb708CD98C5B20423433309E55b53F79134a'
            var AMPLInterAddress = "0x1960f02aAC4fFd27A4439a0Fd8B9b6fc4dC01489"
            var pubAddr = process.env.MATIC_PUB
            var privKey = process.env.MATIC_PK
            var URL = `https://www.etherchain.org/api/gasPriceOracle`
            var networkKey = process.env.MATIC_ACCESS_TOKEN
            var url = "https://rpc-mumbai.maticvigil.com/v1/" + networkKey
            var provider = new ethers.providers.JsonRpcProvider(url) 
            
            
        }  else {
            console.log("network not defined")
        }
        
        console.log("Tellor Address: ", tellorMasterAddress)
        console.log("nework", network)
    } catch (error) {
        console.error(error)
        console.log("network error or environment not defined")
        process.exit(1)
    }




    try {
        var gasP = await fetchGasPrice(URL)
        console.log("gasP1", gasP)
    } catch (error) {
        console.error(error)
        console.log("no gas price fetched")
        process.exit(1)
    }


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


/*
var no_txusingETH = 10
var nmb_txusingTRB = 5
var nmb_txusingmumbai = 4
var nbm_txusingmatic = 4
*/

if (network == "mainnet" | network == "rinkeby" | network == "goerli"){
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
            var balNow = ethers.utils.formatEther(await provider.getBalance(pubAddr))
            console.log("Requester Address", pubAddr)
            console.log("Requester Matic token Balance on ", network, " is ", balNow)
            var txestimate = (gasP * gas_limit / 1e18) * 4
            if (gasP != 0 && txestimate < balNow ) {
                console.log("Enough balance for 10 daily tasks at 300K gas limit and gas price of ", gasP, ".")
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
