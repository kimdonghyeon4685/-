import Link from "next/link";
import { ArrowRightIcon, FileTextIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="page-shell">
      <div className="container narrow-page">
        <div className="empty-state empty-state--large">
          <FileTextIcon />
          <p className="eyebrow">404 · RECORD NOT FOUND</p>
          <h1>요청한 기록이나 페이지를 찾을 수 없습니다.</h1>
          <p>주소를 다시 확인하거나 DEMO 검색 결과로 돌아가 주세요.</p>
          <Link className="button button--primary" href="/search?name=김동현">
            기록 검색으로 이동
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
