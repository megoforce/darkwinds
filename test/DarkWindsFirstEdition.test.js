import assertRevert from '../tools/helpers/assertRevert';
import shouldBehaveLikeERC721BasicToken from './ERC721BasicToken.behaviour';
import shouldMintAndBurnERC721Token from './ERC721MintBurn.behaviour';
import _ from 'lodash';

const BigNumber = web3.BigNumber;
const DarkWindsToken = artifacts.require('DarkWindsFirstEditionTokenMock.sol');

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('DarkWindsFirstEdition', function (accounts) {
    const name = 'Dark Winds First Edition Cards (Revisited)';
    const symbol = 'DW1STR';

    const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

    const firstTokenId = 0;
    const secondTokenId = 1;

    const firstTokenProto = randTokenProto();
    const secondTokenProto = randTokenProto();

    const creator = accounts[0];

    function pad(num, size) {
        let s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }

    function randTokenProto() {
        return Math.floor(Math.random() * Math.floor(100));
    }

    beforeEach(async function () {
        this.token = await DarkWindsToken.new([
            accounts[0], // mego
            accounts[8], // publisher
            accounts[1], // team 1
            accounts[2], // team 2
            accounts[3], // team 3
            accounts[4], // team 4
            accounts[5], // team 5
            accounts[6], // team 6
            accounts[7]  // team 7
        ], [
            14,
            14,
            1,
            1,
            1,
            1,
            1,
            1,
            1
        ], {from: creator});
    });

    shouldBehaveLikeERC721BasicToken(accounts);
    
    shouldMintAndBurnERC721Token(accounts);

    describe('like a full ERC721', function () {
        beforeEach(async function () {
            await this.token.mint(creator, firstTokenId, firstTokenProto, {from: creator});
            await this.token.mint(creator, secondTokenId, secondTokenProto, {from: creator});
        });

        describe('mint', function () {
            const to = accounts[1];
            const tokenId = 3;

            beforeEach(async function () {
                await this.token.mint(to, tokenId, 30);
            });

            it('adjusts owner tokens by index', async function () {
                const token = await this.token.tokenOfOwnerByIndex(to, 0);
                token.toNumber().should.be.equal(tokenId);
            });

            it('adjusts all tokens list', async function () {
                const newToken = await this.token.tokenByIndex(2);
                newToken.toNumber().should.be.equal(tokenId);
            });
        });

        describe('metadata', function () {

            it('has a name', async function () {
                const name = await this.token.name();
                name.should.be.equal(name);
            });

            it('has a symbol', async function () {
                const symbol = await this.token.symbol();
                symbol.should.be.equal(symbol);
            });

            it('returns correct metadata for first token', async function () {
                const uri = await this.token.tokenURI(firstTokenId);
                uri.should.be.equal('https://corsarium.playdarkwinds.com/cards/00' + pad(firstTokenProto, 3) + '.json');
            });

            it('returns correct metadata for token at the edge', async function () {
                const uri = await this.token.tokenURI(secondTokenId);
                uri.should.be.equal('https://corsarium.playdarkwinds.com/cards/00' + pad(secondTokenProto, 3) + '.json');
            });

            it('reverts when querying metadata for non existant token id', async function () {
                await assertRevert(this.token.tokenURI(500));
            });

            it('reverts when querying metadata for non existant token id above edge', async function () {
                await assertRevert(this.token.tokenURI(3));
            });
        });

        describe('cardsOfOwner', function () {
            it('returns correct cards for creator', async function () {
                const cards = await this.token.cardsOfOwner(creator);
                cards.length.should.be.equal(2);
            });

            it('returns correct cards for non-existent purchaser', async function () {
                const cards = await this.token.cardsOfOwner(ZERO_ADDRESS);
                cards.length.should.be.equal(0);
            });
        });

        describe('tokensOfOwner', function () {
            it('returns correct cards for creator', async function () {
                const cards = await this.token.tokensOfOwner(creator);
                cards.length.should.be.equal(2);
            });

            it('returns correct cards for non-existent purchaser', async function () {
                const cards = await this.token.tokensOfOwner(ZERO_ADDRESS);
                cards.length.should.be.equal(0);
            });
        });

        describe('cardSupply', function () {
            it('returns correct card supply enumeration', async function () {
                const cards = await this.token.cardSupply();
                cards.length.should.be.equal(2);
            });
        });

        describe('totalSupply', function () {
            it('returns total token supply', async function () {
                const totalSupply = await this.token.totalSupply();
                totalSupply.should.be.bignumber.equal(2);
            });
        });

        describe('getCard', function () {
            it('returns right prototype for first', async function () {
                const proto = await this.token.getCard(0);
                proto.should.be.bignumber.equal(firstTokenProto);
            });

            it('returns right prototype for second', async function () {
                const proto = await this.token.getCard(1);
                proto.should.be.bignumber.equal(secondTokenProto);
            });

            it('reverts for non-existent card', async function () {
                await assertRevert(this.token.getCard(2));
            });
        });

        describe('cardsOfOwner', function () {
            it('returns right prototype for first and second', async function () {
                const protos = await this.token.cardsOfOwner(creator);
                protos.length.should.be.bignumber.equal(2);
                protos[0].should.be.bignumber.equal(firstTokenProto);
                protos[1].should.be.bignumber.equal(secondTokenProto);
            });
        });

        describe('cardSupply', function () {
            it('returns right prototype for first and second', async function () {
                const protos = await this.token.cardSupply();
                protos.length.should.be.bignumber.equal(2);
                protos[0].should.be.bignumber.equal(firstTokenProto);
                protos[1].should.be.bignumber.equal(secondTokenProto);
            });
        });

        describe('giveUserCards', function () {
            it('reverts when locked', async function () {
                await this.token.lock({from: creator});
                await assertRevert(this.token.giveUserCards(creator, [101, 101]));
            });



            /*it('gives user cards', async function () {
                await this.token.giveUserCards(creator, [101, 101, 80, 70, 50, 40]);
                const protos = await this.token.cardsOfOwner(creator);
                protos.length.should.be.bignumber.equal(8);
                protos[0].should.be.bignumber.equal(firstTokenProto);
                protos[1].should.be.bignumber.equal(secondTokenProto);
                protos[2].should.be.bignumber.equal(101);
                protos[3].should.be.bignumber.equal(101);
                protos[4].should.be.bignumber.equal(80);
                protos[5].should.be.bignumber.equal(70);
                protos[6].should.be.bignumber.equal(50);
                protos[7].should.be.bignumber.equal(40);
                let uri = await this.token.tokenURI(2);
                uri.should.be.equal('https://corsarium.playdarkwinds.com/cards/00101.json');

                uri = await this.token.tokenURI(3);
                uri.should.be.equal('https://corsarium.playdarkwinds.com/cards/00101.json');

                uri = await this.token.tokenURI(4);
                uri.should.be.equal('https://corsarium.playdarkwinds.com/cards/00080.json');

                uri = await this.token.tokenURI(5);
                uri.should.be.equal('https://corsarium.playdarkwinds.com/cards/00070.json');

                uri = await this.token.tokenURI(6);
                uri.should.be.equal('https://corsarium.playdarkwinds.com/cards/00050.json');

                uri = await this.token.tokenURI(7);
                uri.should.be.equal('https://corsarium.playdarkwinds.com/cards/00040.json');

                const allocatedTokens = await this.token.allocatedTokens();
                // This is 6 because the beforeEach function calls mint directly
                allocatedTokens.should.be.bignumber.equal(6);
            }); */

        });

        describe('setTokenURI', function () {
            it('reverts when notTeam', async function () {
                const newUrl = "https://newUrl.com/path/00000.json";
                await assertRevert(this.token.setTokenURI(newUrl, 24, {from: accounts[3]}));
                /*
                await this.token.setTokenURI(newUrl, 24, {from: accounts[3]});
                const uri = await this.token.tokenURI(secondTokenId);
                uri.should.be.equal('https://newUrl.com/path/00' + pad(secondTokenProto, 3) + '.json');
                */
            });
        });

        describe('tokenOfOwnerByIndex', function () {
            const owner = creator;
            const another = accounts[1];

            describe('when the given index is lower than the amount of tokens owned by the given address', function () {
                it('returns the token ID placed at the given index', async function () {
                    const tokenId = await this.token.tokenOfOwnerByIndex(owner, 0);
                    tokenId.should.be.bignumber.equal(firstTokenId);
                });
            });

            describe('when the index is greater than or equal to the total tokens owned by the given address', function () {
                it('reverts', async function () {
                    await assertRevert(this.token.tokenOfOwnerByIndex(owner, 2));
                });
            });

            describe('when the given address does not own any token', function () {
                it('reverts', async function () {
                    await assertRevert(this.token.tokenOfOwnerByIndex(another, 0));
                });
            });

            describe('after transferring all tokens to another user', function () {
                beforeEach(async function () {
                    await this.token.transferFrom(owner, another, firstTokenId, {from: owner});
                    await this.token.transferFrom(owner, another, secondTokenId, {from: owner});
                });

                it('returns correct token IDs for target', async function () {
                    const count = await this.token.balanceOf(another);
                    count.toNumber().should.be.equal(2);
                    const tokensListed = await Promise.all(_.range(2).map(i => this.token.tokenOfOwnerByIndex(another, i)));
                    tokensListed.map(t => t.toNumber()).should.have.members([firstTokenId, secondTokenId]);
                });

                it('returns empty collection for original owner', async function () {
                    const count = await this.token.balanceOf(owner);
                    count.toNumber().should.be.equal(0);
                    await assertRevert(this.token.tokenOfOwnerByIndex(owner, 0));
                });
            });
        });

        describe('tokenByIndex', function () {
            it('should return all tokens', async function () {
                const tokensListed = await Promise.all(_.range(2).map(i => this.token.tokenByIndex(i)));
                tokensListed.map(t => t.toNumber()).should.have.members([firstTokenId, secondTokenId]);
            });

            it('should revert if index is greater than supply', async function () {
                await assertRevert(this.token.tokenByIndex(2));
            });
        });

        // TODO: Check card allocation prototypeIds
        // TODO: Going over allocation
        describe('buyBoosterPack', function () {
            let tx;
            let cost;
            const numberOfCards = 40;

            beforeEach(async function() {
                cost = await this.token.cost();

                tx = await this.token.buyBoosterPack(
                    {
                        from: accounts[0],
                        value: cost.mul(numberOfCards),
                        gasLimit: new BigNumber('100000'),
                        gasPrice: new BigNumber('8')
                    }
                );
            });

            describe('when purchasing ' + numberOfCards + ' cards', async function () {
                it('buys correct amount of cards for value', async function () {
                    tx.logs.length.should.be.equal(numberOfCards);
                });

                it('creates the correct logs for purchase', async function () {
                    for (let i = 0; i < tx.logs.length; i++) {
                        tx.logs[i].event.should.be.eq('Transfer');
                        tx.logs[i].args._from.should.be.equal(ZERO_ADDRESS);
                        tx.logs[i].args._to.should.be.equal(accounts[0]);
                        tx.logs[i].args._tokenId.should.be.bignumber.equal(i + 2);
                    }
                });

                it('generates the correct total supply from purchase', async function () {
                    const totalSupply = await this.token.totalSupply();
                    totalSupply.should.be.bignumber.equal(numberOfCards + 2);
                });

                it('generates the correct balance for purchaser', async function () {
                    const count = await this.token.balanceOf(accounts[0]);
                    count.toNumber().should.be.equal(numberOfCards + 2);
                });

                it('uses gasUsed is under 6 million for ' + numberOfCards + ' cards', async function () {
                    tx.receipt.gasUsed.should.be.bignumber.lt(6000000);
                });

                it('generates correct allocated cards', async function () {
                    const allocatedTokens = await this.token.allocatedTokens();
                    // This is 40 because the beforeEach function calls mint directly
                    allocatedTokens.should.be.bignumber.equal(numberOfCards);
                });

                it('can\'t purchase when paused', async function () {
                    await this.token.pause({from: creator});
                    await assertRevert(this.token.buyBoosterPack(
                        {
                            from: accounts[0],
                            value: cost.mul(numberOfCards),
                            gasLimit: new BigNumber('100000'),
                            gasPrice: new BigNumber('8')
                        }
                    ));

                    await this.token.unpause({from: creator});
                    this.token.buyBoosterPack(
                        {
                            from: accounts[0],
                            value: cost.mul(numberOfCards),
                            gasLimit: new BigNumber('100000'),
                            gasPrice: new BigNumber('8')
                        }
                    );
                });

                it('contains different prototypeIds', async function () {
                    const cardSupply = await this.token.cardSupply();
                    // This is 40 because the beforeEach function calls mint directly
                    cardSupply.length.should.be.equal(numberOfCards + 2);
                    let equ = true;
                    for(let i = 1; i < cardSupply.length; i++) {
                        equ = equ && cardSupply[i].eq(cardSupply[0]);
                    }
                    equ.should.be.equal(false);
                });
            });

        });

        // TODO: Allocated tokens, going over allocation
        describe('buyBoosterForFriend', function () {
            it('buys correct amount of cards for friend for value', async function () {
                const cost = await this.token.cost();

                // buy 10 cards
                const tx = await this.token.buyBoosterForFriend(
                    accounts[1],
                    {
                        from: accounts[0],
                        value: cost.mul(10),
                        gasLimit: new BigNumber('100000'),
                        gasPrice: new BigNumber('8')
                    }
                );

                tx.logs.length.should.be.equal(10);

                for (let i = 0; i < tx.logs.length; i++) {
                    tx.logs[i].event.should.be.eq('Transfer');
                    tx.logs[i].args._from.should.be.equal(ZERO_ADDRESS);
                    tx.logs[i].args._to.should.be.equal(accounts[1]);
                    tx.logs[i].args._tokenId.should.be.bignumber.equal(i + 2);
                }

                const totalSupply = await this.token.totalSupply();
                totalSupply.should.be.bignumber.equal(12);

                const count = await this.token.balanceOf(accounts[1]);
                count.toNumber().should.be.equal(10);

                const allocatedTokens = await this.token.allocatedTokens();
                // This is 90 because the beforeEach function calls mint directly
                allocatedTokens.should.be.bignumber.equal(10);
            });

            it('doesn\'t allow zero address purchase', async function () {
                const cost = await this.token.cost();

                // buy 10 cards for zero address
                await assertRevert(this.token.buyBoosterForFriend(
                    ZERO_ADDRESS,
                    {
                        from: accounts[0],
                        value: cost.mul(10),
                        gasLimit: new BigNumber('100000'),
                        gasPrice: new BigNumber('8')
                    }
                ));
            });

            it('gasUsed is under 6 million for 40 cards', async function () {
                const cost = await this.token.cost();

                // buy 40 cards
                const tx = await this.token.buyBoosterForFriend(
                    accounts[1],
                    {
                        from: accounts[0],
                        value: cost.mul(40),
                        gasLimit: new BigNumber('6000000'),
                        gasPrice: new BigNumber('8')
                    }
                );

                const totalSupply = await this.token.totalSupply();
                totalSupply.should.be.bignumber.equal(42);

                tx.logs.length.should.be.equal(40);

                tx.receipt.gasUsed.should.be.bignumber.lt(6000000);
            });

            it('can\'t purchase when paused', async function () {
                const cost = await this.token.cost();

                await this.token.pause({from: creator});
                await assertRevert(this.token.buyBoosterForFriend(
                    accounts[1],
                    {
                        from: accounts[0],
                        value: cost.mul(20),
                        gasLimit: new BigNumber('100000'),
                        gasPrice: new BigNumber('8')
                    }
                ));

                await this.token.unpause({from: creator});
                this.token.buyBoosterForFriend(
                    accounts[1],
                    {
                        from: accounts[0],
                        value: cost.mul(20),
                        gasLimit: new BigNumber('100000'),
                        gasPrice: new BigNumber('8')
                    }
                )
            });
        });
    });

    describe('maxCards', function () {
        it('reverts when about to allocate more than max', async function () {
            await this.token.setMaxCards(100, {from: creator});

            const cost = await this.token.cost();

            for(let i = 0; i < 9; i++) {
                const tx = await this.token.buyBoosterForFriend(
                    accounts[1],
                    {
                        from: accounts[0],
                        value: cost.mul(10),
                        gasLimit: new BigNumber('100000'),
                        gasPrice: new BigNumber('8')
                    }
                );

                tx.logs.length.should.be.equal(10);

                for (let i = 0; i < tx.logs.length; i++) {
                    tx.logs[i].event.should.be.eq('Transfer');
                    tx.logs[i].args._from.should.be.equal(ZERO_ADDRESS);
                    tx.logs[i].args._to.should.be.equal(accounts[1]);
                    // tx.logs[i].args._tokenId.should.be.bignumber.equal();
                    // console.log(tx.logs[i].args._tokenId);
                }
            }

            await assertRevert(this.token.buyBoosterForFriend(
                accounts[1],
                {
                    from: accounts[0],
                    value: cost.mul(10),
                    gasLimit: new BigNumber('100000'),
                    gasPrice: new BigNumber('8')
                }
            ));

            const allocatedTokens = await this.token.allocatedTokens();
            // This is 90 because the beforeEach function calls mint directly
            allocatedTokens.should.be.bignumber.equal(90);
        });

    });

    /*
    describe('buyWrappedBooster', function () {

        let tx;
        let tx2;
        let tx3;

        let cost;
        const numberOfCards = 40;

        beforeEach(async function() {
            cost = await this.token.cost();

            tx = await this.token.buyWrappedBooster(
                {
                    from: accounts[0],
                    value: cost.mul(numberOfCards),
                    gasLimit: new BigNumber('100000'),
                    gasPrice: new BigNumber('8')
                }
            );

            tx2 = await this.token.buyWrappedBooster(
                {
                    from: accounts[0],
                    value: cost.mul(numberOfCards),
                    gasLimit: new BigNumber('100000'),
                    gasPrice: new BigNumber('8')
                }
            );

            tx3 = await this.token.buyWrappedBooster(
                {
                    from: accounts[0],
                    value: cost.mul(numberOfCards),
                    gasLimit: new BigNumber('100000'),
                    gasPrice: new BigNumber('8')
                }
            );
        });

        describe('when buyWrappedBooster ' + (3 * numberOfCards).toString() + ' cards', async function () {
            it('generates correct allocated cards', async function () {
                const allocatedTokens = await this.token.allocatedTokens();
                // This is 40 because the beforeEach function calls mint directly
                allocatedTokens.should.be.bignumber.equal(3 * numberOfCards);
            });


            it('emits BoosterPurchase for the purchase', async function () {
                tx.logs.length.should.be.equal(1);
                tx.logs[0].event.should.be.eq('BoosterPurchase');
                tx.logs[0].args._from.should.be.equal(accounts[0]);
                tx.logs[0].args._to.should.be.equal(accounts[0]);
                tx.logs[0].args._amount.should.be.bignumber.equal(numberOfCards);

                tx2.logs.length.should.be.equal(1);
                tx2.logs[0].event.should.be.eq('BoosterPurchase');
                tx2.logs[0].args._from.should.be.equal(accounts[0]);
                tx2.logs[0].args._to.should.be.equal(accounts[0]);
                tx2.logs[0].args._amount.should.be.bignumber.equal(numberOfCards);

                tx3.logs.length.should.be.equal(1);
                tx3.logs[0].event.should.be.eq('BoosterPurchase');
                tx3.logs[0].args._from.should.be.equal(accounts[0]);
                tx3.logs[0].args._to.should.be.equal(accounts[0]);
                tx3.logs[0].args._amount.should.be.bignumber.equal(numberOfCards);
            });


            it('wrappedBoosters has correct card values', async function () {
                const amounts = await this.token.getBoosterAmounts(accounts[0]);
                amounts.length.should.be.equal(3);
                amounts[0].should.be.bignumber.equal(numberOfCards);
                amounts[1].should.be.bignumber.equal(numberOfCards);
                amounts[2].should.be.bignumber.equal(numberOfCards);
            });

            describe('when transfering puchased booster', function () {
                let transfer;
                let transfer2;

                beforeEach(async function() {
                    cost = await this.token.cost();

                    transfer = await this.token.transferWrappedBooster(
                        accounts[1],
                        1,
                        {
                            from: accounts[0],
                            gasLimit: new BigNumber('100000'),
                            gasPrice: new BigNumber('8')
                        }
                    );

                    transfer2 = await this.token.transferWrappedBooster(
                        accounts[1],
                        0,
                        {
                            from: accounts[0],
                            gasLimit: new BigNumber('100000'),
                            gasPrice: new BigNumber('8')
                        }
                    );
                });

                it('still has the correct allocated cards', async function () {
                    const allocatedTokens = await this.token.allocatedTokens();
                    // This is 40 because the beforeEach function calls mint directly
                    allocatedTokens.should.be.bignumber.equal(3 * numberOfCards);
                });

                it('booster amounts are correct for new owner', async function () {
                    const amounts = await this.token.getBoosterAmounts(accounts[1]);
                    amounts.length.should.be.equal(2);
                    amounts[0].should.be.bignumber.equal(numberOfCards);
                    amounts[1].should.be.bignumber.equal(numberOfCards);

                    const indexAmount0 = await this.token.getBoosterAmountForIndex(accounts[1], 0);
                    indexAmount0.should.be.bignumber.equal(amounts[0]);

                    const indexAmount1 = await this.token.getBoosterAmountForIndex(accounts[1], 1);
                    indexAmount1.should.be.bignumber.equal(amounts[1]);

                    await assertRevert(this.token.getBoosterAmountForIndex(accounts[1], 2));

                    const amountsPrevious = await this.token.getBoosterAmounts(accounts[0]);
                    amountsPrevious.length.should.be.equal(1);
                    amountsPrevious[0].should.be.bignumber.equal(numberOfCards);

                    const indexAmount = await this.token.getBoosterAmountForIndex(accounts[0], 0);
                    amountsPrevious[0].should.be.bignumber.equal(indexAmount);
                });

                it('emits the BoosterTransfer event', async function () {
                    transfer.logs.length.should.be.equal(1);
                    transfer.logs[0].event.should.be.eq('BoosterTransfer');
                    transfer.logs[0].args._from.should.be.equal(accounts[0]);
                    transfer.logs[0].args._to.should.be.equal(accounts[1]);
                    transfer.logs[0].args._amount.should.be.bignumber.equal(numberOfCards);

                    transfer2.logs.length.should.be.equal(1);
                    transfer2.logs[0].event.should.be.eq('BoosterTransfer');
                    transfer2.logs[0].args._from.should.be.equal(accounts[0]);
                    transfer2.logs[0].args._to.should.be.equal(accounts[1]);
                    transfer2.logs[0].args._amount.should.be.bignumber.equal(numberOfCards);
                });

                it('user can unwrap their transferred booster', async function () {
                    const transfer3 = await this.token.transferWrappedBooster(
                        accounts[1],
                        0,
                        {
                            from: accounts[0],
                            gasLimit: new BigNumber('100000'),
                            gasPrice: new BigNumber('8')
                        }
                    );

                    // Opening at middle first
                    const open = await this.token.openWrappedBooster(
                        1,
                        {
                            from: accounts[1],
                            gasLimit: new BigNumber('5000000'),
                            gasPrice: new BigNumber('8')
                        }
                    );

                    const boosterPackAmounts = await this.token.getBoosterAmounts(accounts[1]);
                    boosterPackAmounts.length.should.be.equal(2);
                    boosterPackAmounts[0].should.be.bignumber.equal(numberOfCards);
                    boosterPackAmounts[1].should.be.bignumber.equal(numberOfCards);

                    open.logs.length.should.be.equal(numberOfCards + 1);
                    assert.equal(open.logs[0]['event'], 'BoosterOpen');
                    assert.equal(open.logs[0]['args']['_owner'], accounts[1]);


                    let open2 = await this.token.openWrappedBooster(
                        0,
                        {
                            from: accounts[1],
                            gasLimit: new BigNumber('5000000'),
                            gasPrice: new BigNumber('8')
                        }
                    );

                    open2.logs.length.should.be.equal(numberOfCards + 1);
                    open2.logs[0].event.should.be.eq('BoosterOpen');
                    open2.logs[0].args._owner.should.be.equal(accounts[1]);
                    open2.logs[0].args._amount.should.be.bignumber.equal(numberOfCards);

                });
            });

            it('user can unwrap mid booster', async function () {
                // Opening at middle
                const open = await this.token.openWrappedBooster(
                    1,
                    {
                        from: accounts[0],
                        gasLimit: new BigNumber('5000000'),
                        gasPrice: new BigNumber('8')
                    }
                );

                const boosterPackAmounts = await this.token.getBoosterAmounts(accounts[0]);
                boosterPackAmounts.length.should.be.equal(2);
                boosterPackAmounts[0].should.be.bignumber.equal(numberOfCards);
                boosterPackAmounts[1].should.be.bignumber.equal(numberOfCards);

                open.logs.length.should.be.equal(numberOfCards + 1);
                assert.equal(open.logs[0]['event'], 'BoosterOpen');
                assert.equal(open.logs[0]['args']['_owner'], accounts[0]);


                await assertRevert(this.token.openWrappedBooster(
                    0,
                    {
                        from: accounts[1],
                        gasLimit: new BigNumber('5000000'),
                        gasPrice: new BigNumber('8')
                    }
                ));

                let open2 = await this.token.openWrappedBooster(
                    1,
                    {
                        from: accounts[0],
                        gasLimit: new BigNumber('5000000'),
                        gasPrice: new BigNumber('8')
                    }
                );

                open2.logs.length.should.be.equal(numberOfCards + 1);
                open2.logs[0].event.should.be.eq('BoosterOpen');
                open2.logs[0].args._owner.should.be.equal(accounts[0]);
                open2.logs[0].args._amount.should.be.bignumber.equal(numberOfCards);

            });
        });


        // TODO: New access control
    });

    */
});
