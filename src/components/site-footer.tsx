import Link from "next/link";
import { ArchiveMark } from "@/components/archive-mark";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <ArchiveMark compact />
          <p className="site-footer__description">
            오래된 토지 기록을 현대적인 검색 경험으로 연결하는 조상토지기록 검색 서비스
            프로토타입입니다.
          </p>
        </div>
        <div className="site-footer__links">
          <div>
            <strong>서비스</strong>
            <Link href="/search?name=김동현">기록 검색</Link>
            <Link href="/my">내 열람 기록</Link>
          </div>
          <div>
            <strong>안내</strong>
            <Link href="/guide">이용안내</Link>
            <Link href="/admin">관리자 화면</Link>
          </div>
        </div>
      </div>
      <div className="container site-footer__bottom">
        <span>© 2026 조상토지기록 체험판</span>
        <span>본 서비스의 모든 기록은 DEMO 데이터입니다.</span>
      </div>
    </footer>
  );
}
