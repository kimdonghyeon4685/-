"use client";

import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";
import { useSelection } from "@/components/selection-provider";
import { formatNumber } from "@/lib/format";

type RecordSelectionActionProps = {
  recordId: string;
};

export function RecordSelectionAction({ recordId }: RecordSelectionActionProps) {
  const { isReady, selectedCount, selectedSet, toggle } = useSelection();
  const isSelected = selectedSet.has(recordId);

  if (!isReady) {
    return (
      <button className="button button--primary" disabled type="button">
        선택 상태 확인 중…
      </button>
    );
  }

  return (
    <div className="record-selection-action">
      <button
        aria-pressed={isSelected}
        className={isSelected ? "button button--selected" : "button button--primary"}
        onClick={() => toggle(recordId)}
        type="button"
      >
        {isSelected ? <CheckIcon /> : null}
        {isSelected ? "열람 목록에 선택됨" : "이 기록을 열람 목록에 담기"}
      </button>
      {isSelected ? (
        <Link className="button button--primary" href="/checkout">
          선택 {formatNumber(selectedCount)}건 결제 단계로
          <ArrowRightIcon />
        </Link>
      ) : null}
    </div>
  );
}
