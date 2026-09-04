import "server-only";

import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { MockPurchase } from "@/lib/types";

export type EntitlementState = {
  version: 1;
  unlockedRecordIds: string[];
  purchases: MockPurchase[];
};

type SessionStore = Map<string, EntitlementState>;

type SessionReference = {
  sessionId: string;
  token: string;
};

declare global {
  var __ALR_DEMO_SESSION_STORE__: SessionStore | undefined;
}

const EMPTY_STATE: EntitlementState = {
  version: 1,
  unlockedRecordIds: [],
  purchases: [],
};

const sessionStore =
  globalThis.__ALR_DEMO_SESSION_STORE__ ?? new Map<string, EntitlementState>();

globalThis.__ALR_DEMO_SESSION_STORE__ = sessionStore;

function getSigningSecret(): string {
  return (
    process.env.MOCK_PAYMENT_SECRET?.trim() ||
    "development-only-mock-payment-secret-change-before-deploy"
  );
}

function sign(sessionId: string): string {
  return createHmac("sha256", getSigningSecret())
    .update(sessionId)
    .digest("base64url");
}

function createSessionToken(sessionId: string): string {
  return `${sessionId}.${sign(sessionId)}`;
}

function parseSessionId(token?: string): string | null {
  if (!token) {
    return null;
  }

  const [sessionId, signature] = token.split(".");
  if (!sessionId || !signature) {
    return null;
  }

  const expectedSignature = sign(sessionId);
  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature);

  if (
    expectedBuffer.length !== receivedBuffer.length ||
    !timingSafeEqual(expectedBuffer, receivedBuffer)
  ) {
    return null;
  }

  return sessionId;
}

function createSession(): SessionReference {
  const sessionId = randomBytes(18).toString("base64url");
  sessionStore.set(sessionId, {
    ...EMPTY_STATE,
    unlockedRecordIds: [],
    purchases: [],
  });

  return {
    sessionId,
    token: createSessionToken(sessionId),
  };
}

function getOrCreateSession(token?: string): SessionReference {
  const parsedSessionId = parseSessionId(token);

  if (parsedSessionId && sessionStore.has(parsedSessionId)) {
    return {
      sessionId: parsedSessionId,
      token: createSessionToken(parsedSessionId),
    };
  }

  return createSession();
}

export function readEntitlementState(token?: string): EntitlementState {
  const sessionId = parseSessionId(token);
  if (!sessionId) {
    return { ...EMPTY_STATE, unlockedRecordIds: [], purchases: [] };
  }

  const state = sessionStore.get(sessionId);
  return state
    ? {
        ...state,
        unlockedRecordIds: [...state.unlockedRecordIds],
        purchases: [...state.purchases],
      }
    : { ...EMPTY_STATE, unlockedRecordIds: [], purchases: [] };
}

export function savePurchase(
  token: string | undefined,
  purchase: MockPurchase,
): { token: string; state: EntitlementState } {
  const session = getOrCreateSession(token);
  const current = sessionStore.get(session.sessionId) ?? EMPTY_STATE;
  const nextState: EntitlementState = {
    version: 1,
    unlockedRecordIds: [
      ...new Set([...current.unlockedRecordIds, ...purchase.recordIds]),
    ],
    // 프로토타입 세션 메모리 사용량을 제한합니다.
    // Production에서는 purchases / purchase_items 테이블로 교체합니다.
    purchases: [purchase, ...current.purchases].slice(0, 20),
  };

  sessionStore.set(session.sessionId, nextState);

  return {
    token: session.token,
    state: {
      ...nextState,
      unlockedRecordIds: [...nextState.unlockedRecordIds],
      purchases: [...nextState.purchases],
    },
  };
}

export function hasRecordEntitlement(
  state: EntitlementState,
  recordId: string,
): boolean {
  return state.unlockedRecordIds.includes(recordId);
}
