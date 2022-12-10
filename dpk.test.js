const { deterministicPartitionKey } = require("./dpk");
const crypto = require("crypto");

jest.setTimeout(30000);

const smallPartitionEvents = [
  {
    partitionKey: 1235,
  },
  {
    partitionKey: { a: 1, b: 2 },
  },
  {
    partitionKey: ["1", "2", "2"],
  },
];

const largePartitionEvent = {
  partitionKey: Array.from({ length: 257 }, () => 1).join(""),
};

const randomEvent = {
  foo: "bar",
};

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no input", () => {
    const trivialKey = deterministicPartitionKey();
    expect(trivialKey).toBe("0");
  });
  it("Returns a hash 1 when given 1 as input", () => {
    const trivialKey = deterministicPartitionKey(1);
    expect(trivialKey).toBe(
      crypto.createHash("sha3-512").update(JSON.stringify(1)).digest("hex")
    );
  });
  it("Returns a hash {} when given {} as input", () => {
    const trivialKey = deterministicPartitionKey({});
    expect(trivialKey).toBe(
      crypto.createHash("sha3-512").update(JSON.stringify({})).digest("hex")
    );
  });
  it("Returns a stringified partitionKey when given event.partitionKey and stringified partionKey length <= 256 is available as input", () => {
    for (const event of smallPartitionEvents) {
      console.log("event...", event);
      const trivialKey = deterministicPartitionKey(event);
      expect(trivialKey).toBe(JSON.stringify(event.partitionKey));
    }
  });
  it("Returns a hash of partitionKey when given event.partitionKey and partionKey length > 256 is available as input", () => {
    const trivialKey = deterministicPartitionKey(largePartitionEvent);

    expect(trivialKey).toBe(
      crypto
        .createHash("sha3-512")
        .update(JSON.stringify(largePartitionEvent.partitionKey))
        .digest("hex")
    );
  });
  it("Returns a hash of the event when given no partitionKey in the event", () => {
    const trivialKey = deterministicPartitionKey(randomEvent);
    expect(trivialKey).toBe(
      crypto
        .createHash("sha3-512")
        .update(JSON.stringify(randomEvent))
        .digest("hex")
    );
  });
});
