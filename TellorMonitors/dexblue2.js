/**************************Add Tip to my request id********************************************/

//                Tip my request id on Tellor                                  //

/******************************************************************************************/
// node TellorMonitors/dexblue2.js

require('dotenv').config()
const ethers = require('ethers');
const fetch = require('node-fetch-polyfill')
const path = require("path")
const loadJsonFile = require('load-json-file')

var _UTCtime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

newTellor = '0x88dF592F8eb5D7Bd38bFeF7dEb0fBc02cf3778a0'
netw = "mainnet"
var dexblue = '0x000000000000541E251335090AC5B47176AF4f7E'

console.log(_UTCtime)
console.log('https://www.etherchain.org/api/gasPriceOracle')
console.log('network',process.argv[2])

function sleep_s(secs) {
    secs = (+new Date) + secs * 1000;
    while ((+new Date) < secs);
}


let readDexblue = async function (net, dexAddr,newTellorAddr ) {
    try {
        if (net == "mainnet") {
            var network = "mainnet"
            var etherscanUrl = "https://etherscan.io"
            var oldTellorAddress = '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5'
            var pubAddr = process.env.ETH_PUB
            var privKey = process.env.ETH_PK
            //var provider = new ethers.providers.JsonRpcProvider(process.env.MAINNET_NODE)
        } else if (net == "rinkeby") {
            var network = "rinkeby"
            var etherscanUrl = "https://rinkeby.etherscan.io"
            var oldTellorAddress = '0xFe41Cb708CD98C5B20423433309E55b53F79134a'
            var pubAddr = process.env.RINKEBY_ETH_PUB
            var privKey = process.env.RINKEBY_ETH_PK
            //var provider = new ethers.providers.JsonRpcProvider(process.env.RINKEBY_NODE)
            
        } else {
           console.log( "network not defined")
        }
        var tellorMasterAddress = newTellorAddr
        var infuraKey = process.env.INFURA_KEY
        console.log("Tellor Address: ", tellorMasterAddress)
        console.log("nework", network)
        console.log("infurakey", infuraKey)
    } catch (error) {
        console.error(error)
        console.log("network error or environment not defined")
        process.exit(1)
    }

    try {
        var provider = ethers.getDefaultProvider(network, infuraKey);
        let wallet = new ethers.Wallet(privKey, provider);
        let abi = await loadJsonFile(path.join("abi", "tellor.json"))
        let dexabi = await loadJsonFile(path.join("abi", "dexblue.json"))
        let newTellor = new ethers.Contract(tellorMasterAddress, abi, provider);
        var newTellorWithSigner = newTellor.connect(wallet);
        let dex = new ethers.Contract(dexAddr, dexabi, provider);
        var dexWithSigner = dex.connect(wallet);

    } catch (error) {
        console.error(error)
        console.log("oracle not instantiated")
        process.exit(1)
    }

    let checkdexblue =  [
        '0x0152b813c7dc97b45766f320baaf5bee8680b011',
'0x016f1fd5a6063f1f83306eb93da224cae1d54ac3',
'0x0445b8e61b4cbc280e1a14b508229b40a5cec90f',
'0x070fb50bd1987b64aa3d85845ca5dad3e2324f4f',
'0x088c95c18236691822d01c2ab223a5f5df574c4c',
'0x0d7effefdb084dfeb1621348c8c70cc4e871eba4',
'0x10890742a1a20a936132072c20ae77b081486190',
'0x1395f53b0472827c78964316a7f5595f302e10c9',
'0x17623c39be4ffd2bd8ff68fcf0cb243628ef1998',
'0x1799a4b6c8566ff572b4aaa42703f66d8d04c5a1',
'0x18d26146aeffcd1e49d8c06b5064605114feb354',
'0x23480df691dbf7c62e967952bbf2067c18cc2f16',
'0x24051430c367573fbfe1531d646ed40765cd22bd',
'0x26bdde6506bd32bd7b5cc5c73cd252807ff18568',
'0x2c7aa2a4b5662a8f6f805197bc9dfc9489852feb',
'0x36c4c53bb6b0b8c59e98b35a1eabb5d43b5bc27f',
'0x37570233fa162166ae743caca24ecf96364522c5',
'0x3c415bcde5df9dc2bbb9a69fe78c91c1b83ae106',
'0x3c42c9df2bb1bb114f404ae16fdad203b48f4199',
'0x3cc8ea8260bcb4192f77d3b382f879102d4be590',
'0x3db4dcbd65e3879fc3ece583d0bd216062ff33e5',
'0x459e8eea49d5ef42ca0042c93862d8f67c453c11',
'0x47ee9b40566aba50d28920747ced2e9701813e63',
'0x4860c6b18b916b515a219eae590f15ad0192aa58',
'0x4b1d0027a307ad0a088a2c5a74a9cd967a505299',
'0x4c39ada0340c1eb3cee343f44819323dd29081a9',
'0x5538c847a9b2f43a4ea3f9852c2af14267af269e',
'0x5567d988dbd49a740d77fc0394f231043c6787a7',
'0x57bc583069f1e5c2523116cdcf259a8362dd7e79',
'0x63a4bdddca7fa8827f6fe0e479a1934831cfb69d',
'0x645e4bfd69a692bb7314ee5b0568342d0a34388b',
'0x66a0a35efaf31013de0131d82c19aa3d123fef2a',
'0x70ddd33089a6c52fdc1723ab62933873f8838b58',
'0x823c54e4fc30665ebcf045d85aa0dae04015670d',
'0x82ff9e428ad69f54f4c0251d13607af7da8bd91e',
'0x875af0c59c4910a60294840d0c6730f4b1caf336',
'0x89e2aebc454556f60f2b6facd1746bcb58f0b4f3',
'0x9074495c5de3ffe89a236cba05b28e0400f5a014',
'0x915893ac09bc215102580c7e832c59c97df84713',
'0x94d28b2422d724e76e1ddfe7e63a4694aa5db3a9',
'0x9cbda0c6daeabd804559c05648d38221904329e3',
'0xa7f4d294b225563e4622760fd6346a8c76f35553',
'0xab4f67148f55a55adef6e42f642455e40a1def8b',
'0xad8005e65fbecf98aa8df8d6c185bcc3eb10128c',
'0xbaf7136c2abc7b85ea1214bd474a2ebb07a6c322',
'0xbdaf949f21ab14b54d50f2301802de26b7169ee8',
'0xc136d78d2ac7e346140913a619972ed01c47d7cd',
'0xc79420c6f7346035d78a3b5d948488a0e8933c69',
'0xd757027e4359bfa70b678854cbe72e74ad07fd43',
'0xdb19afb037fa6b5ef76f343a8f68069323b9903d',
'0xe794f1a676b9ecb34248e4e897c455dd9ae7613f',
'0xeb07d80090a3521e7842f86bab15975fd8c63ec3',
'0xecaf619b2640299d2654f90bc8d46d50ce59b101',
'0xeee161553db58385d63fc1864d14f0e3add9efbf',
'0xef6ba13959c565fccd868e17d82d945a487b5530',
'0xf3c9ee0d1c694e4b5ad0c1d3fc06591bb805ed49',
'0xf4d23c5340921ae6421adff2eb690d5c0fdd2ba9',
'0xf7924cb2b7bf86e683c2b6381510939d90cdf735',
'0xf7d5770fdd55219ef0754193d89c7b8ab8e98d92',
'0xfa26ed87b875ec9b82a2458b1b95a6c6bcf7eabf',
'0xfb13b0eec4633c8fdbd87aa4ce087f591b3cef84',
'0x428700e86c104f4ee8139a69ecdca09e843f6297'
    ]
    console.log("holder", "newTRB", "dexBlueTRB")
    for(i=0;i<=checkdexblue.length;i++){
            try {
                let checkAddress = checkdexblue[i];
                var ttbalanceNow = ethers.utils.formatEther(await newTellorWithSigner.balanceOf(checkAddress))
                let dextrb = ethers.utils.formatEther(await dexWithSigner.getBalance(oldTellorAddress, checkAddress))
                console.log(checkAddress, ttbalanceNow, dextrb)
            } catch (error) {
                console.error(error)
                process.exit(1)
            }
        }

}

readDexblue(netw,dexblue,newTellor)