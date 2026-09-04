import { ArrowRightIcon, SearchIcon } from "@/components/icons";
import { DEMO_PROVINCES } from "@/lib/constants";

type SearchFormProps = {
  defaultName?: string;
  defaultProvince?: string;
  compact?: boolean;
};

export function SearchForm({
  defaultName = "",
  defaultProvince = "",
  compact = false,
}: SearchFormProps) {
  return (
    <form
      action="/search"
      className={`record-search-form${compact ? " record-search-form--compact" : ""}`}
      method="get"
    >
      <div className="record-search-form__field record-search-form__field--name">
        <label htmlFor={compact ? "search-name-compact" : "search-name"}>
          조상 성함
        </label>
        <div className="record-search-form__input-wrap">
          <SearchIcon />
          <input
            autoComplete="off"
            defaultValue={defaultName}
            id={compact ? "search-name-compact" : "search-name"}
            maxLength={20}
            name="name"
            placeholder="예: 김동현"
            required
            type="search"
          />
        </div>
      </div>
      <div className="record-search-form__field record-search-form__field--province">
        <label htmlFor={compact ? "search-province-compact" : "search-province"}>
          지역 <span>선택</span>
        </label>
        <select
          defaultValue={defaultProvince}
          id={compact ? "search-province-compact" : "search-province"}
          name="province"
        >
          <option value="">전국</option>
          {DEMO_PROVINCES.map((province) => (
            <option key={province} value={province}>
              {province}
            </option>
          ))}
        </select>
      </div>
      <button className="button button--primary record-search-form__submit" type="submit">
        무료 검색
        <ArrowRightIcon />
      </button>
    </form>
  );
}
