import Link from "next/link";
import {
  ArchiveIcon,
  ArrowRightIcon,
  CheckIcon,
  FileTextIcon,
  SearchIcon,
  ShieldIcon,
  UnlockIcon,
} from "@/components/icons";
import { SearchForm } from "@/components/search/search-form";
import { SectionHeading } from "@/components/ui/section-heading";
import { DEFAULT_SEARCH_NAME, UNIT_PRICE } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/format";
import { getDemoDatasetStats } from "@/server/record-repository";

export default function HomePage() {
  const stats = getDemoDatasetStats();

  return (
    <>
      <section className="home-hero">
        <div className="home-hero__texture" aria-hidden="true" />
        <div className="container home-hero__inner">
          <div className="home-hero__copy">
            <p className="eyebrow">HISTORICAL LAND RECORDS · RESEARCH ARCHIVE</p>
            <h1>
              이어진 이름에서,
              <br />
              <span>기록의 좌표</span>를 찾습니다.
            </h1>
            <p className="home-hero__description">
              과거 토지조사·임야조사 기록에서 조상 성함을 무료로 검색하고,
              관련 있어 보이는 기록만 골라 상세 리·지번을 열람하세요.
            </p>
            <div className="home-hero__principles">
              <span>
                <CheckIcon /> 성함 검색 무료
              </span>
              <span>
                <CheckIcon /> 원하는 기록만 선택
              </span>
              <span>
                <CheckIcon /> 1건당 {formatCurrency(UNIT_PRICE)}
              </span>
            </div>
          </div>

          <div className="hero-search-card">
            <div className="hero-search-card__heading">
              <div>
                <p>ANCESTOR NAME INDEX</p>
                <h2>조상 성함으로 기록 찾기</h2>
              </div>
              <span aria-hidden="true">SEARCH / 01</span>
            </div>
            <SearchForm defaultName={DEFAULT_SEARCH_NAME} />
            <div className="hero-search-card__footnote">
              <ShieldIcon />
              <p>
                검색 단계에서는 기록번호와 대략 지역만 공개됩니다.
                <strong>정확한 리·지번은 결제 전 서버 응답에 포함되지 않습니다.</strong>
              </p>
            </div>
          </div>

          <div className="home-hero__stats" aria-label="DEMO 데이터 현황">
            <div>
              <strong>{formatNumber(stats.totalRecords)}+</strong>
              <span>DEMO RECORDS</span>
            </div>
            <div>
              <strong>{stats.provinces}</strong>
              <span>REGIONS</span>
            </div>
            <div>
              <strong>{stats.sourceTypes}</strong>
              <span>SOURCE TYPES</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--process">
        <div className="container">
          <SectionHeading
            align="center"
            description="전체 검색결과를 일괄 구매하지 않습니다. 관련 있어 보이는 개별 기록만 선택해 열람하는 방식입니다."
            eyebrow="HOW IT WORKS"
            title="검색부터 상세 열람까지, 세 단계로 명확하게"
          />
          <div className="process-grid">
            <article>
              <span className="process-grid__number">01</span>
              <div className="process-grid__icon">
                <SearchIcon />
              </div>
              <h3>성함 무료 검색</h3>
              <p>조상 성함과 선택 지역으로 기록번호·도·군·면·자료구분을 확인합니다.</p>
            </article>
            <article>
              <span className="process-grid__number">02</span>
              <div className="process-grid__icon">
                <FileTextIcon />
              </div>
              <h3>필요한 기록만 선택</h3>
              <p>체크박스로 원하는 기록을 고르면 선택 건수와 총액이 즉시 계산됩니다.</p>
            </article>
            <article>
              <span className="process-grid__number">03</span>
              <div className="process-grid__icon">
                <UnlockIcon />
              </div>
              <h3>결제한 기록만 공개</h3>
              <p>테스트 결제 완료 후 해당 record_id의 리·지번·상세정보만 열립니다.</p>
            </article>
          </div>
          <div className="pricing-equation" aria-label="기록별 가격 예시">
            <div>
              <small>1 RECORD</small>
              <strong>1건</strong>
            </div>
            <span>×</span>
            <div>
              <small>UNIT PRICE</small>
              <strong>{formatCurrency(UNIT_PRICE)}</strong>
            </div>
            <span>=</span>
            <div className="pricing-equation__total">
              <small>YOUR TOTAL</small>
              <strong>선택 건수만큼</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--archive">
        <div className="container archive-feature">
          <div className="archive-feature__visual" aria-hidden="true">
            <div className="archive-sheet archive-sheet--back">
              <span>土地調査簿</span>
            </div>
            <div className="archive-sheet archive-sheet--front">
              <header>
                <span>DEMO ARCHIVE</span>
                <strong>土地記錄</strong>
              </header>
              <div className="archive-sheet__lines" />
              <div className="archive-sheet__seal">模</div>
            </div>
          </div>
          <div className="archive-feature__copy">
            <p className="eyebrow">DESIGNED FOR TRUST</p>
            <h2>낡은 검색 사이트가 아닌,<br />신뢰할 수 있는 기록 아카이브</h2>
            <p>
              정보 밀도는 유지하되 오래된 관공서형 화면은 피했습니다. 검색 결과의 무료 정보와
              결제 후 열리는 상세정보를 시각적·기술적으로 명확히 구분합니다.
            </p>
            <ul className="feature-list">
              <li>
                <ArchiveIcon />
                <span>
                  <strong>정돈된 역사 기록 인덱스</strong>
                  PC 테이블과 모바일 카드로 동일한 기록을 쉽게 비교합니다.
                </span>
              </li>
              <li>
                <ShieldIcon />
                <span>
                  <strong>상세정보 서버 분리</strong>
                  CSS blur가 아니라 구매 권한 전에는 상세 필드를 응답하지 않습니다.
                </span>
              </li>
            </ul>
            <Link className="text-link" href="/guide">
              자료 성격과 이용방법 자세히 보기
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--cta">
        <div className="container final-cta">
          <div>
            <p className="eyebrow">BEGIN YOUR RESEARCH</p>
            <h2>조상 성함으로 첫 기록을 찾아보세요.</h2>
            <p>검색은 무료이며, 열람이 필요한 개별 기록만 선택할 수 있습니다.</p>
          </div>
          <Link className="button button--light" href={`/search?name=${DEFAULT_SEARCH_NAME}`}>
            {DEFAULT_SEARCH_NAME} DEMO 검색 시작
            <ArrowRightIcon />
          </Link>
        </div>
      </section>
    </>
  );
}
