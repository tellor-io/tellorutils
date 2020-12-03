/**************************ETH tip AMPL********************************************/

//                Tip AMPL on Tellor mainnet                                  //

/******************************************************************************************/
//truffle exec 01_tip_ampl.js --network mainnet

require('dotenv').config()
const Web3 = require('web3')
const HDWalletProvider = require("@truffle/hdwallet-provider")
const fs = require('fs')
const fetch = require('node-fetch-polyfill')

const TellorMaster = artifacts.require("./TellorMaster.sol")
const Oracle = artifacts.require("./Tellor.sol")
const oracleAbi = Oracle.abi
const oracleByte = Oracle.bytecode
const abiAMPLinter = artifacts.require("./abi/abiAmplIntermediate")


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
    const gasPriceNow = await jsonData.fast*1;
    const gasPriceNow2 = await (gasPriceNow)*1000000000;
    console.log(jsonData);
    return(gasPriceNow2);
  } catch(e){
    throw Error(e);
  }
}

var pk = process.env.ETH_PK
var accessToken = process.env.INFURA_ACCESS_TOKEN
//var web3 = new Web3(new HDWalletProvider(pk,"https://rinkeby.infura.io/v3"+ accessToken))

var web3 = new Web3(new HDWalletProvider(pk,"https://mainnet.infura.io/v3/" + accessToken))
var _UTCtime  = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
var gas_Limit= 400000

//Rinkeby
//var tellorMasterAddress = '0xFe41Cb708CD98C5B20423433309E55b53F79134a' 
//var accountFrom = '0xe010ac6e0248790e08f42d5f697160dedf97e024'

var tellorMasterAddress = '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5'
var accountFrom = '0xf967b011c0b04913d16bf8807f38d7346112a56b'

console.log(_UTCtime)
console.log("Tellor Address: ", tellorMasterAddress)
console.log('<https://www.etherchain.org/api/gasPriceOracle>')

module.exports =async function(callback) {
    try{
        var gasP = await fetchGasPrice()
        console.log("gasP1", gasP)
    } catch(error){
        console.error(error)
        console.log("no gas price fetched")
    }

    let tellorMaster = await TellorMaster.at(tellorMasterAddress)
    try{
        var balNow = await web3.eth.getBalance(accountFrom)
        console.log("Requests Address", accountFrom)
        var currBalance = await web3.utils.fromWei(balNow,'ether')
        console.log("Requester ETH Balance",  currBalance)
        var ttbalanceNow = await tellorMaster.balanceOf(accountFrom)
        var tributesBal =  await web3.utils.fromWei(ttbalanceNow,'ether')
        console.log('Tellor Tributes balance', tributesBal)
        var txestimate = gasP * gas_limit
    } catch(error) {
        console.error(error)
    }
    
    if (gasP != 0 && txestimate > balNow && ttbalanceNow > 1 ) {
        try{
            var oracle = await new web3.eth.Contract(oracleAbi,tellorMasterAddress);
            console.log("awaitOracle")
        } catch(error) {
            console.error(error)
            console.log("oracle not instantiated")
        }

        console.log("Send request for AMPL")
        try{
            await oracle.methods.addTip(10,1).send({from: accountFrom,gas: gas_Limit,gasPrice: gasP })
            .on('transactionHash', function(hash){
                var link = "".concat('<https://etherscan.io/tx/',hash,'>' )
                var ownerlink = "".concat('<https://etherscan.io/address/',tellorMasterAddress,'>' )
                 console.log('Yes, a request was sent for the APML price')
                console.log("Hash link: ", link)
                console.log("Contract link: ", ownerlink)
            })
            .on('error', console.error) // If there's an out of gas error the second parameter is the receipt.
        } catch(error) {
        console.error(error)
        }
        console.log("AMPL was tipped")
    }
    process.exit()

}