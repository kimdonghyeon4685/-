# 조상토지기록 · ANCESTRAL LAND RECORDS

과거 토지조사·임야조사 기록에서 조상 성함을 무료로 검색하고, 검색 결과 중 필요한 개별 기록만 선택해 **1건당 20,000원**으로 상세 리·지번을 열람하는 Next.js 프로토타입입니다.

현재 버전은 실제 인물·실제 토지정보·실결제를 사용하지 않습니다. 전체 240건의 생성형 DEMO 데이터와 테스트 결제만 포함하며, 화면의 모든 기록은 실제 소유권이나 권리관계를 의미하지 않습니다.

## 구현된 사용자 흐름

```text
메인
→ 조상 성함 무료 검색
→ 공개 정보 검색결과 확인
→ 체크박스로 원하는 기록 선택
→ 선택 건수와 총액 실시간 계산
→ 결제 전 최종 확인
→ 테스트 결제
→ 결제한 record_id만 상세정보 열람
→ 내 열람 기록에서 재확인
```

- `김동현` 검색 시 113건의 DEMO 기록이 표시됩니다.
- 기록 선택 단가는 1건당 20,000원입니다.
- PC 검색결과는 테이블, 모바일 검색결과는 카드로 표시됩니다.
- 결제 전 API 응답에는 리·지번·면적·상세 출처가 포함되지 않습니다.
- 테스트 결제 시 서버가 record_id 유효성과 총액을 다시 계산합니다.
- 구매 권한은 서명된 세션 키와 서버 메모리 저장소로 관리합니다.

## 기술 스택

- Next.js App Router
- TypeScript
- React
- CSS Modules 대신 프로젝트 공통 CSS 디자인 시스템
- Phase 1 Mock Repository / Mock Payment / Server Memory Entitlement
- 향후 Supabase/PostgreSQL, Toss Payments, Vercel 연결 예정

## 요구 환경

- Node.js 22 LTS 권장 (`.nvmrc` 포함)
- 최소 Node.js 20.9
- npm 10 이상
- Git

버전 확인:

```bash
node --version
npm --version
git --version
```

## 처음 설치하고 실행하기

### 1. 저장소 clone

GitHub 저장소 주소가 생성된 뒤 아래 `<REPOSITORY_URL>`을 실제 주소로 바꿉니다.

```bash
git clone <REPOSITORY_URL>
cd ancestral-land-records
```

현재 전달받은 압축파일로 시작한다면 압축을 푼 뒤 해당 폴더에서 터미널을 엽니다.

### 2. 의존성 설치

```bash
npm install
```

`package-lock.json`을 삭제하지 않습니다. 여러 Windows/macOS 컴퓨터에서 같은 의존성 기준을 공유하기 위한 파일입니다.

### 3. 환경변수 설정

로컬 실행에는 환경변수가 없어도 동작합니다. 공유 프리뷰 또는 배포 환경에서는 `MOCK_PAYMENT_SECRET`을 반드시 설정합니다.

macOS/Linux:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

`.env.local` 예시:

```dotenv
MOCK_PAYMENT_SECRET=충분히-길고-무작위인-개발용-문자열
```

`.env.local`은 `.gitignore`에 포함되어 있으므로 Git에 commit하면 안 됩니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

### 5. 품질 확인

```bash
npm run lint
npm run typecheck
npm run build
```

프로덕션 빌드 실행:

```bash
npm run start
```

`npm run start`는 먼저 `npm run build`가 완료된 상태에서 사용합니다.

## 주요 URL

| URL | 기능 |
| --- | --- |
| `/` | 메인, 성함/지역 검색, 서비스 안내 |
| `/search?name=김동현` | 검색결과, 지역 필터, 체크박스 선택, 실시간 총액 |
| `/checkout` | 선택 기록 요약, 테스트 결제 최종 확인 |
| `/checkout/success` | 결제 성공 및 열람 가능한 기록 안내 |
| `/records/[id]` | 서버 구매 권한 확인 후 개별 상세정보 공개 |
| `/my` | 현재 DEMO 세션의 구매·열람 기록 |
| `/guide` | 검색 방법, 과금, 정보 공개 범위, 주의사항 |
| `/admin` | Phase 2 관리자 기능의 읽기 전용 구조 프로토타입 |

## 프로젝트 구조

```text
.
├─ AGENTS.md
├─ README.md
├─ docs/
│  ├─ PRD.md
│  └─ ARCHITECTURE.md
├─ src/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ search/                 # 무료 검색 API
│  │  │  ├─ records/public/         # 공개 필드만 반환
│  │  │  ├─ records/[id]/           # 권한 확인 후 상세 반환
│  │  │  ├─ payments/mock/          # 서버 검증형 테스트 결제
│  │  │  └─ purchases/              # 현재 세션 구매내역
│  │  ├─ search/
│  │  ├─ checkout/
│  │  ├─ records/[id]/
│  │  ├─ my/
│  │  ├─ guide/
│  │  └─ admin/
│  ├─ components/
│  │  ├─ search/
│  │  ├─ checkout/
│  │  ├─ records/
│  │  └─ ui/
│  ├─ lib/                          # 공개 타입, 상수, 포맷, API client
│  └─ server/                       # 서버 전용 Mock DB, 결제, 권한
├─ .env.example
├─ .gitignore
├─ package.json
└─ package-lock.json
```

