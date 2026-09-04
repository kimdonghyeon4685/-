"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { ArchiveMark } from "@/components/archive-mark";
import { MenuIcon, SearchIcon } from "@/components/icons";

const NAV_ITEMS = [
  { href: "/search?name=김동현", label: "기록 검색" },
  { href: "/guide", label: "이용안내" },
  { href: "/my", label: "내 열람 기록" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDetailsElement>(null);

  function isActive(href: string) {
    return pathname === href.split("?")[0];
  }

  function closeMobileMenu() {
    mobileMenuRef.current?.removeAttribute("open");
  }

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <ArchiveMark compact />
        <nav className="site-header__nav" aria-label="주요 메뉴">
          {NAV_ITEMS.map((item) => (
            <Link
              aria-current={isActive(item.href) ? "page" : undefined}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="button button--small button--primary site-header__cta" href="/search?name=김동현">
          <SearchIcon />
          무료 검색
        </Link>
        <details className="mobile-menu" ref={mobileMenuRef}>
          <summary aria-label="주요 메뉴 열기">
            <MenuIcon />
          </summary>
          <nav aria-label="모바일 메뉴">
            {NAV_ITEMS.map((item) => (
              <Link
                aria-current={isActive(item.href) ? "page" : undefined}
                href={item.href}
                key={item.href}
                onClick={closeMobileMenu}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/admin" onClick={closeMobileMenu}>
              관리자 프로토타입
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
