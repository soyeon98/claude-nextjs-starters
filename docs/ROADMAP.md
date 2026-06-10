# 노션 기반 견적서 웹 공유 서비스 (invoice-web) 개발 로드맵

> **문서 버전**: v2.1
> **최종 수정**: 2026-06-10 (Phase C DoD 4/5 완료 반영)
> **작성자**: PM/Architecture Team
> **기준 PRD**: `docs/PRD.md`
> **주요 변경 (v1.1 → v2.0)**: Supabase 완전 제거, 인증 없음(전 페이지 공개), DB/영속 저장소 없음, 공유 링크 = 노션 페이지 ID 직접 사용
> **주요 변경 (v2.0 → v2.1)**: F001(노션 연동 설정) 완료 반영, Phase A와 Phase B 사이에 **Phase A-1(UI/UX 완성 — 더미 데이터)** 신설, 이후 Phase 일정 약 1주 순연

---

## 📋 프로젝트 개요

### 제품 비전

> 관리자가 노션에서 작성한 견적서를 클라이언트가 **별도 가입 없이** 웹 URL로 확인하고 PDF로 다운로드할 수 있게 한다.

### 운영 구조 (v2.0 핵심 전환)

- **인증 없음**: 로그인/로그아웃이 없으며 **모든 페이지가 공개 접근**이다. `(auth)` 라우트 그룹은 삭제됐다.
- **영속 저장소 없음**: DB 테이블이 없다. 모든 견적서 데이터는 요청 시점에 노션 API에서 실시간 조회한다.
- **공유 링크 = 노션 페이지 ID**: 별도 토큰을 발급/저장하지 않고 **노션 페이지 ID를 그대로 URL 토큰으로 사용**한다 (`/view/[notionPageId]`). 공유 = "노션 페이지 ID로 만든 공개 URL을 전달"하는 것일 뿐이다.
- **노션 자격**: `NOTION_API_KEY`, `NOTION_DATABASE_ID`를 서버 `.env`에 고정하고 `lib/env.ts` getter + `createNotionClient()`로 초기화한다. 토큰은 서버 전용이며 클라이언트 번들·응답에 노출되지 않는다.

### 목표 및 성공 지표

| 목표 | 측정 지표 | 목표값 |
|------|-----------|--------|
| 공유의 마찰 제거 | 클라이언트의 견적서 접근 가입률 | 0% (가입 불필요) |
| 핵심 가치 전달 | 공유 링크 전달 → PDF 다운로드 전환율 | 50% 이상 |
| 데이터 소스 신뢰성 | 노션 연동(.env 토큰) 동작 시 목록 조회 성공률 | 99% 이상 |
| 렌더 정확성 | 공개 뷰가 노션 항목/합계를 누락 없이 표시 | 100% (필수 필드 기준) |

### 기술 스택 (현재 프로젝트 확정 상태 기준)

| 영역 | 기술 | 설치 상태 |
|------|------|-----------|
| 프레임워크 | Next.js 16.2.6 (App Router, Turbopack), React 19.2.4, TS 5.x | ✅ 설치됨 |
| 스타일링 | Tailwind CSS v4 + OKLCH, shadcn/ui (radix-nova), lucide-react | ✅ 설치됨 |
| 폼/검증 | react-hook-form 7.x, zod 4.x, @hookform/resolvers 5.x | ✅ 설치됨 |
| 노션 | @notionhq/client **5.22.0**, notion-to-md 3.x | ✅ 설치됨 |
| PDF | @react-pdf/renderer 4.x | ✅ 설치됨 |
| UX 보조 | sonner(토스트), date-fns | ✅ 설치됨 |
| 테스트 | @playwright/test 1.60 | ✅ 설치됨 / ⚠️ 테스트 파일 없음 |
| 배포 | Vercel | 🔲 미구성 |

> **Supabase 제거 완료**: `@supabase/ssr`, `@supabase/supabase-js`가 `package.json`에서 삭제됐다. `lib/supabase/`, `supabase/migrations/`, `app/(auth)/` 폴더도 모두 삭제됐다. `middleware.ts`는 Next.js 16 컨벤션에 따라 `proxy.ts`로 대체됐으며 현재 `NextResponse.next()` 패스스루만 수행한다(가드 로직 없음).

---

## 🗄️ 노션 DB 스키마 (실제 API 조회로 확정)

구현의 전제가 되는 노션 데이터베이스 구조는 실제 API 조회로 확정됐다. 이전 로드맵의 R-02/R-03 모호성은 이 확정으로 **해소**됐다.

### Invoices DB (`37921ad8f03180f59d4b000b143f4317`)

| 속성명 | 타입 | 매핑/설명 |
|--------|------|-----------|
| 견적서 번호 | `title` | 견적서 제목 (예: `INV-2026-001`) → `InvoiceSummary.title` |
| 클라이언트명 | `rich_text` | 수신자명 |
| 총금액 | `number` | 합계 금액 → `InvoiceSummary.amount` |
| 발행일 | `date` | 견적서 발행일 |
| 유효기간 | `date` | 견적서 유효기간 |
| 상태 | `status` | 진행 상태 (예: 대기, 완료) |
| 항목 | `relation` | **Items DB와 연결** (견적 항목은 별도 DB의 relation) |

### Items DB (`37921ad8f03180fc98fe000b0b0151fc`)

