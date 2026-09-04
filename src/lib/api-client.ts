import type {
  ApiError,
  MockPaymentRequest,
  MockPaymentResponse,
  PublicRecordsResponse,
  PurchasesResponse,
  SearchResponse,
} from "@/lib/types";

type SearchInput = {
  name: string;
  province?: string;
  page?: number;
};

async function parseJson<T>(response: Response): Promise<T> {
  const payload: unknown = await response.json();

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "error" in payload &&
      typeof (payload as ApiError).error === "string"
        ? (payload as ApiError).error
        : "요청을 처리하지 못했습니다.";
    throw new Error(message);
  }

  return payload as T;
}

export async function searchRecords(input: SearchInput): Promise<SearchResponse> {
  const params = new URLSearchParams({
    name: input.name,
    page: String(input.page ?? 1),
  });

  if (input.province) {
    params.set("province", input.province);
  }

  const response = await fetch(`/api/search?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  return parseJson<SearchResponse>(response);
}

export async function getPublicRecords(
  recordIds: string[],
  signal?: AbortSignal,
): Promise<PublicRecordsResponse> {
  const params = new URLSearchParams({ ids: recordIds.join(",") });
  const response = await fetch(`/api/records/public?${params.toString()}`, {
    method: "GET",
    cache: "no-store",
    signal,
  });

  return parseJson<PublicRecordsResponse>(response);
}

export async function runMockPayment(
  request: MockPaymentRequest,
): Promise<MockPaymentResponse> {
  const response = await fetch("/api/payments/mock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  return parseJson<MockPaymentResponse>(response);
}

export async function getPurchases(): Promise<PurchasesResponse> {
  const response = await fetch("/api/purchases", {
    method: "GET",
    cache: "no-store",
  });

  return parseJson<PurchasesResponse>(response);
}
