import Link from "next/link";
import {
  ArchiveIcon,
  ArrowRightIcon,
  CheckIcon,
  LockIcon,
  ShieldIcon,
} from "@/components/icons";
import { SearchForm } from "@/components/search/search-form";
import { DEFAULT_SEARCH_NAME, UNIT_PRICE } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/format";
import {
  getDemoDatasetStats,
  searchPublicRecords,
} from "@/server/record-repository";

export default function HomePage() {
  const stats = getDemoDatasetStats();
  const previewRecords = searchPublicRecords({
    name: DEFAULT_SEARCH_NAME,
    pageSize: 4,
  }).records;

  return (
    <>
      <section className="home-hero">
        <div className="container home-hero__inner">
          <div className="home-hero__copy">
            <p className="section-label">조상토지기록 검색</p>
            <h1>조상 이름으로 옛 토지 기록을 찾아보세요.</h1>
            <p className="home-hero__description">
              토지조사부와 임야조사부에 남은 성명 색인을 검색할 수 있습니다. 먼저 지역과
              연도를 비교하고, 관련 가능성이 높은 기록만 골라 상세정보를 확인하세요.
            </p>
            <ul className="home-hero__principles" aria-label="서비스 이용 요약">
              <li><CheckIcon />이름 검색은 무료입니다</li>
              <li><CheckIcon />필요한 기록만 선택합니다</li>
              <li><CheckIcon />상세 열람료는 1건당 {formatCurrency(UNIT_PRICE)}입니다</li>
            </ul>
          </div>

          <div className="hero-search-card">
            <div className="hero-search-card__heading">
              <div>
                <p className="section-label">기록 검색</p>
                <h2>찾으려는 분의 성함을 입력하세요.</h2>
              </div>
            </div>
            <p className="hero-search-card__example">
              체험을 위해 예시 이름 <strong>{DEFAULT_SEARCH_NAME}</strong>이 입력되어 있습니다.
            </p>
            <SearchForm defaultName={DEFAULT_SEARCH_NAME} />
            <div className="hero-search-card__footnote">
              <ShieldIcon />
              <p>
                무료 검색에서는 기록번호와 대략적인 지역만 확인할 수 있습니다.
                <strong>정확한 리·지번은 선택한 기록을 결제한 뒤에만 열립니다.</strong>
              </p>
            </div>
          </div>
        </div>
        <div className="container home-dataset-note">
          <ArchiveIcon />
          <p>
            현재 체험판에는 <strong>{formatNumber(stats.totalRecords)}건</strong>의 DEMO 기록이
            준비되어 있습니다. 실제 인물이나 실제 토지 권리와는 관계가 없습니다.
          </p>
        </div>
      </section>

      <section className="section section--scope">
        <div className="container research-scope">
          <div className="research-scope__heading">
            <p className="section-label">검색 전에 확인하세요</p>
            <h2>같은 이름은 중요한 단서지만, 권리를 증명하지는 않습니다.</h2>
            <p>
              이 서비스는 흩어진 역사 기록에서 조사할 후보를 찾는 출발점입니다. 동일인
              여부와 현재 권리관계는 관련 원문과 공적 장부를 별도로 확인해야 합니다.
            </p>
            <Link className="text-link" href="/guide#notice">
              자료 이용 주의사항 보기
              <ArrowRightIcon />
            </Link>
          </div>
          <div className="research-scope__cards">
            <article>
              <p>검색으로 확인할 수 있는 내용</p>
              <h3>당시 기록에 남은 이름과 지역 단서</h3>
              <ul>
                <li><CheckIcon />기록번호와 성명 색인</li>
                <li><CheckIcon />도·군·면 단위의 대략적인 지역</li>
                <li><CheckIcon />자료의 종류와 기록연도</li>
              </ul>
            </article>
            <article className="research-scope__card--caution">
              <p>별도로 확인해야 하는 내용</p>
              <h3>동일인 여부와 현재 소유권</h3>
              <ul>
                <li>동명이인 여부와 가족관계</li>
                <li>행정구역 변경과 지번 변동</li>
                <li>현재 소유권과 기타 권리상태</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section section--process">
        <div className="container process-layout">
          <div className="archive-section-heading">
            <p className="section-label">이용 순서</p>
            <h2>검색하고, 비교하고, 필요한 기록만 확인합니다.</h2>
            <p>
              검색결과 전체를 구매할 필요가 없습니다. 지역과 연도를 비교한 뒤 관련 있어
              보이는 기록만 선택하세요.
            </p>
          </div>
          <ol className="process-list">
            <li>
              <span>1</span>
              <div>
                <h3>성함으로 무료 검색</h3>
                <p>조상 성함을 입력하고 필요하면 도 단위 지역을 함께 선택합니다.</p>
              </div>
            </li>
            <li>
              <span>2</span>
              <div>
                <h3>지역과 연도 비교</h3>
                <p>기록번호, 군·면, 자료구분과 연도를 보고 관련 가능성을 판단합니다.</p>
              </div>
            </li>
            <li>
              <span>3</span>
              <div>
                <h3>선택한 기록만 상세 열람</h3>
                <p>결제가 끝난 기록에 한해 정확한 리·지번과 상세정보가 열립니다.</p>
              </div>
            </li>
          </ol>
          <div className="pricing-note">
            <span>기록 1건 상세 열람료</span>
            <strong>{formatCurrency(UNIT_PRICE)}</strong>
            <p>선택한 기록 수에 따라 결제 전에 총액을 정확히 안내합니다.</p>
          </div>
        </div>
      </section>

      <section className="section section--records-preview">
        <div className="container records-preview">
          <header className="records-preview__heading">
            <div>
              <p className="section-label">검색결과 미리보기</p>
              <h2>장식보다 기록을 먼저 보여드립니다.</h2>
            </div>
            <p>
              같은 이름이라도 지역과 연도가 다를 수 있습니다. 아래처럼 공개된 항목을 먼저
              비교한 뒤 상세 열람 여부를 결정합니다.
            </p>
          </header>

          <div className="records-preview__table" role="table" aria-label="DEMO 검색결과 예시">
            <div className="records-preview__row records-preview__row--head" role="row">
              <span role="columnheader">기록번호</span>
              <span role="columnheader">지역</span>
              <span role="columnheader">자료구분</span>
              <span role="columnheader">연도</span>
              <span role="columnheader">상세 위치</span>
            </div>
            {previewRecords.map((record) => (
              <div className="records-preview__row" key={record.id} role="row">
                <strong role="cell">{record.recordNumber}</strong>
                <span role="cell">{record.province} {record.county} {record.town ?? ""}</span>
                <span role="cell">{record.sourceType}</span>
                <span role="cell">{record.recordYear ?? "연도 미상"}</span>
                <span className="records-preview__locked" role="cell">
                  <LockIcon />결제 후 공개
                </span>
              </div>
            ))}
          </div>

          <div className="records-preview__footer">
            <p>위 내용은 기능 체험을 위해 만든 DEMO 기록입니다.</p>
            <Link className="button button--primary" href={`/search?name=${DEFAULT_SEARCH_NAME}`}>
              {DEFAULT_SEARCH_NAME} 예시 검색 보기
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--cta">
        <div className="container final-cta">
          <div>
            <p className="section-label">기록 찾기 시작</p>
            <h2>조상 성함을 알고 있다면 지금 검색해 보세요.</h2>
            <p>검색은 무료이며, 상세정보가 필요한 기록만 선택할 수 있습니다.</p>
          </div>
          <Link className="button button--primary" href={`/search?name=${DEFAULT_SEARCH_NAME}`}>
            무료 검색 시작
            <ArrowRightIcon />
          </Link>
        </div>
      </section>
    </>
  );
}
