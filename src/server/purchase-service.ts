import "server-only";

import { randomBytes } from "node:crypto";
import { UNIT_PRICE } from "@/lib/constants";
import { uniqueStrings } from "@/lib/format";
import type { MockPurchase } from "@/lib/types";
import { recordExists } from "@/server/record-repository";

export class PurchaseValidationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "PurchaseValidationError";
  }
}

export function createMockPurchase(recordIdsInput: string[]): MockPurchase {
  const recordIds = uniqueStrings(
    recordIdsInput.map((id) => id.trim()).filter(Boolean),
  );

  if (recordIds.length === 0) {
    throw new PurchaseValidationError(
      "열람할 기록을 1건 이상 선택해 주세요.",
      "EMPTY_SELECTION",
    );
  }

  const invalidIds = recordIds.filter((id) => !recordExists(id));
  if (invalidIds.length > 0) {
    throw new PurchaseValidationError(
      "존재하지 않는 DEMO 기록이 포함되어 있습니다.",
      "INVALID_RECORD_ID",
    );
  }

  const now = new Date();
  const nonce = randomBytes(4).toString("hex").toUpperCase();
  const timestamp = now.getTime();

  return {
    id: `MOCK-ORDER-${timestamp}-${nonce}`,
    recordIds,
    unitPrice: UNIT_PRICE,
    amountTotal: recordIds.length * UNIT_PRICE,
    status: "PAID",
    paidAt: now.toISOString(),
    paymentKey: `MOCK-PAYMENT-${nonce}`,
  };
}
