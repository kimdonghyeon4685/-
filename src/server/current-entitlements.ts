import "server-only";

import { cookies } from "next/headers";
import { ENTITLEMENT_COOKIE_NAME } from "@/lib/constants";
import {
  readEntitlementState,
  type EntitlementState,
} from "@/server/entitlement-token";

export async function getCurrentEntitlementState(): Promise<EntitlementState> {
  const cookieStore = await cookies();
  return readEntitlementState(
    cookieStore.get(ENTITLEMENT_COOKIE_NAME)?.value,
  );
}
