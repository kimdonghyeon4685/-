import type { Metadata } from "next";
import {
  DatabaseIcon,
  FileTextIcon,
  ReceiptIcon,
  SearchIcon,
  ShieldIcon,
} from "@/components/icons";
import { DEFAULT_SEARCH_NAME } from "@/lib/constants";
import { formatNumber } from "@/lib/format";
import {
  getDemoDatasetStats,
  searchPublicRecords,
} from "@/server/record-repository";

export const metadata: Metadata = {
  title: "관리자 프로토타입",
};

export default function AdminPage() {
  const stats = getDemoDatasetStats();
  const exampleRecordCount = searchPublicRecords({ name: DEFAULT_SEARCH_NAME }).total;

  return (
    <div className="page-shell admin-page">
      <div className="container admin-container">
        <section className="page-heading page-heading--split">
          <div>
            <p className="eyebrow">ADMIN CONSOLE · PROTOTYPE</p>
            <h1>운영 준비 현황</h1>
            <p>
              Phase 1에서는 DEMO 데이터셋과 테스트 결제 흐름을 확인합니다. 데이터 업로드,
              사용자 관리, 환불 및 통계 기능은 Phase 2 연동 대상입니다.
            </p>
          </div>
          <span className="prototype-label">READ-ONLY MOCK</span>
        </section>

        <div className="admin-stats">
          <article>
            <DatabaseIcon />
            <span>DEMO 레코드</span>
            <strong>{formatNumber(stats.totalRecords)}</strong>
            <small>메모리 기반 생성 데이터</small>
          </article>
          <article>
            <SearchIcon />
            <span>색인 성명</span>
            <strong>{stats.uniqueNames}</strong>
            <small>
              {DEFAULT_SEARCH_NAME} {formatNumber(exampleRecordCount)}건 포함
            </small>
          </article>
          <article>
            <FileTextIcon />
            <span>자료 구분</span>
            <strong>{stats.sourceTypes}</strong>
            <small>토지·임야·대조기록</small>
          </article>
          <article>
            <ReceiptIcon />
            <span>결제 연동</span>
            <strong>MOCK</strong>
            <small>Toss Payments 미연결</small>
          </article>
        </div>

        <section className="admin-panel">
          <header>
            <div>
              <p className="eyebrow">INTEGRATION ROADMAP</p>
              <h2>Production 전환 체크포인트</h2>
            </div>
            <span>PHASE 2</span>
          </header>
          <div className="admin-roadmap">
            <article>
              <span>01</span>
              <div>
                <strong>파트너 샘플 데이터 확보</strong>
                <p>Excel·CSV·DB 등 원본 형태와 20~100건 샘플을 확인합니다.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <strong>Supabase / PostgreSQL 스키마 확정</strong>
                <p>land_records, purchases, purchase_items와 검색 인덱스를 구성합니다.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <strong>회원·결제·권한 영구 저장</strong>
                <p>인증 사용자와 Toss Payments 결제 결과를 서버에서 검증해 연결합니다.</p>
              </div>
            </article>
            <article>
              <span>04</span>
              <div>
                <strong>법적·운영 정책 반영</strong>
                <p>이용권한, 개인정보, 환불, 면책 및 현재 권리상태 안내를 확정합니다.</p>
              </div>
            </article>
          </div>
        </section>

        <div className="info-note">
          <ShieldIcon />
          <p>
            <strong>관리자 기능 미연결</strong>
            이 화면은 정보 구조 확인용입니다. 현재 데이터 추가·삭제, 결제 취소, 사용자 관리
            기능은 동작하지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
}
