const path = require('path');
const { Runner } = require('near-runner');

const runner = Runner.create(async ({ root }) => ({
    contract:  await root.createAndDeploy(
      'grain-near-simple-counter',
      path.join(__dirname, '..', 'index.gr.wasm'))
    }));

describe('counter contract', () => {
  jest.setTimeout(60_000);

  test.concurrent('increments & decrements', async () => {
    await runner.run(async ({ root, contract }) => {
      await root.call(contract, 'increment', {});
      await root.call(contract, 'increment', {});
      await root.call(contract, 'decrement', {});
      await root.call(contract, 'increment', {});

      await root.call(contract, 'increment', {});

      await root.call(contract, 'increment', {});

      console.log(await contract.view('getCounter'))
      /* Should print:
         ContractState {
           data: Map(1) { '\x00\x00\x00\x00\x00\x00\x00\x00' => <Buffer 01 00 00 00> }
         }
      */
      console.log(await contract.viewState());
    });
  });

});
