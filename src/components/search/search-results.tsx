"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import type { ChangeEvent } from "react";
import {
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  LockIcon,
  TrashIcon,
} from "@/components/icons";
import { useSelection } from "@/components/selection-provider";
import { UNIT_PRICE } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { PublicLandRecord, SearchResponse } from "@/lib/types";

function createSearchHref(name: string, province: string, page = 1): string {
  const params = new URLSearchParams({ name });
  if (province) {
    params.set("province", province);
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  return `/search?${params.toString()}`;
}

function LockedLocation() {
  return (
    <span className="locked-field">
      <LockIcon />
      결제 후 리·지번 공개
    </span>
  );
}

function RecordCheckbox({
  record,
  checked,
  onChange,
}: {
  record: PublicLandRecord;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="record-checkbox" title={`${record.recordNumber} 선택`}>
      <input
        aria-label={`${record.recordNumber} 기록 선택`}
        checked={checked}
        onChange={onChange}
        type="checkbox"
      />
      <span aria-hidden="true" />
    </label>
  );
}

export function SearchResults({ response }: { response: SearchResponse }) {
  const {
    selectedSet,
    selectedCount,
    toggle,
    selectMany,
    deselectMany,
    clear,
    isReady,
  } = useSelection();
  const pageCheckboxRef = useRef<HTMLInputElement>(null);
  const currentPageIds = useMemo(
    () => response.records.map((record) => record.id),
    [response.records],
  );
  const currentPageSelectedCount = currentPageIds.filter((id) =>
    selectedSet.has(id),
  ).length;
  const filteredSelectedCount = response.matchingRecordIds.filter((id) =>
    selectedSet.has(id),
  ).length;
  const allPageSelected =
    currentPageIds.length > 0 && currentPageSelectedCount === currentPageIds.length;
  const selectedAmount = selectedCount * UNIT_PRICE;

  useEffect(() => {
    if (pageCheckboxRef.current) {
      pageCheckboxRef.current.indeterminate =
        currentPageSelectedCount > 0 && !allPageSelected;
    }
  }, [allPageSelected, currentPageSelectedCount]);

  const ctaLabel =
    selectedCount === 1
      ? `1건 선택 · ${formatCurrency(selectedAmount)} 결제하고 상세 지번 보기`
      : `${formatNumber(selectedCount)}건 선택 · ${formatCurrency(selectedAmount)} 결제하기`;

  return (
    <>
      <section className="search-summary" aria-labelledby="search-result-title">
        <div>
          <p className="eyebrow">기록 검색 결과</p>
          <h1 id="search-result-title">
            <span>‘{response.query.name}’</span> 이름으로 총 {formatNumber(response.total)}건의
            기록을 찾았습니다.
          </h1>
          <p>
            아래에는 무료 공개 정보만 표시됩니다. 정확한 리·지번과 상세 토지정보는
            선택한 기록의 테스트 결제가 완료된 뒤에만 열립니다.
          </p>
        </div>
        <div className="search-summary__stamp" aria-hidden="true">
          <strong>{formatNumber(response.total)}</strong>
          <span>검색된 기록</span>
          <small>DEMO 자료</small>
        </div>
      </section>

      <section className="filter-panel" aria-label="지역 필터">
        <div className="filter-panel__heading">
          <div>
            <strong>지역별 기록</strong>
            <span>동일 성명의 기록을 광역지역으로 좁혀보세요.</span>
          </div>
          {response.query.province ? (
            <Link href={createSearchHref(response.query.name, "")}>필터 초기화</Link>
          ) : null}
        </div>
        <div className="filter-chips">
          <Link
            aria-current={!response.query.province ? "page" : undefined}
            className={!response.query.province ? "is-active" : ""}
            href={createSearchHref(response.query.name, "")}
          >
            전체
            <span>
              {formatNumber(
                response.provinceCounts.reduce((sum, item) => sum + item.count, 0),
              )}
            </span>
          </Link>
          {response.provinceCounts.map((item) => (
            <Link
              aria-current={
                response.query.province === item.province ? "page" : undefined
              }
              className={response.query.province === item.province ? "is-active" : ""}
              href={createSearchHref(response.query.name, item.province)}
              key={item.province}
            >
              {item.province}
              <span>{formatNumber(item.count)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="records-panel" aria-label="검색 결과 목록">
        <div className="records-toolbar">
          <div>
            <strong>
              {response.query.province || "전국"} · {formatNumber(response.total)}건
            </strong>
            <span>
              현재 조건 {formatNumber(filteredSelectedCount)}건 선택
              {selectedCount !== filteredSelectedCount
                ? ` · 다른 검색 포함 총 ${formatNumber(selectedCount)}건`
                : ""}
            </span>
          </div>
          <div className="records-toolbar__actions">
            {selectedCount > 0 ? (
              <button className="text-button text-button--danger" onClick={clear} type="button">
                <TrashIcon />
                전체 선택 해제
              </button>
            ) : null}
            {currentPageIds.length > 0 ? (
              <button
                aria-pressed={allPageSelected}
                className="button button--secondary button--small"
                onClick={() =>
                  allPageSelected
                    ? deselectMany(currentPageIds)
                    : selectMany(currentPageIds)
                }
                type="button"
              >
                {allPageSelected
                  ? "이 페이지 선택 해제"
                  : `이 페이지 ${formatNumber(currentPageIds.length)}건 선택`}
              </button>
            ) : null}
          </div>
        </div>

        {response.records.length > 0 ? (
          <>
            <div className="records-table-wrap desktop-records" role="region" aria-label="기록 검색 결과 테이블" tabIndex={0}>
              <table className="records-table">
                <thead>
                  <tr>
                    <th className="records-table__check">
                      <label className="record-checkbox" title="현재 페이지 전체 선택">
                        <input
                          aria-label="현재 페이지 기록 전체 선택"
                          checked={allPageSelected}
                          onChange={(event: ChangeEvent<HTMLInputElement>) =>
                            event.target.checked
                              ? selectMany(currentPageIds)
                              : deselectMany(currentPageIds)
                          }
                          ref={pageCheckboxRef}
                          type="checkbox"
                        />
                        <span aria-hidden="true" />
                      </label>
                    </th>
                    <th>기록번호</th>
                    <th>성명</th>
                    <th>도 / 광역지역</th>
                    <th>군 · 면</th>
                    <th>토지소재지</th>
                    <th>자료구분</th>
                    <th>연도</th>
                  </tr>
                </thead>
                <tbody>
                  {response.records.map((record) => (
                    <tr className={selectedSet.has(record.id) ? "is-selected" : ""} key={record.id}>
                      <td>
                        <RecordCheckbox
                          checked={selectedSet.has(record.id)}
                          onChange={() => toggle(record.id)}
                          record={record}
                        />
                      </td>
                      <td>
                        <Link className="record-number" href={`/records/${record.id}`}>
                          {record.recordNumber}
                        </Link>
                      </td>
                      <td>
                        <strong>{record.name}</strong>
                        {record.nameHanja ? <small>{record.nameHanja}</small> : null}
                      </td>
                      <td>{record.province}</td>
                      <td>
                        {record.county}
                        {record.town ? <small>{record.town}</small> : null}
                      </td>
                      <td>
                        <LockedLocation />
                      </td>
                      <td>
                        <span className="source-badge">{record.sourceType}</span>
                      </td>
                      <td>{record.recordYear ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-records">
              {response.records.map((record) => (
                <article
                  className={`record-card${selectedSet.has(record.id) ? " is-selected" : ""}`}
                  key={record.id}
                >
                  <div className="record-card__top">
                    <RecordCheckbox
                      checked={selectedSet.has(record.id)}
                      onChange={() => toggle(record.id)}
                      record={record}
                    />
                    <div>
                      <span className="source-badge">{record.sourceType}</span>
                      <small>{record.recordYear ?? "연도 미상"}</small>
                    </div>
                  </div>
                  <div className="record-card__body">
                    <p className="record-card__number">{record.recordNumber}</p>
                    <h2>
                      {record.name}
                      {record.nameHanja ? <small>{record.nameHanja}</small> : null}
                    </h2>
                    <dl>
                      <div>
                        <dt>지역</dt>
                        <dd>{record.province}</dd>
                      </div>
                      <div>
                        <dt>군 · 면</dt>
                        <dd>
                          {record.county} {record.town ?? ""}
                        </dd>
                      </div>
                      <div>
                        <dt>토지소재지</dt>
                        <dd>
                          <LockedLocation />
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <Link className="record-card__link" href={`/records/${record.id}`}>
                    공개 정보 보기
                    <ArrowRightIcon />
                  </Link>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <FileTextIcon />
            <h2>일치하는 DEMO 기록이 없습니다.</h2>
            <p>성함 또는 지역 필터를 변경해 다시 검색해 주세요.</p>
            <Link className="button button--secondary" href="/">
              새로운 성함 검색
            </Link>
          </div>
        )}

        {response.totalPages > 1 ? (
          <nav className="pagination" aria-label="검색결과 페이지 이동">
            {response.page > 1 ? (
              <Link
                aria-label="이전 페이지"
                href={createSearchHref(
                  response.query.name,
                  response.query.province,
                  response.page - 1,
                )}
              >
                <ChevronLeftIcon />
                이전
              </Link>
            ) : (
              <span className="is-disabled">
                <ChevronLeftIcon />
                이전
              </span>
            )}
            <strong>
              {response.page} <span>/ {response.totalPages}</span>
            </strong>
            {response.page < response.totalPages ? (
              <Link
                aria-label="다음 페이지"
                href={createSearchHref(
                  response.query.name,
                  response.query.province,
                  response.page + 1,
                )}
              >
                다음
                <ChevronRightIcon />
              </Link>
            ) : (
              <span className="is-disabled">
                다음
                <ChevronRightIcon />
              </span>
            )}
          </nav>
        ) : null}
      </section>

      <div className="selection-spacer" aria-hidden="true" />
      <aside className="selection-bar">
        <div className="container selection-bar__inner">
          <div className="selection-bar__summary" aria-live="polite" role="status">
            <div>
              <span>선택한 기록</span>
              <strong>{isReady ? formatNumber(selectedCount) : "—"}건</strong>
            </div>
            <i aria-hidden="true" />
            <div>
              <span>예상 열람료</span>
              <strong>{isReady ? formatCurrency(selectedAmount) : "—"}</strong>
              <small>1건당 {formatCurrency(UNIT_PRICE)}</small>
            </div>
          </div>
          {isReady && selectedCount > 0 ? (
            <Link className="button button--primary selection-bar__cta" href="/checkout">
              {ctaLabel}
              <ArrowRightIcon />
            </Link>
          ) : (
            <button className="button button--primary selection-bar__cta" disabled type="button">
              열람할 기록을 선택해 주세요
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
