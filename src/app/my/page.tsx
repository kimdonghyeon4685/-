import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, ArchiveIcon, ShieldIcon } from "@/components/icons";
import { PurchaseCard } from "@/components/records/purchase-card";
import { getCurrentEntitlementState } from "@/server/current-entitlements";
import { getPublicRecordsByIds } from "@/server/record-repository";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "내 열람 기록",
  description: "테스트 결제로 열람 권한을 얻은 DEMO 기록을 다시 확인합니다.",
};

export default async function MyRecordsPage() {
  const state = await getCurrentEntitlementState();

  return (
    <div className="page-shell my-page">
      <div className="container narrow-page">
        <section className="page-heading page-heading--split">
          <div>
            <p className="eyebrow">내 기록 보관함</p>
            <h1>내 열람 기록</h1>
            <p>
              이 브라우저의 DEMO 세션에서 테스트 결제를 완료한 기록을 다시 열람합니다.
            </p>
          </div>
          <div className="page-heading__metric">
            <strong>{state.unlockedRecordIds.length}</strong>
            <span>열람 가능한 기록</span>
          </div>
        </section>

        {state.purchases.length > 0 ? (
          <div className="purchase-list">
            {state.purchases.map((purchase) => (
              <PurchaseCard
                key={purchase.id}
                purchase={purchase}
                records={getPublicRecordsByIds(purchase.recordIds)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state empty-state--large">
            <ArchiveIcon />
            <p className="eyebrow">보관된 기록 없음</p>
            <h2>아직 열람한 기록이 없습니다.</h2>
            <p>성함을 무료로 검색하고 관련 있어 보이는 기록만 선택해 보세요.</p>
            <Link className="button button--primary" href="/search?name=김동현">
              DEMO 기록 검색하기
              <ArrowRightIcon />
            </Link>
          </div>
        )}

        <div className="info-note">
          <ShieldIcon />
          <p>
            <strong>DEMO 세션 보관 방식</strong>
            로그인 기능이 없는 1차 프로토타입이므로 현재 구매 내역은 개발 서버의 임시 세션에
            저장됩니다. 실제 서비스에서는 사용자 계정과 영구 DB에 결제·열람 권한을 저장합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
