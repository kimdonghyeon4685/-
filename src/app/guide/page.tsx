import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRightIcon,
  ArchiveIcon,
  FileTextIcon,
  SearchIcon,
  ShieldIcon,
  UnlockIcon,
} from "@/components/icons";
import { DEFAULT_SEARCH_NAME, UNIT_PRICE } from "@/lib/constants";
import { formatCurrency } from "@/lib/format";
import { searchPublicRecords } from "@/server/record-repository";

export const metadata: Metadata = {
  title: "이용안내",
  description: "조상토지기록 DEMO 서비스의 검색·선택·열람 방식을 안내합니다.",
};

export default function GuidePage() {
  const exampleRecordCount = searchPublicRecords({ name: DEFAULT_SEARCH_NAME }).total;

  return (
    <div className="page-shell guide-page">
      <div className="container guide-container">
        <section className="page-heading guide-heading">
          <p className="eyebrow">서비스 이용안내</p>
          <h1>기록을 찾기 전에 꼭 확인해 주세요.</h1>
          <p>
            조상토지기록은 과거 조사 기록의 성명 색인을 검색하고, 필요한 개별 기록만
            선택해 상세정보를 확인하는 서비스입니다. 현재 버전은 사용자 경험 검증을 위한
            DEMO 프로토타입입니다.
          </p>
        </section>

        <section className="guide-index" aria-label="이용안내 목차">
          <a href="#search">01 · 검색 방법</a>
          <a href="#pricing">02 · 과금 방식</a>
          <a href="#fields">03 · 공개 정보 범위</a>
          <a href="#notice">04 · 자료 이용 주의사항</a>
        </section>

        <div className="guide-sections">
          <section id="search">
            <header>
              <span>01</span>
              <div>
                <p className="eyebrow">검색 방법</p>
                <h2>성함 검색은 무료입니다.</h2>
              </div>
              <SearchIcon />
            </header>
            <p>
              조상 성함을 입력하면 동일 성명으로 색인된 기록을 확인할 수 있습니다. 동일한
              이름이 많을 때는 지역 필터를 사용해 도·광역지역 단위로 결과를 좁힙니다.
            </p>
            <div className="guide-callout">
              <strong>무료 검색에서 확인 가능한 항목</strong>
              <span>기록번호 · 성명 · 도 · 군 · 면 · 자료구분 · 기록연도</span>
            </div>
            <div className="research-checklist">
              <strong>기록을 고를 때 비교할 순서</strong>
              <ol>
                <li><span>1</span>조상이 생활했던 도·군·면과 일치하는지 확인</li>
                <li><span>2</span>기록연도와 자료구분으로 후보 범위를 축소</li>
                <li><span>3</span>동명이인을 고려해 관련 가능성이 높은 기록만 선택</li>
              </ol>
            </div>
          </section>

          <section id="pricing">
            <header>
              <span>02</span>
              <div>
                <p className="eyebrow">기록별 결제</p>
                <h2>선택한 기록 1건당 {formatCurrency(UNIT_PRICE)}</h2>
              </div>
              <FileTextIcon />
            </header>
            <p>
              검색 결과 전체를 일괄 구매하는 방식이 아닙니다. 관련 있어 보이는 기록의
              체크박스만 선택하면 선택 건수에 따라 총 결제금액이 실시간 계산됩니다.
            </p>
            <div className="pricing-table" role="table" aria-label="선택 건수별 가격">
              <div role="row">
                <span role="cell">1건 선택</span>
                <span role="cell">× {formatCurrency(UNIT_PRICE)}</span>
                <strong role="cell">{formatCurrency(UNIT_PRICE)}</strong>
              </div>
              <div role="row">
                <span role="cell">2건 선택</span>
                <span role="cell">× {formatCurrency(UNIT_PRICE)}</span>
                <strong role="cell">{formatCurrency(UNIT_PRICE * 2)}</strong>
              </div>
              <div role="row">
                <span role="cell">3건 선택</span>
                <span role="cell">× {formatCurrency(UNIT_PRICE)}</span>
                <strong role="cell">{formatCurrency(UNIT_PRICE * 3)}</strong>
              </div>
            </div>
          </section>

          <section id="fields">
            <header>
              <span>03</span>
              <div>
                <p className="eyebrow">공개 정보 범위</p>
                <h2>결제 전·후 정보 범위가 분리됩니다.</h2>
              </div>
              <ShieldIcon />
            </header>
            <p>
              상세정보를 화면 뒤에 흐리게 숨겨두지 않습니다. 무료 검색에는 상세 필드 자체가
              포함되지 않으며, 결제한 기록에 대해서만 구매 여부를 확인한 뒤 별도로 공개합니다.
            </p>
            <div className="field-comparison">
              <article>
                <span className="field-comparison__badge">FREE / PUBLIC</span>
                <h3>
                  <ArchiveIcon /> 검색 단계
                </h3>
                <ul>
                  <li>기록번호</li>
                  <li>성명</li>
                  <li>도·군·면</li>
                  <li>자료구분</li>
                  <li>기록연도</li>
                </ul>
              </article>
              <article className="field-comparison__paid">
                <span className="field-comparison__badge">PAID / ENTITLED</span>
                <h3>
                  <UnlockIcon /> 결제 완료 기록
                </h3>
                <ul>
                  <li>리·정확한 소재지</li>
                  <li>지번</li>
                  <li>지목·면적</li>
                  <li>자료 출처·원문 식별정보</li>
                  <li>당시 행정구역</li>
                </ul>
              </article>
            </div>
          </section>

          <section id="notice">
            <header>
              <span>04</span>
              <div>
                <p className="eyebrow">중요한 안내</p>
                <h2>기록은 현재 권리상태를 보증하지 않습니다.</h2>
              </div>
              <ShieldIcon />
            </header>
            <p>
              실제 서비스의 과거 기록은 작성 시점의 자료이며 현재 소유권 또는 권리관계와
              다를 수 있습니다. 상용화 전에는 데이터 출처·이용권한·개인정보·전자상거래 관련
              법률과 환불 정책을 별도로 검토해야 합니다.
            </p>
            <div className="legal-notice">
              <strong>현재 프로토타입의 모든 데이터는 허구의 DEMO입니다.</strong>
              실제 인물, 실제 토지소유정보, 실제 지번 또는 권리관계로 오해해서는 안 됩니다.
            </div>
          </section>
        </div>

        <section className="guide-cta">
          <div>
            <p className="eyebrow">검색 시작</p>
            <h2>이용 방식을 확인하셨나요?</h2>
            <p>
              {DEFAULT_SEARCH_NAME} 이름으로 준비된 {exampleRecordCount}건의 DEMO 검색 흐름을
              바로 확인할 수 있습니다.
            </p>
          </div>
          <Link
            className="button button--light"
            href={`/search?name=${encodeURIComponent(DEFAULT_SEARCH_NAME)}`}
          >
            무료 검색 시작
            <ArrowRightIcon />
          </Link>
        </section>
      </div>
    </div>
  );
}