| 속성명 | 타입 | 설명 |
|--------|------|------|
| 항목명 | `title` | 예: 명함 디자인 |
| 단가 | `number` | 개당 가격 |
| 수량 | `number` | 수량 |
| 금액 | `formula` | 단가 × 수량 자동 계산 |
| Invoices | `relation` | Invoices DB와 연결(역참조) |

> **핵심**: 견적 항목은 노션 페이지 **본문 표(table) 블록이 아니라** Items DB와의 **relation**이다. 따라서 항목 조회는 `notion-to-md` 본문 변환이 아니라 **relation ID로 Items 페이지를 조회**하는 방식이어야 한다. (이전 v1.1의 R-03 "본문 표 블록 전제" 가정은 폐기됨.)

---

## ⚙️ @notionhq/client v5 API 주의사항 (실제 확인 결과)

v5는 v2와 API 표면이 다르다. 아래는 실제 확인된 차이로, 구현 시 반드시 따라야 한다.

| 항목 | v2 (PRD 가정) | v5 (실제) — 채택 방식 |
|------|---------------|----------------------|
| DB 쿼리 | `databases.query({ database_id })` | **`dataSources.query({ data_source_id })`** 사용 |
| DB 속성 확인 | `databases.retrieve` 응답의 `properties` | `databases.retrieve` 응답에 `properties` **없음** → 페이지를 직접 쿼리해 속성 확인 |
| 항목(relation) 조회 | — | `항목` relation의 각 ID로 `pages.retrieve` 또는 별도 쿼리 |

> **⚠️ 기존 코드 영향**: `app/api/notion/verify/route.ts`는 현재 `notion.databases.retrieve(...)`로 연결 여부만 확인한다. 단순 연결 확인 용도로는 동작하나, **속성/데이터 조회에는 사용 불가**(v5에서 properties 미반환). F002 목록 조회는 반드시 `dataSources.query`로 구현한다.

---

## 🧭 현재 코드베이스 상태 진단 (Greenfield 아님)

이 로드맵은 **백지 상태가 아니라 "스캐폴딩 완료 + 비즈니스 로직 미구현"** 상태를 전제로 한다. 추정 공수는 이 사실을 반영한다.

### ✅ 이미 완료된 것

| 파일 | 상태 |
|------|------|
| `lib/notion/client.ts` — `createNotionClient()` | ✅ `.env`(`NOTION_API_KEY`) 토큰으로 초기화 |
| `lib/env.ts` — `appUrl`, `notionToken`(=`NOTION_API_KEY`), `notionDatabaseId` getter (fail-fast) | ✅ |
| `app/api/notion/verify/route.ts` — 노션 연동 상태 GET | ✅ (단순 연결 확인. v5 속성 조회 한계 있음) |
| `app/api/invoices/[id]/share/route.ts` — `shareUrl` 반환 GET (`/view/[id]`) | ✅ |
| `app/(app)/settings/notion/notion-client.tsx` — 연동 테스트 버튼 UI | ✅ |
| `proxy.ts` — `NextResponse.next()` 패스스루 | ✅ (가드 불필요, 공개 서비스) |
| 라우트 그룹 2종 `(marketing)`, `(app)` + 모든 페이지 Server/Client 셸 | ✅ |
| `types/index.ts` — `InvoiceSummary` (`notionPageId`, `title`, `amount`, `lastEditedAt`) | ✅ |
| `lib/notion/mappers.ts` — `mapPageToInvoiceSummary()`, `mapPageToInvoiceItem()`, `mapPageToInvoiceDetail()` | ✅ |
| `lib/notion/invoice-fetcher.ts` — `getInvoiceDetail()` 서버 전용 유틸 (pages.retrieve + relation 병렬 조회) | ✅ |
| `app/api/notion/invoices/route.ts` — `dataSources.query` → `InvoiceSummary[]` 반환, 에러 코드별 한국어 정규화 | ✅ |
| `app/(app)/dashboard/invoices/invoices-client.tsx` — 실제 `/api/notion/invoices` API 연동, 에러/빈/로딩 상태 UI | ✅ |
| `lib/dummy/invoices.ts` — `DUMMY_INVOICES`, `DUMMY_INVOICE_DETAIL`, `getDummyInvoiceDetail` | ✅ |
| `components/invoice/invoice-view.tsx` — `InvoiceDetail` props, 항목 표, 총금액, `isPreview` 배너, 반응형 | ✅ |
| `app/(marketing)/view/[token]/page.tsx` — `getInvoiceDetail` 실 노션 API 연동, null 분기 안내 페이지 + 홈 링크 | ✅ |
| `app/(app)/dashboard/invoices/[id]/preview/preview-client.tsx` — `InvoiceView` + `isPreview={true}` + 실 노션 데이터 | ✅ |
| `app/(app)/dashboard/invoices/[id]/invoice-detail-client.tsx` — 실 노션 데이터, 메타정보 카드 + `InvoiceView` | ✅ |
| `components/invoice/invoice-pdf.tsx` — `@react-pdf/renderer` PDF 문서 컴포넌트, Noto Sans KR 한글 폰트 등록 | ✅ |
| `app/api/pdf/[token]/route.ts` — `renderToBuffer` 서버 스트림 PDF 생성, 무효 토큰 404 처리 | ✅ |
| `public/fonts/NotoSansKR-Regular.ttf`, `public/fonts/NotoSansKR-Bold.ttf` — 한글 TTF 폰트 번들 | ✅ |

### ❌ 아직 없는 것 (구현 대상)

