import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "선택 기록 결제",
  description: "선택한 DEMO 기록의 테스트 결제를 최종 확인합니다.",
};

export default function CheckoutPage() {
  return (
    <div className="page-shell checkout-page">
      <div className="container">
        <CheckoutClient />
      </div>
    </div>
  );
}
