import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ENTITLEMENT_COOKIE_NAME } from "@/lib/constants";
import {
  hasRecordEntitlement,
  readEntitlementState,
} from "@/server/entitlement-token";
import {
  getDetailedRecordById,
  getPublicRecordById,
} from "@/server/record-repository";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
): Promise<NextResponse> {
  const { id } = await context.params;
  const publicRecord = getPublicRecordById(id);

  if (!publicRecord) {
    return NextResponse.json(
      { error: "기록을 찾을 수 없습니다.", code: "RECORD_NOT_FOUND" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  const cookieStore = await cookies();
  const state = readEntitlementState(
    cookieStore.get(ENTITLEMENT_COOKIE_NAME)?.value,
  );

  if (!hasRecordEntitlement(state, id)) {
    // 미구매 응답에는 공개 정보만 포함하며, 상세 객체를 조회하지 않습니다.
    return NextResponse.json(
      {
        error: "이 기록의 상세 열람 권한이 없습니다.",
        code: "ENTITLEMENT_REQUIRED",
        record: publicRecord,
      },
      { status: 403, headers: { "Cache-Control": "no-store" } },
    );
  }

  const detailedRecord = getDetailedRecordById(id);
  if (!detailedRecord) {
    return NextResponse.json(
      { error: "상세 기록을 찾을 수 없습니다.", code: "RECORD_NOT_FOUND" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { record: detailedRecord, unlocked: true },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
