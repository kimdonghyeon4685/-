import Link from "next/link";
import { SERVICE_NAME, SERVICE_NAME_EN } from "@/lib/constants";

export function ArchiveMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`archive-mark${compact ? " archive-mark--compact" : ""}`} href="/">
      <span className="archive-mark__seal" aria-hidden="true">
        <span>土</span>
      </span>
      <span className="archive-mark__text">
        <strong>{SERVICE_NAME}</strong>
        <small>{SERVICE_NAME_EN}</small>
      </span>
    </Link>
  );
}
