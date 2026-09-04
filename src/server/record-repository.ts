import "server-only";

import { DEMO_NOTICE, SEARCH_PAGE_SIZE } from "@/lib/constants";
import type {
  LandRecordDetail,
  ProvinceCount,
  PublicLandRecord,
  SearchResponse,
} from "@/lib/types";
import { DEMO_LAND_RECORDS } from "@/server/mock-data";

export type SearchRecordsInput = {
  name: string;
  province?: string;
  page?: number;
  pageSize?: number;
};

function normalizeName(value: string): string {
  return value.normalize("NFC").replace(/\s+/g, "").trim();
}

function toPublicRecord(record: LandRecordDetail): PublicLandRecord {
  return {
    id: record.id,
    recordNumber: record.recordNumber,
    name: record.name,
    nameHanja: record.nameHanja,
    province: record.province,
    county: record.county,
    town: record.town,
    sourceType: record.sourceType,
    recordYear: record.recordYear,
    isDemo: true,
  };
}

export function searchPublicRecords(input: SearchRecordsInput): SearchResponse {
  const normalizedName = normalizeName(input.name);
  const province = input.province?.trim() ?? "";
  const pageSize = Math.max(1, input.pageSize ?? SEARCH_PAGE_SIZE);

  const nameMatches = normalizedName
    ? DEMO_LAND_RECORDS.filter(
        (record) => normalizeName(record.name) === normalizedName,
      )
    : [];

  const provinceCountsMap = new Map<string, number>();
  for (const record of nameMatches) {
    provinceCountsMap.set(
      record.province,
      (provinceCountsMap.get(record.province) ?? 0) + 1,
    );
  }

  const provinceCounts: ProvinceCount[] = [...provinceCountsMap.entries()]
    .map(([provinceName, count]) => ({ province: provinceName, count }))
    .sort((a, b) => b.count - a.count || a.province.localeCompare(b.province, "ko"));

  const filtered = province
    ? nameMatches.filter((record) => record.province === province)
    : nameMatches;

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const requestedPage = Math.max(1, input.page ?? 1);
  const page = Math.min(requestedPage, totalPages);
  const start = (page - 1) * pageSize;
  const records = filtered.slice(start, start + pageSize).map(toPublicRecord);

  return {
    query: { name: input.name.trim(), province },
    total,
    page,
    pageSize,
    totalPages,
    provinceCounts,
    matchingRecordIds: filtered.map((record) => record.id),
    records,
    demoNotice: DEMO_NOTICE,
  };
}

export function getPublicRecordById(id: string): PublicLandRecord | null {
  const record = DEMO_LAND_RECORDS.find((item) => item.id === id);
  return record ? toPublicRecord(record) : null;
}

export function getPublicRecordsByIds(ids: string[]): PublicLandRecord[] {
  const requested = new Set(ids);
  return DEMO_LAND_RECORDS.filter((record) => requested.has(record.id)).map(toPublicRecord);
}

export function getDetailedRecordById(id: string): LandRecordDetail | null {
  return DEMO_LAND_RECORDS.find((record) => record.id === id) ?? null;
}

export function recordExists(id: string): boolean {
  return DEMO_LAND_RECORDS.some((record) => record.id === id);
}

export function getDemoDatasetStats(): {
  totalRecords: number;
  uniqueNames: number;
  provinces: number;
  sourceTypes: number;
} {
  return {
    totalRecords: DEMO_LAND_RECORDS.length,
    uniqueNames: new Set(DEMO_LAND_RECORDS.map((record) => record.name)).size,
    provinces: new Set(DEMO_LAND_RECORDS.map((record) => record.province)).size,
    sourceTypes: new Set(DEMO_LAND_RECORDS.map((record) => record.sourceType)).size,
  };
}