| 파일 | 미구현 내용 | 기능 ID |
|------|-------------|---------|
| Playwright E2E 스펙 (`tests/`) | 테스트 파일 0개 | 품질 |

---

## 🗺️ 전체 로드맵 개요

가정: **개발 인력 1명(단일 개발자)**, 작업일 환산, 시작일 **2026-06-08(월)**. 각 Phase에 15% 버퍼 포함. 인증/DB 제거로 v1.1의 Phase 0(DB·미들웨어)·Phase 1(인증)이 사라져 전체 일정이 단축됐다. v2.1에서 **Phase A-1(UI/UX 완성 — 더미 데이터)**을 신설해 전체 일정이 약 1주 순연됐다.

```
2026-06-08 ──────────────────────────────────────────────────► 2026-07-17 (약 5.5주 / 영업일 27일)

Phase A    노션 연동 — 목록 조회        [06/08 ─ 06/16]  ██████ (영업일 6일)
  └ F002  dataSources.query → 목록 렌더            ← 실제 데이터 공급

Phase A-1  UI/UX 완성 — 더미 데이터     [06/17 ─ 06/23]  █████ (영업일 5일)  ★ 신설
  └ 더미 데이터로 목록/미리보기/공개뷰 화면 완성, invoice-view 컴포넌트 구축

Phase B    공유 & 웹 렌더링 — 핵심 가치  [06/24 ─ 07/07]  █████████ (영업일 9일)
  └ F003 공유 URL 복사 / F004 공개 뷰 / F006 미리보기 (더미 → 실제 노션 데이터로 교체)

Phase C    PDF 다운로드 & 에러 처리      [07/08 ─ 07/14]  ██████ (영업일 5일)
  └ F005 서버 PDF + 무효 토큰 안내 페이지

Phase D    하드닝 & 출시                 [07/15 ─ 07/17]  ███ (영업일 3일)
  └ E2E, 반응형/접근성, Vercel 배포
```

### 의존성 그래프 (핵심 경로)

```
Phase A (F002: dataSources.query 목록 조회)
   │  (목록이 견적서 페이지 ID·데이터를 공급)
   ▼
Phase A-1 (UI/UX 완성 — 더미 데이터로 화면/컴포넌트 선구축)
   │  (invoice-view 등 렌더 컴포넌트 구조를 B에서 실데이터로 재사용)
   ▼
Phase B (F003 공유 URL 복사  →  F004 공개 뷰 렌더  →  F006 미리보기)
   │  (F004의 견적서 데이터 구조가 PDF 입력)
   ▼
Phase C (F005 PDF 생성 + 무효 토큰 안내)
   │
   ▼
Phase D (E2E + 배포)
```

핵심 경로(Critical Path): **A(F002) → A-1(UI 골격) → B(F004) → C(F005)**. F003(URL 복사)·F006(미리보기)은 B 내부에서 F004와 부분 병렬 가능. Phase A-1은 더미 데이터로 UI를 선완성해 B에서 데이터 바인딩만 교체하도록 리스크를 낮춘다.

### 우선순위 요약 (MoSCoW)

| 우선순위 | 기능 | Phase |
|----------|------|-------|
| **Must (MVP)** | F002(목록), F003(공유 URL 복사), F004(공개 뷰), F005(PDF), F006(미리보기) | A~C |
| **Must (선행 UI)** | invoice-view 공용 컴포넌트, 목록/미리보기/공개뷰 화면 골격(더미) | A-1 |
| **Should** | Playwright E2E, 무효 토큰 안내 UX, 모바일 반응형 | A-1~D |
| **Could** | 목록 로딩 스켈레톤, 토스트 세분화, 빈 상태 일러스트, 노션 응답 캐싱 | D |
| **Won't (제외)** | **F010(로그인/인증)**, **F012(공유 링크 비활성화 토글)**, 회원가입, OAuth, 열람 통계, 이메일 발송, 만료일, 커스텀 브랜딩, 서명/승인, 다국어, 외부 편집, 다중 DB, 버전 관리, 팀 관리 | — |

> **F010(로그인)·F012(링크 비활성화) → Won't 사유**: v2.0에서 인증과 DB를 제거했다. 인증이 없으므로 F010은 불필요하다. 공유 링크는 노션 페이지 ID 그 자체이며 비활성화 상태를 저장할 DB가 없으므로 F012는 구현 불가다. 링크 무효화가 필요하면 노션에서 해당 페이지의 공유/권한을 조정하거나 페이지를 보관(archive)하는 운영 방식으로 대체한다.

---

## 🚀 마일스톤별 상세 계획

### Phase A: 노션 연동 — 목록 조회 (영업일 6일, 06/08 ~ 06/16) — `F002`

**목표**: `.env` 노션 자격으로 Invoices DB에서 견적서 목록을 실제로 불러와 대시보드에 표시한다. **모든 후속 Phase의 데이터 소스.**

#### 완료 기준 (Definition of Done)

- [x] `app/api/notion/invoices` 가 `dataSources.query`로 Invoices DB를 조회해 `InvoiceSummary[]`(notionPageId·title·amount·lastEditedAt)를 반환 (501 제거)
- [x] 견적서 목록 페이지가 견적서 번호(title)·총금액(amount)·최종 수정일을 실제 노션 데이터로 표시
- [x] `목록 새로고침` 동작 시 노션 최신 데이터 재조회
- [x] 빈 목록 / 노션 오류(권한 없음, DB 미공유) 시 사용자 친화적 안내 표시
- [ ] 위 동작에 대한 Playwright MCP happy path + 에러 케이스 검증 통과

