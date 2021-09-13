const path = require("path");
const { Runner } = require("near-runner");

const runner = Runner.create(async ({ root }) => ({
  contract: await root.createAndDeploy(
    "grain-near-simple-counter",
    path.join(__dirname, "..", "index.gr.wasm")
  ),
}));

describe("counter contract", () => {
  jest.setTimeout(60_000);

  test.concurrent("increments & decrements", async () => {
    await runner.run(async ({ root, contract }) => {
      await root.call(contract, "increment", {});
      await root.call(contract, "increment", {});
      await root.call(contract, "decrement", {});
      await root.call(contract, "increment", {});

      await root.call(contract, "increment", {});

      await root.call(contract, "increment", {});

      expect(await contract.view("getCounter")).toEqual("4");
    });
  });
});
