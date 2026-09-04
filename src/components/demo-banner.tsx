import { DEMO_NOTICE } from "@/lib/constants";

export function DemoBanner() {
  return (
    <div className="demo-banner" role="note">
      <span className="demo-banner__label">DEMO PROTOTYPE</span>
      <span>{DEMO_NOTICE}</span>
    </div>
  );
}