#### 주요 태스크

| 태스크 | 예상 공수 | 우선순위 | 의존성 | 관련 ID |
|--------|-----------|----------|--------|---------|
| v5 `dataSources.query` 시그니처 확인 + Invoices DB의 data_source_id 획득 절차 정리 | 0.5일 | Must | — | R-01 |
| 속성 매핑 유틸 작성: 노션 `견적서 번호`/`총금액`/`발행일`/페이지 메타 → `InvoiceSummary` | 1일 | Must | 위 | F002, R-02 |
| `api/notion/invoices` GET 구현: `dataSources.query` → 정규화 → `InvoiceSummary[]` | 1.5일 | Must | 매핑 유틸 | F002 |
| 노션 오류 응답 정규화(권한/미공유/rate limit) → 일관된 에러 페이로드 | 0.5일 | Must | invoices API | F002, R-06 |
| `invoices-client.tsx` 데이터 바인딩 + 새로고침 버튼 + 빈/로딩/에러 상태 | 1.5일 | Must | invoices API | F002 |
| 페이지네이션(노션 `has_more`/`next_cursor`) 처리 | 0.5일 | Should | invoices API | R-06 |

#### 테스트 계획

| 테스트 항목 | 테스트 방법 | Playwright MCP 시나리오 | 완료 조건 |
|------------|------------|------------------------|----------|
| 견적서 목록 조회 (happy path) | Playwright MCP | `browser_navigate('/dashboard/invoices')` → `browser_snapshot` | 견적서 번호·총금액·수정일 표시 |
| 목록 API 응답 검증 | Playwright MCP | `browser_navigate('/dashboard/invoices')` → `browser_network_request`로 `/api/notion/invoices` 응답 확인 | 200 + `InvoiceSummary[]` 구조 반환 |
| 목록 새로고침 | Playwright MCP | `browser_click('새로고침')` → `browser_network_request` | 노션 재조회 발생, 갱신된 데이터 표시 |
| 빈 목록 상태 | Playwright MCP | 빈 DB 조건 → `browser_snapshot` | 빈 상태 안내 메시지 표시 |
| 노션 오류 처리 | Playwright MCP | 잘못된 토큰/미공유 조건 → `browser_snapshot` + `browser_console_messages` | 사용자 친화적 에러 안내, 콘솔에 토큰 미노출 |

#### 산출물

- 동작하는 `api/notion/invoices` + 견적서 목록 화면
- 노션 속성 → `InvoiceSummary` 매핑 유틸 (예: `lib/notion/mappers.ts`)

---

### Phase A-1: UI/UX 완성 — 더미 데이터 (영업일 5일, 06/17 ~ 06/23) — `UI 선행`

**목표**: 실제 노션 API 호출 없이 **더미 데이터(하드코딩)**로 목록·미리보기·공개 뷰의 모든 화면과 공용 렌더링 컴포넌트(`invoice-view`)를 완성한다. 이후 Phase B에서 더미 데이터를 실제 노션 조회 결과로 **교체만** 하면 되도록 UI/데이터 바인딩 지점을 분리한다.

> **신설 사유**: 데이터 소스(노션)와 UI를 분리해 개발한다. 더미 데이터로 화면을 먼저 완성하면 (1) 디자인/레이아웃 이슈를 노션 연동 전에 조기 발견하고, (2) Phase B에서 `invoice-view` 등 컴포넌트를 재구현 없이 재사용해 데이터 바인딩 작업만 남길 수 있다. F002(실 목록 API)는 Phase A에서 완료되지만, 공개 뷰·항목 relation 조회는 Phase B에서 본격 구현되므로 그 전에 UI 골격을 선확보한다.

#### 완료 기준 (Definition of Done)

- [ ] 견적서 목록 페이지(`invoices-client.tsx`)가 더미 `InvoiceSummary[]`로 테이블(견적서 번호/총금액/최종 수정일)을 렌더링하고, 로딩/빈 상태 UI와 새로고침 버튼 스타일을 갖춤
- [x] 목록 각 행의 `공유 URL 복사` 버튼이 더미 `notionPageId`로 클립보드 복사 + sonner 토스트를 표시
- [x] 목록의 `미리보기` 버튼이 미리보기 페이지로 이동
- [x] 공용 렌더링 컴포넌트 `components/invoice/invoice-view.tsx`가 더미 견적서 데이터 타입을 정의하고 견적서 번호/클라이언트명/발행일/유효기간/항목 표/총금액을 렌더링 (Phase B/C에서 그대로 재사용 가능한 구조)
- [x] 공개 뷰 `view/[token]/page.tsx`가 `invoice-view`로 더미 데이터를 렌더링
- [x] 미리보기 `preview-client.tsx`가 `invoice-view`를 재사용 + "관리자 미리보기" 배너 표시
- [x] 모바일(375px) 반응형 레이아웃 정상 동작
- [ ] 위 화면에 대한 Playwright MCP 스냅샷 검증 통과

#### 주요 태스크

