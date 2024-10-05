[test];
import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import {
  afterAll,
  assert,
  beforeAll,
  clearStore,
  describe,
  test,
} from "matchstick-as/assembly/index";
import { handleTransfer } from "../src/dai";
import { createTransferEvent } from "./dai-utils";

describe("Describe entity assertions", () => {
  beforeAll(() => {
    // Mocking the Transfer event
    let src = Address.fromString("0x0000000000000000000000000000000000000001");
    let dst = Address.fromString("0x0000000000000000000000000000000000000002");
    let wad = BigInt.fromI32(234);

    // Create the mocked Transfer event
    let newTransferEvent = createTransferEvent(src, dst, wad);

    log.info("This transfer event id is {}", [
      newTransferEvent.transaction.hash
        .concatI32(newTransferEvent.logIndex.toI32())
        .toHex(),
    ]);
    // Handle the event (trigger the mappings)
    handleTransfer(newTransferEvent);
  });

  afterAll(() => {
    clearStore(); // Ensure the store is cleared after the tests
  });

  test("Transfer created and stored", () => {
    // Verify if one Transfer entity has been created in the store
    assert.entityCount("Transfer", 1);

    // Generate the transfer ID (transaction hash + log index)
    let transferEventId = "0xa16081f360e3847006db660bae1c6d1b2e17ec2a01000000";

    // Verify that the fields are correctly set in the Transfer entity
    assert.fieldEquals(
      "Transfer",
      transferEventId,
      "src",
      "0x0000000000000000000000000000000000000001"
    );
    assert.fieldEquals(
      "Transfer",
      transferEventId,
      "dst",
      "0x0000000000000000000000000000000000000002"
    );
    assert.fieldEquals("Transfer", transferEventId, "wad", "234");
  });
});
