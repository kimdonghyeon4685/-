import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DEMO_NOTICE, ENTITLEMENT_COOKIE_NAME } from "@/lib/constants";
import { readEntitlementState } from "@/server/entitlement-token";
import { getPublicRecordsByIds } from "@/server/record-repository";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const state = readEntitlementState(
    cookieStore.get(ENTITLEMENT_COOKIE_NAME)?.value,
  );

  const purchases = state.purchases.map((purchase) => ({
    ...purchase,
    records: getPublicRecordsByIds(purchase.recordIds),
  }));

  return NextResponse.json(
    {
      purchases,
      unlockedRecordIds: state.unlockedRecordIds,
      demoNotice: DEMO_NOTICE,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