| 태스크 | 예상 공수 | 우선순위 | 의존성 | 관련 ID |
|--------|-----------|----------|--------|---------|
| 더미 데이터 모듈 작성: `InvoiceSummary[]` + 상세 견적서(항목 포함) 더미 픽스처 (`lib/dummy/invoices.ts`) | 0.5일 | Must | — | UI 선행 |
| `invoices-client.tsx` 더미 바인딩: 테이블 렌더 + 로딩/빈 상태 + 새로고침 버튼 스타일 | 1일 | Must | 더미 데이터 | UI 선행 |
| 목록 행 `공유 URL 복사` 버튼 UI: 클립보드 복사 + sonner 토스트 (더미 notionPageId) | 0.5일 | Must | invoices-client | UI 선행 |
| `미리보기` 버튼 → 미리보기 페이지 라우팅 연결 | 0.5일 | Must | invoices-client | UI 선행 |
| **공용 렌더링 컴포넌트** `components/invoice/invoice-view.tsx`: 더미 견적서 타입 정의 + 전체 레이아웃(번호/클라이언트/일자/유효기간/항목 표/총금액) | 2일 | Must | 더미 데이터 | UI 선행 |
| `view/[token]/page.tsx`: `invoice-view`로 더미 데이터 렌더 | 0.5일 | Must | invoice-view | UI 선행 |
| `preview-client.tsx`: `invoice-view` 재사용 + "관리자 미리보기" 배너 | 0.5일 | Must | invoice-view | UI 선행 |
| 모바일 반응형 스타일링(목록/공개뷰/미리보기) | 0.5일 | Should | invoice-view | UI 선행 |

#### 테스트 계획

| 테스트 항목 | 테스트 방법 | Playwright MCP 시나리오 | 완료 조건 |
|------------|------------|------------------------|----------|
| 목록 화면(더미) | Playwright MCP | `browser_navigate('/dashboard/invoices')` → `browser_snapshot` | 더미 견적서 번호·총금액·수정일 테이블 표시 |
| 공유 URL 복사 버튼(더미) | Playwright MCP | `browser_click('공유 URL 복사')` → `browser_evaluate`로 클립보드 확인 → `browser_snapshot`(토스트) | 클립보드에 `/view/[더미ID]` URL, 토스트 표시 |
| 미리보기 이동 | Playwright MCP | 목록에서 `browser_click('미리보기')` → `browser_snapshot` | 미리보기 페이지로 이동 + "관리자 미리보기" 배너 |
| 공개 뷰 렌더(더미) | Playwright MCP | `browser_navigate('/view/[더미token]')` → `browser_snapshot` | 견적서 번호/클라이언트명/발행일/항목 표/총금액 표시 |
| invoice-view 재사용 일치 | Playwright MCP | 공개 뷰와 미리보기 각각 `browser_snapshot` 비교 | 두 화면 렌더 동일(배너만 차이) |
| 모바일 반응형 | Playwright MCP | `browser_resize(375, 812)` → `browser_snapshot` | 모바일 레이아웃 정상, 항목 표 가독성 유지 |

#### 산출물

- 더미 데이터 픽스처 (`lib/dummy/invoices.ts`)
- 재사용 가능한 `components/invoice/invoice-view.tsx` (더미 데이터 기준 완성, Phase B에서 실데이터로 교체)
- 더미 기반으로 완성된 목록/공개뷰/미리보기 화면 + 공유 URL 복사 버튼

> **Phase B 연계**: 본 Phase의 산출물은 더미 데이터에 의존한다. Phase B에서 (1) `invoices-client`의 더미 소스를 `/api/notion/invoices` 호출로, (2) `view`/`preview`의 더미 견적서를 노션 페이지+항목 relation 조회 결과로 교체한다. `invoice-view`의 props 타입은 Phase B에서 확정될 실제 견적서 데이터 구조와 정렬되도록 설계할 것.

---

### Phase B: 공유 & 웹 렌더링 — 핵심 가치 (영업일 9일, 06/24 ~ 07/07) — `F003`, `F004`, `F006`

**목표**: 관리자가 목록에서 공유 URL(`/view/[notionPageId]`)을 복사하고, 클라이언트가 그 URL로 견적서를 웹에서 본다. **제품의 핵심 결과물.**

#### 완료 기준 (Definition of Done)

- [ ] 목록 각 행에 `공유 URL 복사` 버튼이 있고, 클릭 시 `${appUrl}/view/[notionPageId]` 절대 URL을 클립보드에 복사 + 토스트 표시 (`/api/invoices/[id]/share`의 shareUrl 활용)
- [x] 공개 뷰 `/view/[token]`이 `token`(=노션 페이지 ID)으로 Invoices 페이지를 조회하고, `항목` relation을 따라 Items를 조회해 견적서로 렌더링 (견적서 번호/클라이언트명/발행일/유효기간/항목 표/총금액)
- [x] 미리보기 페이지가 공개 뷰와 **동일한 렌더링 컴포넌트(`invoice-view`)를 재사용** + "관리자 미리보기" 배너
- [x] 모바일 반응형 레이아웃 동작
- [ ] 위 동작에 대한 Playwright MCP 검증 통과

#### 주요 태스크

