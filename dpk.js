const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

const createHash = (input) => {
  return crypto.createHash("sha3-512").update(input).digest("hex");
};

const deterministicPartitionKey = (event) => {
  // If event.partitionKey is available and length > MAX_PARTITION_LENGTH
  if (event?.partitionKey?.toString().length > MAX_PARTITION_KEY_LENGTH) {
    return createHash(JSON.stringify(event.partitionKey));
  }

  // If event.partitionKey is available and length <= MAX_PARTITION_LENGTH
  if (event?.partitionKey) {
    return JSON.stringify(event.partitionKey);
  }

  // If event.partitionKey is not available
  if (event) {
    return createHash(JSON.stringify(event));
  }

  // If event is not available
  return TRIVIAL_PARTITION_KEY;
};

module.exports = { deterministicPartitionKey };
