const path = require('path');
const { Runner } = require('near-runner');

describe('counter contract', () => {
  let runner;
  jest.setTimeout(60_000);

  beforeAll(async () => {
    runner = await Runner.create(async ({ root }) => {
      const grainbot = await root.createAccount('grainbot');
      const contract = await root.createAndDeploy(
        'grain-near-simple-counter',
        path.join(__dirname, '..', 'index.gr.wasm'),
      );

      return { grainbot, contract };
    });
  });

  test('increments & decrements', async () => {
    await runner.run(async ({ grainbot, contract }) => {
      await grainbot.call(contract, 'increment', {});
      await grainbot.call(contract, 'increment', {});
      await grainbot.call(contract, 'decrement', {});
      /* Should print:
         ContractState {
           data: Map(1) { '\x00\x00\x00\x00\x00\x00\x00\x00' => <Buffer 01 00 00 00> }
         }
      */
      console.log(await contract.viewState());
    });
  });
});
