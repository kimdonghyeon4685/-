import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, ShieldIcon } from "@/components/icons";
import { PurchaseCard } from "@/components/records/purchase-card";
import { getCurrentEntitlementState } from "@/server/current-entitlements";
import { getPublicRecordsByIds } from "@/server/record-repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "테스트 결제 완료",
};

export default async function CheckoutSuccessPage() {
  const state = await getCurrentEntitlementState();
  const latestPurchase = state.purchases[0];

  if (!latestPurchase) {
    return (
      <div className="page-shell">
        <div className="container narrow-page">
          <div className="empty-state empty-state--large">
            <ShieldIcon />
            <p className="eyebrow">NO RECENT PURCHASE</p>
            <h1>최근 테스트 결제 내역이 없습니다.</h1>
            <p>기록을 선택해 테스트 결제 흐름을 진행해 주세요.</p>
            <Link className="button button--primary" href="/search?name=김동현">
              기록 검색하기
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const records = getPublicRecordsByIds(latestPurchase.recordIds);

  return (
    <div className="page-shell success-page">
      <div className="container narrow-page">
        <section className="success-hero">
          <span className="success-hero__check">
            <CheckIcon />
          </span>
          <p className="eyebrow">MOCK PAYMENT SUCCESS</p>
          <h1>테스트 결제가 완료되었습니다.</h1>
          <p>
            선택한 기록의 서버 열람 권한이 생성되었습니다. 아래 기록에 한해 정확한
            리·지번과 상세정보를 확인할 수 있습니다.
          </p>
        </section>

        <PurchaseCard featured purchase={latestPurchase} records={records} />

        <div className="success-page__actions">
          <Link className="button button--primary" href="/my">
            내 열람 기록 전체 보기
            <ArrowRightIcon />
          </Link>
          <Link className="button button--secondary" href="/search?name=김동현">
            기록 더 검색하기
          </Link>
        </div>
        <div className="info-note">
          <ShieldIcon />
          <p>
            <strong>프로토타입 안내</strong>
            현재 구매 권한은 서버 메모리와 서명된 DEMO 세션 쿠키로 관리됩니다. 개발 서버를
            재시작하면 초기화될 수 있으며, 실제 서비스에서는 사용자 계정과 PostgreSQL 권한
            테이블로 대체합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