## 데이터 보안 구조

### 무료 응답에 포함되는 필드

- record id
- 기록번호
- 성명 / 한자명(있는 경우)
- 도
- 군
- 면/읍
- 자료구분
- 기록연도

### 구매 권한 확인 후에만 조회되는 필드

- 리
- 정확한 토지소재지
- 지번
- 지목
- 면적
- 자료 출처 / 원문 식별정보
- 당시 행정구역
- 현재 행정구역 매핑
- 원문 자료 상태

잠긴 화면은 상세 문자열을 받아 CSS로 흐리게 만드는 방식이 아닙니다. 미구매 상세 페이지와 무료 API에서는 상세 레코드를 조회하지 않고 공개 레코드 타입만 반환합니다.

### Phase 1 권한 저장

- 선택 목록: 브라우저 `localStorage`에 저장되는 비민감 record_id 목록
- 결제 검증: 서버가 record_id 존재 여부와 `건수 × 20,000원`을 재계산
- 구매 권한: 서버 메모리 Map에 저장
- 브라우저 쿠키: record_id 목록이 아닌 서명된 짧은 DEMO 세션 키만 `httpOnly`로 저장

개발 서버 재시작 또는 다른 서버 인스턴스로 이동하면 Phase 1 구매 상태가 초기화될 수 있습니다. 실제 서비스에서는 이 저장소를 PostgreSQL의 `purchases` / `purchase_items`로 교체해야 합니다.

## 환경변수

| 변수 | 현재 사용 | 설명 |
| --- | --- | --- |
| `MOCK_PAYMENT_SECRET` | 사용 | DEMO 세션 키 서명. 로컬 기본값이 있으나 배포 시 필수 |
| `NEXT_PUBLIC_SUPABASE_URL` | 예정 | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 예정 | 브라우저 공개용 anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | 예정 | 서버 전용. 절대 클라이언트/저장소에 노출 금지 |
| `TOSS_PAYMENTS_SECRET_KEY` | 예정 | Toss 결제 승인 서버 키 |
| `NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY` | 예정 | Toss 결제창 클라이언트 키 |

## Git 사용 방법

### 새 작업 시작

```bash
git status
git pull --rebase
git switch -c feature/<작업명>
```

### 작업 후 검증과 commit

```bash
npm run lint
npm run build
git status
git add .
git diff --cached
git commit -m "feat: 작업 내용 요약"
```

원격 저장소가 연결된 뒤에만 push합니다.

```bash
git push -u origin feature/<작업명>
```

### 여러 컴퓨터에서 병행할 때

1. 컴퓨터 A에서 작업 전 `git pull --rebase`
2. 기능 브랜치에서 작업 및 검증
3. commit 후 push
4. 컴퓨터 B에서 같은 브랜치를 fetch/switch하고 pull
5. `.env.local`은 각 컴퓨터에서 별도로 생성
6. `node_modules`는 복사하지 않고 각 컴퓨터에서 `npm install`

force push는 사용하지 않습니다. 한 컴퓨터에서 commit하지 않은 변경사항을 남긴 채 다른 컴퓨터에서 같은 파일을 동시에 수정하지 않는 것이 좋습니다.

## 향후 연결 구조

### Supabase / PostgreSQL

`src/server/record-repository.ts`의 Mock 조회를 PostgreSQL 쿼리로 교체합니다.

권장 테이블:

- `land_records`
- `purchases`
- `purchase_items`
- 사용자 인증 테이블은 Supabase Auth 연동

무료 검색 쿼리는 공개 컬럼만 `select`하고, 상세 쿼리는 로그인 사용자와 `purchase_items.record_id` 권한을 함께 검증해야 합니다. Supabase를 사용할 경우 RLS와 서버측 추가 검증을 병행합니다.

### Toss Payments

`src/app/api/payments/mock/route.ts`를 실제 결제 준비/승인 API로 분리합니다.

1. 서버가 주문과 예상금액 생성
2. 클라이언트가 Toss 결제창 호출
3. 결제 성공 redirect에서 서버 승인 API 호출
4. Toss 승인금액과 서버 주문금액 비교
5. 성공 transaction 안에서 `purchases`와 `purchase_items` 저장
6. 결제한 record_id만 열람 권한 부여

### Vercel

- GitHub 저장소 연결 후 main 브랜치 자동 배포
- Preview/Production 환경변수를 Vercel에 별도 등록
- `SUPABASE_SERVICE_ROLE_KEY`, `TOSS_PAYMENTS_SECRET_KEY`, `MOCK_PAYMENT_SECRET`은 서버 환경변수로만 저장
- 서버 메모리는 Vercel 인스턴스 간 공유되지 않으므로 Production 전 반드시 DB 저장으로 전환

자세한 흐름은 [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)를 참고하세요.

## 현재 프로토타입 한계

- 실제 데이터, 로그인, 실결제, 환불, 관리자 CRUD가 없습니다.
- 서버 메모리 구매 상태는 영구적이지 않습니다.
- 현재 주소 매핑, 지도, PDF 보고서, 원문 이미지는 연결하지 않았습니다.
- 상용화 전 데이터 이용권한, 개인정보, 면책, 전자상거래 약관과 환불정책 검토가 필요합니다.
