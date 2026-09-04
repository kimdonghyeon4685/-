import "server-only";

import type { LandRecordDetail, SourceType } from "@/lib/types";

type RegionTemplate = {
  province: string;
  county: string;
  towns: string[];
  villages: string[];
};

type NamePlan = {
  name: string;
  count: number;
  nameHanja?: string;
};

const REGION_TEMPLATES: RegionTemplate[] = [
  {
    province: "경상북도",
    county: "기록군",
    towns: ["동문면", "청록면", "서책면"],
    villages: ["아카이브리", "새기록리", "문헌리"],
  },
  {
    province: "경기도",
    county: "연구군",
    towns: ["고문서면", "기록면", "온지면"],
    villages: ["모의리", "대조리", "색인리"],
  },
  {
    province: "충청남도",
    county: "사료군",
    towns: ["남록면", "해제면", "정리면"],
    villages: ["목록리", "열람리", "기록보존리"],
  },
  {
    province: "전라북도",
    county: "문헌군",
    towns: ["고지도면", "원문면", "대장면"],
    villages: ["서고리", "연혁리", "조사리"],
  },
  {
    province: "전라남도",
    county: "보존군",
    towns: ["동록면", "사본면", "근거면"],
    villages: ["복원리", "자료리", "기록원리"],
  },
  {
    province: "강원도",
    county: "대조군",
    towns: ["산록면", "임야면", "사료면"],
    villages: ["초록리", "문서리", "고증리"],
  },
  {
    province: "경상남도",
    county: "색인군",
    towns: ["남문면", "조사면", "장부면"],
    villages: ["분류리", "기록물리", "열람실리"],
  },
  {
    province: "제주도",
    county: "아카이브군",
    towns: ["해록면", "유산면", "보존면"],
    villages: ["옛문서리", "연구리", "모형리"],
  },
];

const NAME_PLAN: NamePlan[] = [
  { name: "김동현", nameHanja: "金東賢", count: 113 },
  { name: "박서준", nameHanja: "朴書俊", count: 29 },
  { name: "이정호", nameHanja: "李正浩", count: 26 },
  { name: "최영수", nameHanja: "崔永洙", count: 24 },
  { name: "정민재", nameHanja: "鄭珉載", count: 20 },
  { name: "한기록", nameHanja: "韓記錄", count: 14 },
  { name: "윤가람", nameHanja: "尹佳覽", count: 14 },
];

const SOURCE_TYPES: SourceType[] = [
  "토지조사부",
  "임야조사부",
  "지적원도 대조기록",
];

const LAND_CATEGORIES = ["전", "답", "임야", "대", "잡종지"] as const;

function pad(value: number, length = 5): string {
  return String(value).padStart(length, "0");
}

function createDemoRecords(): LandRecordDetail[] {
  const records: LandRecordDetail[] = [];
  let globalIndex = 0;

  for (const plan of NAME_PLAN) {
    for (let nameIndex = 0; nameIndex < plan.count; nameIndex += 1) {
      const sequence = globalIndex + 1;
      const region = REGION_TEMPLATES[(nameIndex + globalIndex) % REGION_TEMPLATES.length];
      const town = region.towns[(nameIndex + 1) % region.towns.length];
      const village = region.villages[(nameIndex + 2) % region.villages.length];
      const sourceType = SOURCE_TYPES[sequence % SOURCE_TYPES.length];
      const lotMain = 100 + ((sequence * 37) % 800);
      const lotSub = 1 + ((sequence * 11) % 17);
      const area = 330 + ((sequence * 83) % 4_700);
      const recordYear = 1910 + (sequence % 15);
      const id = `rec-${pad(sequence, 4)}`;

      records.push({
        id,
        recordNumber: `DEMO-N${pad(sequence)}`,
        name: plan.name,
        nameHanja: plan.nameHanja,
        province: region.province,
        county: region.county,
        town,
        village,
        parcelNumber: `모의지번 ${lotMain}-${lotSub}`,
        exactLocation: `${region.province} ${region.county} ${town} ${village} 모의지번 ${lotMain}-${lotSub}`,
        landCategory: LAND_CATEGORIES[sequence % LAND_CATEGORIES.length],
        area: `${area.toLocaleString("ko-KR")}㎡ (DEMO)`,
        recordYear,
        sourceType,
        sourceReference: `DEMO-ARCHIVE-${recordYear}-${pad(sequence)}`,
        historicalRegion: `${recordYear}년 기준 모의 행정구역 · ${region.county} ${town}`,
        currentRegionMapping: "프로토타입 단계에서는 현재 행정구역 매핑을 제공하지 않습니다.",
        originalMaterialStatus: "원문 이미지는 실제 데이터 계약 후 연동 예정 (DEMO)",
        isDemo: true,
      });

      globalIndex += 1;
    }
  }

  return records;
}

export const DEMO_LAND_RECORDS = Object.freeze(createDemoRecords());
