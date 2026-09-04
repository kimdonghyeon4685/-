"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, PointerEvent as ReactPointerEvent } from "react";
import {
  ArrowRightIcon,
  CheckIcon,
  CloseIcon,
  LockIcon,
  ReceiptIcon,
  ShieldIcon,
  TrashIcon,
} from "@/components/icons";
import { useSelection } from "@/components/selection-provider";
import { getPublicRecords, runMockPayment } from "@/lib/api-client";
import { UNIT_PRICE } from "@/lib/constants";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { PublicLandRecord } from "@/lib/types";

type RecordLoadState = {
  selectionKey: string;
  records: PublicLandRecord[];
  error: string;
};

export function CheckoutClient() {
  const router = useRouter();
  const {
    selectedIds,
    selectedCount,
    isReady,
    toggle,
    replace,
    clear,
  } = useSelection();
  const [recordLoadState, setRecordLoadState] = useState<RecordLoadState>({
    selectionKey: "",
    records: [],
    error: "",
  });
  const [isPaying, setIsPaying] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const confirmModalRef = useRef<HTMLElement>(null);
  const amountTotal = selectedCount * UNIT_PRICE;
  const selectionKey = selectedIds.join("|");
  const hasCurrentRecordResponse =
    selectedIds.length === 0 || recordLoadState.selectionKey === selectionKey;
  const records = useMemo(
    () => (hasCurrentRecordResponse ? recordLoadState.records : []),
    [hasCurrentRecordResponse, recordLoadState.records],
  );
  const isLoading = isReady && selectedIds.length > 0 && !hasCurrentRecordResponse;
  const error =
    paymentError || (hasCurrentRecordResponse ? recordLoadState.error : "");

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (selectedIds.length === 0) {
      return;
    }

    const controller = new AbortController();
    const requestedIds = [...selectedIds];
    const requestedKey = selectionKey;

    getPublicRecords(requestedIds, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) {
          return;
        }

        if (response.missingIds.length > 0) {
          const validIds = requestedIds.filter(
            (id) => !response.missingIds.includes(id),
          );
          replace(validIds);
          setRecordLoadState({
            selectionKey: validIds.join("|"),
            records: response.records,
            error: "존재하지 않는 선택 항목을 목록에서 제거했습니다.",
          });
          return;
        }

        setRecordLoadState({
          selectionKey: requestedKey,
          records: response.records,
          error: "",
        });
      })
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) {
          setRecordLoadState({
            selectionKey: requestedKey,
            records: [],
            error:
              loadError instanceof Error
                ? loadError.message
                : "선택 기록을 불러오지 못했습니다.",
          });
        }
      });

    return () => controller.abort();
  }, [isReady, replace, selectedIds, selectionKey]);

  useEffect(() => {
    if (!isConfirmOpen) {
      return;
    }

    const modal = confirmModalRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTarget = modal?.querySelector<HTMLElement>(
      "button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex='-1'])",
    );
    if (focusTarget) {
      focusTarget.focus();
    } else {
      modal?.focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isPaying) {
        setIsConfirmOpen(false);
      }

      if (event.key !== "Tab" || !modal) {
        return;
      }

      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>(
          "button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex='-1'])",
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) {
        event.preventDefault();
        modal.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isConfirmOpen, isPaying]);

  function handleBackdropPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget && !isPaying) {
      setIsConfirmOpen(false);
    }
  }

  const orderedRecords = useMemo(() => {
    const byId = new Map(records.map((record) => [record.id, record]));
    return selectedIds
      .map((id) => byId.get(id))
      .filter((record): record is PublicLandRecord => Boolean(record));
  }, [records, selectedIds]);

  async function handlePayment() {
    if (selectedIds.length === 0 || isPaying) {
      return;
    }

    setIsPaying(true);
    setPaymentError("");

    try {
      await runMockPayment({ recordIds: selectedIds });
      clear();
      setIsConfirmOpen(false);
      router.push("/checkout/success");
    } catch (paymentError) {
      setPaymentError(
        paymentError instanceof Error
          ? paymentError.message
          : "테스트 결제를 처리하지 못했습니다.",
      );
      setIsConfirmOpen(false);
    } finally {
      setIsPaying(false);
    }
  }

  if (!isReady || isLoading) {
    return (
      <div className="checkout-loading" role="status">
        <span className="loading-mark" aria-hidden="true" />
        <strong>선택한 기록을 안전하게 확인하고 있습니다.</strong>
        <p>결제 전 공개 가능한 필드만 불러옵니다.</p>
      </div>
    );
  }

  if (selectedCount === 0) {
    return (
      <div className="empty-state empty-state--large">
        <ReceiptIcon />
        <p className="eyebrow">EMPTY SELECTION</p>
        <h1>선택한 기록이 없습니다.</h1>
        <p>검색 결과에서 열람할 기록을 체크한 뒤 다시 진행해 주세요.</p>
        <Link className="button button--primary" href="/search?name=김동현">
          DEMO 기록 검색하기
          <ArrowRightIcon />
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="checkout-layout">
        <section className="checkout-main" aria-labelledby="checkout-title">
          <div className="page-heading">
            <p className="eyebrow">CHECKOUT · FINAL REVIEW</p>
            <h1 id="checkout-title">선택한 기록을 최종 확인해 주세요.</h1>
            <p>
              현재 화면에도 리·지번·면적 등의 상세정보는 전송되지 않았습니다.
              테스트 결제가 완료된 기록에 대해서만 상세 열람 권한이 생성됩니다.
            </p>
          </div>

          {error ? (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          ) : null}

          <div className="checkout-records">
            <div className="checkout-records__header">
              <strong>열람 선택 기록</strong>
              <span>{formatNumber(selectedCount)}건</span>
            </div>
            {orderedRecords.map((record, index) => (
              <article className="checkout-record" key={record.id}>
                <span className="checkout-record__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="checkout-record__body">
                  <div>
                    <strong>{record.recordNumber}</strong>
                    <span className="source-badge">{record.sourceType}</span>
                  </div>
                  <h2>
                    {record.name}
                    {record.nameHanja ? <small>{record.nameHanja}</small> : null}
                  </h2>
                  <p>
                    {record.province} · {record.county} {record.town ?? ""} ·{" "}
                    {record.recordYear ?? "연도 미상"}
                  </p>
                  <span className="locked-field">
                    <LockIcon />
                    정확한 리·지번은 결제 완료 후 공개
                  </span>
                </div>
                <div className="checkout-record__price">
                  <strong>{formatCurrency(UNIT_PRICE)}</strong>
                  <button
                    aria-label={`${record.recordNumber} 선택 해제`}
                    onClick={() => toggle(record.id)}
                    title="선택 해제"
                    type="button"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="prototype-payment-method">
            <div className="prototype-payment-method__icon">
              <ReceiptIcon />
            </div>
            <div>
              <strong>테스트 결제</strong>
              <p>실제 카드 승인이나 금액 청구 없이 결제 성공 흐름만 검증합니다.</p>
            </div>
            <span>MOCK PG</span>
          </div>

          <label className="terms-check">
            <input
              checked={termsAccepted}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setTermsAccepted(event.target.checked)
              }
              type="checkbox"
            />
            <span aria-hidden="true">
              <CheckIcon />
            </span>
            <span>
              본 자료는 DEMO 기록이며 실제 토지 소유권·현재 권리상태를 보증하지 않는다는
              점과 테스트 결제 안내를 확인했습니다.
            </span>
          </label>
        </section>

        <aside className="checkout-summary" aria-label="결제 요약">
          <div className="checkout-summary__seal" aria-hidden="true">土</div>
          <p className="eyebrow">ORDER SUMMARY</p>
          <h2>열람료 결제 요약</h2>
          <dl>
            <div>
              <dt>선택 기록</dt>
              <dd>{formatNumber(selectedCount)}건</dd>
            </div>
            <div>
              <dt>기록당 열람료</dt>
              <dd>{formatCurrency(UNIT_PRICE)}</dd>
            </div>
            <div className="checkout-summary__total">
              <dt>총 결제금액</dt>
              <dd>{formatCurrency(amountTotal)}</dd>
            </div>
          </dl>
          <button
            className="button button--primary button--full"
            disabled={!termsAccepted || isPaying}
            onClick={() => setIsConfirmOpen(true)}
            type="button"
          >
            {formatNumber(selectedCount)}건 · {formatCurrency(amountTotal)} 테스트 결제
            <ArrowRightIcon />
          </button>
          <div className="checkout-summary__security">
            <ShieldIcon />
            <p>
              <strong>구매한 기록만 공개</strong>
              상세정보는 결제가 끝난 뒤 구매 여부가 확인된 기록에만 제공됩니다.
            </p>
          </div>
        </aside>
      </div>

      {isConfirmOpen ? (
        <div
          className="modal-backdrop"
          onPointerDown={handleBackdropPointerDown}
          role="presentation"
        >
          <section
            aria-describedby="payment-confirm-description"
            aria-busy={isPaying}
            aria-labelledby="payment-confirm-title"
            aria-modal="true"
            className="confirm-modal"
            ref={confirmModalRef}
            role="dialog"
            tabIndex={-1}
          >
            <button
              aria-label="확인 창 닫기"
              className="confirm-modal__close"
              disabled={isPaying}
              onClick={() => setIsConfirmOpen(false)}
              type="button"
            >
              <CloseIcon />
            </button>
            <span className="confirm-modal__icon">
              <ShieldIcon />
            </span>
            <p className="eyebrow">FINAL CONFIRMATION</p>
            <h2 id="payment-confirm-title">테스트 결제를 진행할까요?</h2>
            <p id="payment-confirm-description">
              선택한 {formatNumber(selectedCount)}건에 대해서만 상세 열람 권한이 생성됩니다.
            </p>
            <div className="confirm-modal__amount">
              <span>선택 {formatNumber(selectedCount)}건</span>
              <strong>{formatCurrency(amountTotal)}</strong>
            </div>
            <div className="confirm-modal__actions">
              <button
                className="button button--secondary"
                disabled={isPaying}
                onClick={() => setIsConfirmOpen(false)}
                type="button"
              >
                다시 확인
              </button>
              <button
                className="button button--primary"
                disabled={isPaying}
                onClick={handlePayment}
                type="button"
              >
                {isPaying ? "권한 생성 중…" : "테스트 결제 완료 처리"}
                {!isPaying ? <ArrowRightIcon /> : null}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}