| 태스크 | 예상 공수 | 우선순위 | 의존성 | 관련 ID |
|--------|-----------|----------|--------|---------|
| 목록 행 `공유 URL 복사` 버튼 + 클립보드 복사 + sonner 토스트 | 1일 | Must | F002, share API | F003 |
| 항목 조회 유틸: Invoices 페이지의 `항목` relation ID들로 Items `pages.retrieve` → 항목 배열(항목명/단가/수량/금액) | 2일 | Must | F002 | F004, R-03 |
| 견적서 데이터 조립 유틸: 페이지 속성 + 항목 + 합계를 렌더용 구조로 결합 | 1일 | Must | 항목 조회 유틸 | F004 |
| **공용 렌더링 컴포넌트** `components/invoice/invoice-view.tsx` (견적서 번호/클라이언트/일자/항목 표/총금액) | 2.5일 | Must | 데이터 조립 | F004, F006 |
| `view/[token]/page.tsx` Server Component: token으로 조회 → 렌더 / 조회 실패 시 분기 | 1.5일 | Must | invoice-view | F004 |
| 미리보기 페이지: `invoice-view` 재사용 + "관리자 미리보기" 배너 + 공유 URL 복사 | 1일 | Must | invoice-view | F006 |
| 모바일 반응형 스타일링 | 1일 | Should | invoice-view | F004 |

#### 테스트 계획

| 테스트 항목 | 테스트 방법 | Playwright MCP 시나리오 | 완료 조건 |
|------------|------------|------------------------|----------|
| 공유 URL 복사 | Playwright MCP | 목록에서 `browser_click('공유 URL 복사')` → `browser_evaluate`로 클립보드 확인 → `browser_snapshot`(토스트) | 클립보드에 `/view/[notionPageId]` 절대 URL, 토스트 표시 |
| 공개 뷰 렌더링 (happy path) | Playwright MCP | `browser_navigate('/view/[유효한 노션페이지ID]')` → `browser_snapshot` | 견적서 번호/클라이언트명/발행일/항목 표/총금액 표시 |
| 항목 relation 조회 검증 | Playwright MCP | 공개 뷰 진입 → `browser_network_request` | Items 조회 발생, 항목명·단가·수량·금액 렌더 |
| 미리보기 = 공개 뷰 일치 | Playwright MCP | 목록 → `browser_click('미리보기')` → `browser_snapshot` | 공개 뷰와 동일 렌더 + "관리자 미리보기" 배너 |
| 모바일 반응형 | Playwright MCP | `browser_resize(375, 812)` → `browser_snapshot` | 모바일 레이아웃 정상, 항목 표 가독성 유지 |
| 잘못된 페이지 ID | Playwright MCP | `browser_navigate('/view/invalid-id')` → `browser_snapshot` | 안내 페이지 표시(에러 처리는 Phase C에서 완성) |

#### 산출물

- 재사용 가능한 `components/invoice/invoice-view.tsx`
- 동작하는 공유 URL 복사 + 공개 뷰 + 미리보기
- 항목 relation 조회/데이터 조립 유틸

> **참고(R-02/R-03 해소)**: 노션 DB 스키마와 항목 relation 구조는 실제 API 조회로 확정됐다(상단 "노션 DB 스키마" 섹션). 단, **샘플 견적서로 조기 검증**해 속성명/relation 깊이가 실제와 일치하는지 Phase B 착수 직후 확인할 것.

---

### Phase C: PDF 다운로드 & 에러 처리 (영업일 5일, 07/08 ~ 07/14) — `F005`

**목표**: 클라이언트가 공개 뷰에서 견적서를 PDF로 다운로드하고, 잘못된/접근 불가 페이지 ID는 안내 페이지로 처리된다.

#### 완료 기준 (Definition of Done)

- [x] 공개 뷰의 `PDF 다운로드` 버튼이 `/api/pdf/[token]` 호출로 PDF 파일을 다운로드 (501 제거, stale `SharedInvoice` TODO 주석 정리)
- [x] PDF가 웹 렌더와 동일한 데이터(견적서 번호/클라이언트/항목/총금액)를 포함
- [x] **한글이 깨지지 않고** 정상 표시 (한글 .ttf 폰트 `Font.register`)
- [x] 없는/접근 불가/잘못된 페이지 ID 접근 시 안내 페이지 표시 + 홈 링크
- [x] 위 동작에 대한 Playwright MCP 검증 통과

#### 주요 태스크

| 태스크 | 예상 공수 | 우선순위 | 의존성 | 관련 ID |
|--------|-----------|----------|--------|---------|
| PDF 문서 컴포넌트 `components/invoice/invoice-pdf.tsx` (@react-pdf/renderer) | 2일 | Must | Phase B 데이터 구조 | F005 |
| `api/pdf/[token]` 구현: token(노션 페이지 ID)으로 조회 → PDF 스트림 반환 (`Content-Type: application/pdf`) | 1.5일 | Must | invoice-pdf, F004 조회 유틸 | F005 |
| 한글 폰트 임베딩(.ttf 번들 + `Font.register`) | 1일 | Must | invoice-pdf | F005, R-05 |
| 공개 뷰 `PDF 다운로드` 버튼 연결 | 0.5일 | Must | pdf API | F005 |
| 무효 페이지 ID 안내 페이지(`view/[token]` 조회 실패 분기 + `not-found`) | 1일 | Must | F004 | F004 |

#### 테스트 계획

| 테스트 항목 | 테스트 방법 | Playwright MCP 시나리오 | 완료 조건 |
|------------|------------|------------------------|----------|
| PDF 다운로드 | Playwright MCP | 공개 뷰에서 `browser_click('PDF 다운로드')` → `browser_network_request`로 `/api/pdf/[token]` 응답 확인 | 200 + `Content-Type: application/pdf` |
| 한글 PDF 렌더링 | 수동 확인 | 다운로드된 PDF 열기 | 한글 깨짐(□) 없이 정상 표시 |
| 없는 페이지 ID 접근 | Playwright MCP | `browser_navigate('/view/00000000-0000-0000-0000-000000000000')` → `browser_snapshot` | 안내 페이지 표시 + 홈 링크 |
| 접근 불가 ID PDF 요청 | Playwright MCP | 잘못된 token으로 `/api/pdf/[token]` 요청 → `browser_network_request` | 4xx 반환, 노션 데이터 비노출 |

