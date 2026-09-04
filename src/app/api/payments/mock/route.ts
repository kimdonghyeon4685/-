import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ENTITLEMENT_COOKIE_NAME } from "@/lib/constants";
import type { MockPaymentRequest } from "@/lib/types";
import { savePurchase } from "@/server/entitlement-token";
import {
  createMockPurchase,
  PurchaseValidationError,
} from "@/server/purchase-service";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  let body: MockPaymentRequest;

  try {
    body = (await request.json()) as MockPaymentRequest;
  } catch {
    return NextResponse.json(
      { error: "결제 요청 형식이 올바르지 않습니다.", code: "INVALID_JSON" },
      { status: 400 },
    );
  }

  if (!Array.isArray(body.recordIds)) {
    return NextResponse.json(
      { error: "선택 기록 목록이 필요합니다.", code: "RECORD_IDS_REQUIRED" },
      { status: 400 },
    );
  }

  try {
    // 금액은 클라이언트가 보낸 값을 신뢰하지 않고 서버에서 다시 계산합니다.
    const purchase = createMockPurchase(body.recordIds);
    const cookieStore = await cookies();
    const saved = savePurchase(
      cookieStore.get(ENTITLEMENT_COOKIE_NAME)?.value,
      purchase,
    );

    const response = NextResponse.json(
      {
        success: true,
        purchase,
        unlockedRecordIds: saved.state.unlockedRecordIds,
      },
      { headers: { "Cache-Control": "no-store" } },
    );

    response.cookies.set({
      name: ENTITLEMENT_COOKIE_NAME,
      value: saved.token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (error) {
    if (error instanceof PurchaseValidationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400, headers: { "Cache-Control": "no-store" } },
      );
    }

    console.error("Mock payment failed", error);
    return NextResponse.json(
      { error: "테스트 결제를 처리하지 못했습니다.", code: "PAYMENT_FAILED" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
