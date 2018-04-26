import assertRevert from '../tools/helpers/assertRevert';

const LockableMock = artifacts.require('LockableMock');

contract('Lockable', function (accounts) {
    let Lockable;

    beforeEach(async function () {
        Lockable = await LockableMock.new({from: accounts[0]});
    });

    it('can perform normal process in non-lock', async function () {
        let count0 = await Lockable.count();
        assert.equal(count0, 0);

        await Lockable.normalProcess();
        let count1 = await Lockable.count();
        assert.equal(count1, 1);
    });

    it('can not perform normal process in lock', async function () {
        await Lockable.lock({from: accounts[0]});
        let count0 = await Lockable.count();
        assert.equal(count0, 0);

        await assertRevert(Lockable.normalProcess());
        let count1 = await Lockable.count();
        assert.equal(count1, 0);
    });
});