#### 산출물

- 동작하는 PDF 다운로드(한글 정상), 무효 페이지 안내

> **⚠️ 기술 리스크 R-05**: `@react-pdf/renderer`는 한글 폰트를 별도 등록하지 않으면 깨진다(□). 한글 .ttf 번들 + `Font.register` 필요. 폰트 파일 크기/라이선스(예: Pretendard, Noto Sans KR) 확인.
> **결정 — 서버 사이드 PDF**: 라우트 구조(`api/pdf/[token]/route.ts`)대로 **서버 스트림 생성**을 채택. 노션 자격을 클라이언트에 노출하지 않고 페이지 ID 검증을 서버에서 일괄 처리한다. 현 라우트의 TODO 주석에 남은 `SharedInvoice(is_active)` 참조는 DB 제거로 무효이므로 구현 시 정리한다.

---

### Phase D: 하드닝 & 출시 (영업일 3일, 07/15 ~ 07/17)

**목표**: 핵심 플로우 E2E 검증, 반응형/접근성 점검 후 Vercel 프로덕션 배포.

#### 완료 기준 (Definition of Done)

- [ ] 핵심 플로우 Playwright E2E 통과: 목록 조회 → 공유 URL 복사 → 공개 뷰 → PDF 다운로드
- [ ] `NOTION_API_KEY`가 어떤 응답·로그·클라이언트 번들에도 노출되지 않음 확인
- [ ] 주요 페이지 키보드 내비게이션·aria 속성 점검
- [ ] `npm run build` 및 `npm run lint` 무오류
- [ ] Vercel 프로덕션 배포 + 환경변수(`NOTION_API_KEY`, `NOTION_DATABASE_ID`, `NEXT_PUBLIC_APP_URL`) 설정
- [ ] 프로덕션 스모크 테스트(목록~PDF) 통과

#### 주요 태스크

| 태스크 | 예상 공수 | 우선순위 | 의존성 | 관련 ID |
|--------|-----------|----------|--------|---------|
| Playwright E2E: 목록→복사→공개뷰→PDF 시나리오 (노션은 모킹) | 1.5일 | Should | 전 기능 | 품질 |
| 보안 점검: 노션 토큰 비노출(응답/번들/로그), 잘못된 token 접근 | 0.5일 | Must | Phase C | 보안 |
| 접근성/반응형 최종 패스 | 0.5일 | Should | Phase B/C | 품질 |
| Vercel 배포 + 환경변수 구성 + 스모크 테스트 | 1일 | Must | 전 기능 | 배포 |

#### 테스트 계획

| 테스트 항목 | 테스트 방법 | Playwright MCP 시나리오 | 완료 조건 |
|------------|------------|------------------------|----------|
| E2E 핵심 플로우 | Playwright MCP | `browser_navigate('/dashboard/invoices')` → 복사 → `browser_navigate('/view/[id]')` → `browser_click('PDF 다운로드')`, 각 단계 `browser_snapshot` | 전 단계 정상 완료 |
| 토큰 비노출 | Playwright MCP | 공개 뷰·API 응답 → `browser_network_request` + `browser_console_messages` | 응답/콘솔에 `NOTION_API_KEY` 미포함 |
| 키보드 내비게이션 | Playwright MCP | `browser_press_key('Tab')` 반복 → `browser_snapshot` | 주요 버튼/링크 포커스 이동 |
| 프로덕션 스모크 | Playwright MCP | 프로덕션 URL에서 목록~PDF `browser_navigate` + `browser_snapshot` | 전 단계 정상 완료 |
| 빌드/린트 | CLI | `npm run build` / `npm run lint` | 오류 없음 |

#### 산출물

- 프로덕션 배포된 MVP, `tests/` Playwright 스펙

---

## ⚠️ 리스크 레지스터

| ID | 리스크 | 심각도 | 발생 가능성 | 완화 전략 |
|----|--------|--------|-------------|-----------|
| **R-01** | `@notionhq/client` v5 API가 v2와 상이 (`databases.query` 없음) | 중간 | 낮음 (확인 완료) | **확인 완료**: `dataSources.query` 사용으로 확정. Phase A 착수 시 data_source_id 획득 절차만 검증 |
| **R-02** | 노션 DB 속성명/타입 규약 | 낮음 | 낮음 (확인 완료) | **확인 완료**: Invoices/Items 스키마 상단 명시. 구현 시 샘플 페이지로 대조만 수행 |
| **R-03** | 견적 항목/합계 데이터 위치 | 낮음 | 낮음 (확인 완료) | **확인 완료**: 항목은 Items DB **relation**(본문 표 아님). relation ID로 `pages.retrieve` 조회 |
| **R-05** | `@react-pdf/renderer` 한글 폰트 미지원 → PDF 깨짐 | 중간 | 높음 | 한글 .ttf 번들 + `Font.register`. 파일 크기/라이선스 확인 (Phase C) |
| **R-06** | 노션 API rate limit(평균 약 3req/s) + relation 다중 조회로 호출량 증가 | 중간 | 중간 | 항목 조회 배치/병렬 제한, 짧은 `revalidate` 캐싱, 새로고침 디바운스 |
| **R-08** | 1인 개발 일정 산정의 낙관 편향 | 중간 | 중간 | Phase별 15% 버퍼 + Phase D 출시 버퍼. 주간 회고로 속도 재조정 |

