import { NextResponse } from "next/server";
import { clampInteger } from "@/lib/format";
import { searchPublicRecords } from "@/server/record-repository";

export const dynamic = "force-dynamic";

export function GET(request: Request): NextResponse {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name")?.trim() ?? "";
  const province = searchParams.get("province")?.trim() ?? "";
  const page = clampInteger(searchParams.get("page"), 1, 1, 10_000);

  if (!name) {
    return NextResponse.json(
      { error: "검색할 조상 성함을 입력해 주세요.", code: "NAME_REQUIRED" },
      { status: 400, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    searchPublicRecords({ name, province, page }),
    { headers: { "Cache-Control": "no-store" } },
  );
}
