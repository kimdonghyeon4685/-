"use client";

import { useEffect } from "react";
import { ShieldIcon } from "@/components/icons";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="page-shell">
      <div className="container narrow-page">
        <div className="empty-state empty-state--large">
          <ShieldIcon />
          <p className="eyebrow">TEMPORARY ERROR</p>
          <h1>요청을 처리하는 중 문제가 발생했습니다.</h1>
          <p>DEMO 세션을 확인한 뒤 다시 시도해 주세요.</p>
          <button className="button button--primary" onClick={reset} type="button">
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
}
