const DarkWindsFirstEdition = artifacts.require("DarkWindsFirstEdition");
const ERC721BasicToken = artifacts.require("ERC721BasicToken");
const AccessControl = artifacts.require("AccessControl");
const Lockable = artifacts.require("Lockable");

module.exports = function(deployer, network, accounts) {


    if (network === "development" || network === "develop") {
        deployer.deploy(DarkWindsFirstEdition,
            [
                accounts[0], // mego
                accounts[8], // publisher
                accounts[1], // team 1
                accounts[2], // team 2
                accounts[3], // team 3
                accounts[4], // team 4
                accounts[5], // team 5
                accounts[6], // team 6
                accounts[7]  // team 7
            ],
            [
                14,
                14,
                1,
                1,
                1,
                1,
                1,
                1,
                1
            ],
        {gasLimit: 7000000, from: accounts[0]});
    } else if (network === "rinkeby") {
        // REPLACE FOR TESTING IN RINKEBY
        deployer.deploy(DarkWindsFirstEdition,
            [
                accounts[0], // mego
                /*accounts[0], // publisher
                accounts[0], // team 1
                accounts[0], // team 2
                accounts[0], // team 3
                accounts[0], // team 4
                accounts[0], // team 5
                accounts[0], // team 6
                accounts[0]  // team 7*/
            ],
            [
                1
                /*112,
                112,
                8,
                8,
                8,
                8,
                8,
                8,
                8*/
            ]
        );
    } else if (network === "ropsten") {
        console.log("deploying to ropsten via infura...");
        deployer.deploy(DarkWindsFirstEdition,
            [
                "0xd5d383b72c99389d0e2bf92c0723b3f012ace46e", // david
                "0xfDC2ad68fd1EF5341a442d0E2fC8b974E273AC16", // pedro
                "0x869FB29aD9E0aa637343083c3a3C2bfA1fA1e453", // rene firefox
                "0x4978FaF663A3F1A6c74ACCCCBd63294Efec64624", // catalina //"0x2fcF07bA78e97F1a5039b3380d3350275DAB3981",  // rene chrome
                "0xC0097b9C7bA3e0E4EDB41cda09d318e7C3385E28", // pablo
                "0xd129BBF705dC91F50C5d9B44749507f458a733C8", // julio
                "0xe622Ef865748B6a17b1c1186306Fd249eC24b338" // cristean 
                //accounts[0] // mego
                /*accounts[8], // publisher
                accounts[1], // team 1
                accounts[2], // team 2
                accounts[3], // team 3
                accounts[4], // team 4
                accounts[5], // team 5
                accounts[6], // team 6
                accounts[7]  // team 7*/
            ],
            [
                1,
                1,
                1,
                1,
                1,
                1,
                1
                /*112,
                8,
                8,
                8,
                8,
                8,
                8,
                8*/
            ]
        );
    }
};

/*
["0xd5d383b72c99389d0e2bf92c0723b3f012ace46e", "0xfDC2ad68fd1EF5341a442d0E2fC8b974E273AC16", "0x869FB29aD9E0aa637343083c3a3C2bfA1fA1e453", "0x4978FaF663A3F1A6c74ACCCCBd63294Efec64624", "0xC0097b9C7bA3e0E4EDB41cda09d318e7C3385E28", "0xd129BBF705dC91F50C5d9B44749507f458a733C8", "0xe622Ef865748B6a17b1c1186306Fd249eC24b338"], [1, 1, 1, 1, 1, 1, 1]
*/