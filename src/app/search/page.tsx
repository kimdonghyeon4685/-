import type { Metadata } from "next";
import { SearchForm } from "@/components/search/search-form";
import { SearchResults } from "@/components/search/search-results";
import { DEFAULT_SEARCH_NAME } from "@/lib/constants";
import { clampInteger } from "@/lib/format";
import { searchPublicRecords } from "@/server/record-repository";

export const metadata: Metadata = {
  title: "기록 검색",
  description: "조상 성함으로 DEMO 토지기록을 무료 검색합니다.",
};

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const name = getSingleValue(params.name).trim() || DEFAULT_SEARCH_NAME;
  const province = getSingleValue(params.province).trim();
  const page = clampInteger(getSingleValue(params.page) || null, 1, 1, 10_000);
  const response = searchPublicRecords({ name, province, page });

  return (
    <div className="search-page page-with-selection-bar">
      <section className="search-page__form">
        <div className="container">
          <SearchForm compact defaultName={name} defaultProvince={province} />
        </div>
      </section>
      <div className="container search-page__content">
        <SearchResults response={response} />
      </div>
    </div>
  );
}
