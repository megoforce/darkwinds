const BigNumber = web3.BigNumber;

require("chai")
    .use(require("chai-as-promised"))
    .use(require("chai-bignumber")(BigNumber))
    .should();

//const EVMThrow = require("./helpers/EVMThrow");
const CorsariumCore = artifacts.require('DarkWindsFirstEdition');

contract("DarkWindsFirstEdition Split", function(accounts) {
    const amount = web3.toWei(1.0, "ether");
    const mego = accounts[0];
    const publisher = accounts[8];
    const team1 = accounts[1];
    const team2 = accounts[2];
    const team3 = accounts[3];
    const team4 = accounts[4];
    const team5 = accounts[5];
    const team6 = accounts[6];
    const team7 = accounts[7];
    const payer1 = accounts[9];

    let cost;
    let tx;

    beforeEach(async function() {
        this.payees = [mego, publisher, team1, team2, team3, team4, team5, team6, team7];
        this.shares = [14,      14,     1,     1,     1,     1,     1,     1,     1];
        this.contract = await CorsariumCore.new(this.payees, this.shares);

        cost = await this.contract.cost();

        console.log("\tThis will take a while... we are purchasing 100 * 40 card booster packs");
        console.log("\tSkip this test by using `truffle test ./path/to/specific_test.js`");

        for(let i = 0; i < 100; i++) {
            tx = await this.contract.buyBoosterPack(
                {
                    from: payer1,
                    value: cost.mul(40),
                    gasLimit: new BigNumber('100000'),
                    gasPrice: new BigNumber('8')
                }
            );
        }
    });

    it("should distribute funds to payees", async function() {
        // await web3.eth.sendTransaction({from: payer1, to: this.contract.address, value: amount});

        // receive funds
        const initBalance = web3.eth.getBalance(this.contract.address);
        initBalance.should.be.bignumber.equal(cost.mul(40).mul(100));

        // console.log(`initbalance ${initBalance}`);

        // distribute
        const initAmountMego = web3.eth.getBalance(mego);
        await this.contract.claim({from: mego});
        const profitMego = web3.eth.getBalance(mego).minus(initAmountMego);
        console.log(`\tinitmego ${initAmountMego} profit ${profitMego}`);
        //assert(Math.abs(profitMego - web3.toWei(0.112, "ether")) < 1e16);

        const initAmountPublisher = web3.eth.getBalance(publisher);
        await this.contract.claim({from: publisher});
        const profitPublisher = web3.eth.getBalance(publisher).minus(initAmountPublisher);
        console.log(`\tinitpub ${initAmountPublisher} profit ${profitPublisher}`);
        //assert(Math.abs(profitPublisher - web3.toWei(0.112, "ether")) < 1e16);

        profitPublisher.should.be.bignumber.equal(profitPublisher);

        const initAmountTeam1 = web3.eth.getBalance(team1);
        await this.contract.claim({from: team1});
        const profitTeam1 = web3.eth.getBalance(team1).minus(initAmountTeam1);
        console.log(`\tinitt1 ${initAmountTeam1} profit ${profitTeam1}`);
        //assert(Math.abs(profitTeam1 - web3.toWei(0.08, "ether")) < 1e16);

        const initAmountTeam2 = web3.eth.getBalance(team2);
        await this.contract.claim({from: team2});
        const profitTeam2 = web3.eth.getBalance(team2).minus(initAmountTeam2);
        console.log(`\tinitt2 ${initAmountTeam2} profit ${profitTeam2}`);
        //assert(Math.abs(profitTeam2 - web3.toWei(0.08, "ether")) < 1e16);

        profitTeam1.should.be.bignumber.equal(profitTeam2);

        const initAmountTeam3 = web3.eth.getBalance(team3);
        await this.contract.claim({from: team3});
        const profitTeam3 = web3.eth.getBalance(team3).minus(initAmountTeam3);
        console.log(`\tinitt3 ${initAmountTeam3} profit ${profitTeam3}`);
        //assert(Math.abs(profitTeam3 - web3.toWei(0.08, "ether")) < 1e16);

        const initAmountTeam4 = web3.eth.getBalance(team4);
        await this.contract.claim({from: team4});
        const profitTeam4 = web3.eth.getBalance(team4).minus(initAmountTeam4);
        console.log(`\tinitt4 ${initAmountTeam4} profit ${profitTeam4}`);
        //assert(Math.abs(profitTeam4 - web3.toWei(0.08, "ether")) < 1e16);

        const initAmountTeam5 = web3.eth.getBalance(team5);
        await this.contract.claim({from: team5});
        const profitTeam5 = web3.eth.getBalance(team5).minus(initAmountTeam5);
        console.log(`\tinitt5 ${initAmountTeam5} profit ${profitTeam5}`);
        //assert(Math.abs(profitTeam5 - web3.toWei(0.08, "ether")) < 1e16);

        const initAmountTeam6 = web3.eth.getBalance(team6);
        await this.contract.claim({from: team6});
        const profitTeam6 = web3.eth.getBalance(team6).minus(initAmountTeam6);
        console.log(`\tinitt6 ${initAmountTeam6} profit ${profitTeam6}`);
        //assert(Math.abs(profitTeam6 - web3.toWei(0.08, "ether")) < 1e16);

        const initAmountTeam7 = web3.eth.getBalance(team7);
        await this.contract.claim({from: team7});
        const profitTeam7 = web3.eth.getBalance(team7).minus(initAmountTeam7);
        console.log(`\tinitt7 ${initAmountTeam7} profit ${profitTeam7}`);
        //assert(Math.abs(profitTeam7 - web3.toWei(0.08, "ether")) < 1e16);

        profitTeam7.should.be.bignumber.equal(profitTeam2);

        let shares = await this.contract.shares.call(mego);
        // console.log(`shares ${shares}`);
        shares = await this.contract.shares.call(publisher);
        // console.log(`shares ${shares}`);
        shares = await this.contract.shares.call(team1);
        // console.log(`shares ${shares}`);

        // end balance, some residual
        const endBalance = web3.eth.getBalance(this.contract.address);
        endBalance.should.be.bignumber.lt(50);

        // total released, some residual
        const totalReleased = await this.contract.totalReleased.call();
        totalReleased.should.be.bignumber.gt(initBalance.minus(50));
    });
});