> **R-07(인증 미들웨어 누락) 제거**: v2.0은 인증이 없고 전 페이지가 공개이므로 보호 경로 가드 리스크가 소멸했다. `proxy.ts`는 패스스루만 수행한다.

---

## 🔧 기술 부채 관리

| 의도된 부채 | 사유 | 해소 계획 (MVP 이후) |
|-------------|------|----------------------|
| 노션 속성명 **하드코딩 매핑**(견적서 번호/총금액 등) | MVP 속도 우선 | 속성 매핑 설정 UI |
| 견적서 **단일 고정 템플릿** | 커스텀 브랜딩 MVP 제외 | 템플릿/색상/로고 편집기 |
| 공유 링크 **무효화 불가**(DB 없음) | 인증/DB 제거로 상태 저장 불가 | 노션 페이지 보관(archive) 운영 가이드, 필요 시 경량 KV로 차단 목록 |
| 요청 시점 **실시간 노션 조회**(캐시 최소) | 영속 저장소 없음 | 짧은 `revalidate` + 선택적 엣지 캐시 |
| Playwright에서 **노션 API 모킹** | 실 토큰 의존성 회피 | 스테이징 전용 노션 워크스페이스로 통합 테스트 |

---

## 📊 진행 추적

### 스프린트 계획 가이드

- **주기**: 2주 스프린트. Phase A+A-1 = 스프린트 1, Phase B = 스프린트 2, Phase C+D = 스프린트 3 권장.
- **데모**: 각 Phase 종료 시 "독립 데모 가능" 상태 확인 (A=실 목록 표시, A-1=더미 데이터로 전 화면 UI 시연, B=공유 URL로 견적서 열람, C=PDF 받기, D=프로덕션 동작).
- **회고**: 매 스프린트 말 속도(velocity) 점검 후 잔여 Phase 일정 재산정 (R-08 대응).
- **DoD 게이트**: 각 Phase의 완료 기준 체크박스가 전부 충족돼야(Playwright MCP 검증 포함) 다음 Phase 착수.

### 변경 관리 프로세스 (PRD 변경 시)

1. 변경 요청을 기능 ID(F0xx)에 매핑 → 영향 받는 Phase/태스크 식별
2. 핵심 경로(A→B→C) 영향 여부 판정 → 일정 영향 산정
3. MVP 범위 변경이면 본 로드맵의 MoSCoW 표와 해당 Phase를 함께 갱신, 문서 버전 올림
4. 노션 스키마 변경은 상단 "노션 DB 스키마" 섹션과 동시 갱신
5. 인증/DB 재도입 요청 시 v2.0의 무인증·무DB 전제가 무효화됨을 명시하고 별도 설계 단계 추가

---

## 📝 용어집

| 용어 | 정의 |
|------|------|
| 관리자 | 견적서를 작성·공유하는 1인 사업자/프리랜서 (로그인 없이 대시보드 접근) |
| 클라이언트 | 공유 URL로 견적서를 받는 수신자 (가입 불필요) |
| Integration 토큰 | 노션 API 접근용 비밀 토큰 (`NOTION_API_KEY`, `.env` 고정, 서버 전용 — 클라이언트 비노출) |
| 공유 토큰 | 별도 발급/저장 없음. **노션 페이지 ID 자체**가 토큰이며 공개 URL `/view/[notionPageId]`에 사용 |
| Invoices DB / Items DB | 노션 데이터베이스. 견적서 메타(Invoices)와 견적 항목(Items)이 relation으로 연결 |
| `dataSources.query` | @notionhq/client v5에서 DB 행을 조회하는 API (v2의 `databases.query` 대체) |
| relation 조회 | Invoices의 `항목` relation ID로 Items 페이지를 `pages.retrieve` 하는 방식 |
| iconKey 패턴 | Server→Client 직렬화 회피용, 아이콘을 문자열 키로 매핑하는 프로젝트 컨벤션 |
| FieldWrapper | 레이블·에러·설명을 통합하는 폼 필드 래퍼 컴포넌트 |

---

## ✅ 자가 검증 체크리스트 (작성자 확인 완료)

- [x] PRD의 MVP 기능(F002~F006)이 최소 1개 Phase 태스크에 매핑됨
- [x] 인증/DB 제거(F010·F012 → Won't) 반영, 노션 페이지 ID = 공유 토큰으로 통일
- [x] 각 Phase가 독립적으로 데모 가능하도록 DoD 정의됨
- [x] 기술 의존성 순서 반영(실 목록 조회 → 더미 UI 선완성 → 공유/렌더 → PDF → 배포)
- [x] 리스크 6건 식별(R-01·R-02·R-03 확인 완료, R-07 제거)
- [x] 현재 코드베이스 실제 상태(완료/501 미구현) 반영해 공수 산정 (1인 개발, 2026-06-08 시작)
- [x] 노션 DB 스키마(실제 API 조회) + v5 API 주의사항 명시
- [x] 각 Phase(A~D)에 Playwright MCP 테스트 계획 포함, API/비즈니스 로직 태스크에 시나리오 1:1 매핑
