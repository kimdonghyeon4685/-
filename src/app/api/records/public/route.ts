import { NextResponse } from "next/server";
import { DEMO_NOTICE } from "@/lib/constants";
import { uniqueStrings } from "@/lib/format";
import { getPublicRecordById } from "@/server/record-repository";

export const dynamic = "force-dynamic";

export function GET(request: Request): NextResponse {
  const { searchParams } = new URL(request.url);
  const ids = uniqueStrings(
    (searchParams.get("ids") ?? "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean),
  ).slice(0, 300);

  if (ids.length === 0) {
    return NextResponse.json(
      { records: [], missingIds: [], demoNotice: DEMO_NOTICE },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const records = ids
    .map((id) => getPublicRecordById(id))
    .filter((record) => record !== null);
  const foundIds = new Set(records.map((record) => record.id));
  const missingIds = ids.filter((id) => !foundIds.has(id));

  // 이 응답에는 village, parcelNumber, exactLocation 등 유료 필드가
  // 타입과 직렬화 단계 모두에서 존재하지 않습니다.
  return NextResponse.json(
    { records, missingIds, demoNotice: DEMO_NOTICE },
    { headers: { "Cache-Control": "no-store" } },
  );
}
