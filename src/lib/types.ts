export type SourceType = "토지조사부" | "임야조사부" | "지적원도 대조기록";

export type PublicLandRecord = {
  id: string;
  recordNumber: string;
  name: string;
  nameHanja?: string;
  province: string;
  county: string;
  town?: string;
  sourceType: SourceType;
  recordYear?: number;
  isDemo: true;
};

export type LandRecordDetail = PublicLandRecord & {
  village: string;
  parcelNumber: string;
  exactLocation: string;
  landCategory: string;
  area: string;
  sourceReference: string;
  historicalRegion: string;
  currentRegionMapping: string;
  originalMaterialStatus: string;
};

export type ProvinceCount = {
  province: string;
  count: number;
};

export type SearchResponse = {
  query: {
    name: string;
    province: string;
  };
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  provinceCounts: ProvinceCount[];
  matchingRecordIds: string[];
  records: PublicLandRecord[];
  demoNotice: string;
};

export type PublicRecordsResponse = {
  records: PublicLandRecord[];
  missingIds: string[];
  demoNotice: string;
};

export type MockPurchase = {
  id: string;
  recordIds: string[];
  unitPrice: number;
  amountTotal: number;
  status: "PAID";
  paidAt: string;
  paymentKey: string;
};

export type PurchaseWithRecords = MockPurchase & {
  records: PublicLandRecord[];
};

export type PurchasesResponse = {
  purchases: PurchaseWithRecords[];
  unlockedRecordIds: string[];
  demoNotice: string;
};

export type MockPaymentRequest = {
  recordIds: string[];
};

export type MockPaymentResponse = {
  success: true;
  purchase: MockPurchase;
  unlockedRecordIds: string[];
};

export type ApiError = {
  error: string;
  code?: string;
};
