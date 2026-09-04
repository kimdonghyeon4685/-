import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRightIcon,
  ArchiveIcon,
  FileTextIcon,
  LockIcon,
  MapPinIcon,
  ShieldIcon,
  UnlockIcon,
} from "@/components/icons";
import { RecordSelectionAction } from "@/components/records/record-selection-action";
import { formatCurrency } from "@/lib/format";
import { UNIT_PRICE } from "@/lib/constants";
import { getCurrentEntitlementState } from "@/server/current-entitlements";
import { hasRecordEntitlement } from "@/server/entitlement-token";
import {
  getDetailedRecordById,
  getPublicRecordById,
} from "@/server/record-repository";

export const dynamic = "force-dynamic";

type RecordPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: RecordPageProps): Promise<Metadata> {
  const { id } = await params;
  const record = getPublicRecordById(id);

  return record
    ? {
        title: `${record.recordNumber} 기록`,
        description: `${record.name} 이름으로 색인된 DEMO 토지기록입니다.`,
      }
    : { title: "기록을 찾을 수 없음" };
}

export default async function RecordDetailPage({ params }: RecordPageProps) {
  const { id } = await params;
  const publicRecord = getPublicRecordById(id);

  if (!publicRecord) {
    notFound();
  }

  const entitlementState = await getCurrentEntitlementState();
  const isUnlocked = hasRecordEntitlement(entitlementState, id);
  // 상세 레코드는 권한 확인이 끝난 뒤에만 조회합니다.
  const detailedRecord = isUnlocked ? getDetailedRecordById(id) : null;

  return (
    <div className="page-shell record-detail-page">
      <div className="container record-detail-container">
        <nav className="breadcrumbs" aria-label="현재 위치">
          <Link href="/search?name=김동현">기록 검색</Link>
          <span>/</span>
          <span>{publicRecord.recordNumber}</span>
        </nav>

        <section className="record-detail-hero">
          <div>
            <p className="eyebrow">토지 기록 · DEMO 자료</p>
            <div className="record-detail-hero__badges">
              <span className="source-badge">{publicRecord.sourceType}</span>
              <span className={isUnlocked ? "access-badge access-badge--open" : "access-badge"}>
                {isUnlocked ? <UnlockIcon /> : <LockIcon />}
                {isUnlocked ? "열람 권한 확인됨" : "상세정보 잠김"}
              </span>
            </div>
            <h1>{publicRecord.recordNumber}</h1>
            <p>
              {publicRecord.name}
              {publicRecord.nameHanja ? ` (${publicRecord.nameHanja})` : ""} ·{" "}
              {publicRecord.recordYear ?? "연도 미상"}년 기록
            </p>
          </div>
        </section>

        <section className="record-public-card">
          <header>
            <div>
                <ArchiveIcon />
                <span>
                  <strong>무료 공개 색인정보</strong>
                  <small>무료 검색에서 확인 가능</small>
              </span>
            </div>
            <span>검색 단계 공개</span>
          </header>
          <dl className="detail-grid">
            <div>
              <dt>기록번호</dt>
              <dd>{publicRecord.recordNumber}</dd>
            </div>
            <div>
              <dt>성명</dt>
              <dd>
                {publicRecord.name}
                {publicRecord.nameHanja ? <small>{publicRecord.nameHanja}</small> : null}
              </dd>
            </div>
            <div>
              <dt>도 / 광역지역</dt>
              <dd>{publicRecord.province}</dd>
            </div>
            <div>
              <dt>군 · 면</dt>
              <dd>
                {publicRecord.county} {publicRecord.town ?? ""}
              </dd>
            </div>
            <div>
              <dt>자료구분</dt>
              <dd>{publicRecord.sourceType}</dd>
            </div>
            <div>
              <dt>기록연도</dt>
              <dd>{publicRecord.recordYear ?? "미상"}</dd>
            </div>
          </dl>
        </section>

        {isUnlocked && detailedRecord ? (
          <section className="record-private-card">
            <header>
              <div>
                <UnlockIcon />
                <span>
                  <strong>결제 후 공개 상세정보</strong>
                  <small>선택한 기록의 결제 후 공개</small>
                </span>
              </div>
              <span className="verified-label">
                <ShieldIcon /> 서버 권한 확인 완료
              </span>
            </header>
            <div className="record-location-highlight">
              <MapPinIcon />
              <div>
                <span>정확한 토지소재지 · DEMO</span>
                <strong>{detailedRecord.exactLocation}</strong>
              </div>
            </div>
            <dl className="detail-grid detail-grid--private">
              <div>
                <dt>리</dt>
                <dd>{detailedRecord.village}</dd>
              </div>
              <div>
                <dt>지번</dt>
                <dd>{detailedRecord.parcelNumber}</dd>
              </div>
              <div>
                <dt>지목</dt>
                <dd>{detailedRecord.landCategory}</dd>
              </div>
              <div>
                <dt>면적</dt>
                <dd>{detailedRecord.area}</dd>
              </div>
              <div>
                <dt>당시 행정구역</dt>
                <dd>{detailedRecord.historicalRegion}</dd>
              </div>
              <div>
                <dt>현재 행정구역 매핑</dt>
                <dd>{detailedRecord.currentRegionMapping}</dd>
              </div>
              <div className="detail-grid__wide">
                <dt>자료 출처 / 원문 식별정보</dt>
                <dd>{detailedRecord.sourceReference}</dd>
              </div>
              <div className="detail-grid__wide">
                <dt>원문 자료</dt>
                <dd>{detailedRecord.originalMaterialStatus}</dd>
              </div>
            </dl>
            <div className="record-private-card__notice">
              <FileTextIcon />
              <p>
                이 상세정보는 기능 검증용으로 생성한 DEMO 값입니다. 실제 인물·토지·지번 또는
                현재 소유권과 관계가 없습니다.
              </p>
            </div>
          </section>
        ) : (
          <section className="locked-detail-card">
            <div className="locked-detail-card__visual" aria-hidden="true">
              <LockIcon />
            </div>
            <div>
              <p className="eyebrow">결제 후 상세 열람 가능</p>
              <h2>정확한 리·지번과 상세정보는 아직 잠겨 있습니다.</h2>
              <p>
                화면 뒤에 상세정보를 숨겨둔 것이 아닙니다. 구매 여부가 확인되기 전에는
                상세 데이터 자체가 이 페이지에 전달되지 않습니다.
              </p>
              <div className="locked-detail-card__fields">
                <span>리</span>
                <span>지번</span>
                <span>지목</span>
                <span>면적</span>
                <span>출처 식별정보</span>
              </div>
              <div className="locked-detail-card__actions">
                <RecordSelectionAction recordId={publicRecord.id} />
                <span>기록 1건 열람료 {formatCurrency(UNIT_PRICE)}</span>
              </div>
            </div>
          </section>
        )}

        <div className="record-detail-footer-actions">
          <Link href="/my">내 열람 기록</Link>
          <Link href={`/search?name=${encodeURIComponent(publicRecord.name)}`}>
            같은 성명 기록 더 보기
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
