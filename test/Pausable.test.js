import assertRevert from '../tools/helpers/assertRevert';

const PausableMock = artifacts.require('PausableMock');

contract('Pausable', function (accounts) {
    let Pausable;

    beforeEach(async function () {
        Pausable = await PausableMock.new([
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
            ]);
    });

    it('can perform normal process in non-pause', async function () {
        let count0 = await Pausable.count();
        assert.equal(count0, 0);

        await Pausable.normalProcess();
        let count1 = await Pausable.count();
        assert.equal(count1, 1);
    });

    it('can not perform normal process in pause', async function () {
        await Pausable.pause();
        let count0 = await Pausable.count();
        assert.equal(count0, 0);

        await assertRevert(Pausable.normalProcess());
        let count1 = await Pausable.count();
        assert.equal(count1, 0);
    });

    it('can not take drastic measure in non-pause', async function () {
        await assertRevert(Pausable.drasticMeasure());
        const drasticMeasureTaken = await Pausable.drasticMeasureTaken();
        assert.isFalse(drasticMeasureTaken);
    });

    it('can take a drastic measure in a pause', async function () {
        await Pausable.pause();
        await Pausable.drasticMeasure();
        let drasticMeasureTaken = await Pausable.drasticMeasureTaken();

        assert.isTrue(drasticMeasureTaken);
    });

    it('should resume allowing normal process after pause is over', async function () {
        await Pausable.pause();
        await Pausable.unpause();
        await Pausable.normalProcess();
        let count0 = await Pausable.count();

        assert.equal(count0, 1);
    });

    it('should prevent drastic measure after pause is over', async function () {
        await Pausable.pause();
        await Pausable.unpause();

        await assertRevert(Pausable.drasticMeasure());

        const drasticMeasureTaken = await Pausable.drasticMeasureTaken();
        assert.isFalse(drasticMeasureTaken);
    });
});
