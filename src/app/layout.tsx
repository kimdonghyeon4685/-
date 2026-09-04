import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { DemoBanner } from "@/components/demo-banner";
import { SelectionProvider } from "@/components/selection-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SERVICE_NAME } from "@/lib/constants";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: `${SERVICE_NAME} | 역사 토지기록 검색`,
    template: `%s | ${SERVICE_NAME}`,
  },
  description:
    "조상 성함으로 역사 토지기록을 무료 검색하고 필요한 기록만 선택해 열람하는 DEMO 프로토타입입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f3f0e8",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <SelectionProvider>
          <DemoBanner />
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </SelectionProvider>
      </body>
    </html>
  );
}
