# Development Guidelines

## Project Overview

- **목적**: 노션 데이터베이스의 견적서를 공개 URL로 공유하고 PDF로 다운로드하는 웹앱
- **스택**: Next.js 16, React 19, TypeScript, Notion API, Tailwind v4, shadcn/ui
- **인증**: 없음 (단일 관리자, 노션 토큰은 서버 환경변수로만 관리)
- **상태**: F002~F005 기능 구현 진행 중 (TODO 주석으로 표시된 미완성 구현 다수)

---

## Project Architecture

### Route Groups

| 그룹 | 경로 | 레이아웃 | 접근 |
|------|------|---------|------|
| `(marketing)` | `/`, `/privacy`, `/terms`, `/view/[token]` | 헤더+푸터 | 공개 |
| `(app)` | `/dashboard/invoices/**`, `/settings/notion` | 사이드바 | 공개 (인증 없음) |

- `/dashboard` → `/dashboard/invoices` 리다이렉트

### 디렉터리 구조

```
app/(app)/dashboard/invoices/       → 견적서 목록·상세
app/(app)/settings/notion/          → 노션 연동 설정
app/(marketing)/view/[token]/       → 공개 견적서 뷰
app/api/notion/verify/route.ts      → 노션 연동 검증
app/api/notion/invoices/route.ts    → 견적서 목록 조회
app/api/invoices/[id]/share/route.ts → 공유 링크 URL 반환
app/api/pdf/[token]/route.ts        → PDF 스트림 반환
lib/notion/client.ts                → 노션 클라이언트 팩토리
lib/env.ts                          → 환경변수 접근 헬퍼 (NOTION_API_KEY, NOTION_DATABASE_ID만)
lib/constants.ts                    → siteConfig, dashboardNav
lib/validations/                    → Zod 스키마
types/index.ts                      → 전역 타입 정의
components/ui/                      → shadcn/ui 컴포넌트
components/forms/field-wrapper.tsx  → 폼 필드 래퍼
components/layout/nav-main.tsx      → 사이드바 네비게이션
```

---

## ⚠️ Next.js 16 필수 규칙

- **`params`는 반드시 `await` 처리**: `const { id } = await params` (Promise 타입)
- **`cookies()`는 반드시 `await` 처리**: `const cookieStore = await cookies()`
- **`metadata` export는 Server Component에서만** (`"use client"` 파일에서 금지)
- `searchParams`도 동일하게 Promise → `await searchParams`

---

## Server / Client 컴포넌트 분리 규칙

### 패턴 강제

```
app/(app)/feature/
  page.tsx          ← Server Component: metadata export + Client 렌더링만
  feature-client.tsx ← "use client": 폼/훅/상태 로직 전부
```

- **DO**: `page.tsx`에서 `metadata` export 후 `<FeatureClient />`만 반환
- **DON'T**: `page.tsx`에 `useState`, `useEffect`, `useForm` 직접 사용

### Notion 클라이언트

- `lib/notion/client.ts`의 `createNotionClient()`은 **서버 전용** (인자 없음)
- 내부에서 `env.notionToken` 사용 — `.env`에 고정된 단일 관리자 토큰
- **`notion_token`을 클라이언트에 절대 노출 금지**

---

## 환경변수 규칙

- **`process.env.*` 직접 참조 금지** — 반드시 `lib/env.ts`의 `env` 객체 사용
- `env.appUrl` → 공개 URL 생성 시 사용 (NEXT_PUBLIC_APP_URL)
- `env.notionToken` → 서버 전용 (NOTION_API_KEY 환경변수)
- `env.notionDatabaseId` → 서버 전용 (NOTION_DATABASE_ID 환경변수)

---

## 사이드바 아이콘 추가 규칙

**아이콘을 추가할 때 반드시 두 파일을 동시에 수정:**

1. `lib/constants.ts` → `dashboardNav` 항목에 `iconKey: "키이름"` 추가
2. `components/layout/nav-main.tsx` → `iconMap`에 `키이름: <IconComponent />` 추가

- **DO**: `iconKey: "fileText"` → iconMap에서 `<FileText />` 매핑
- **DON'T**: Server Component에서 React 엘리먼트(`<FileText />`)를 props로 직접 전달

---

## 폼 구현 규칙

### 필수 패턴

```tsx
// lib/validations/feature.ts
export const featureSchema = z.object({ ... })
export type FeatureFormValues = z.infer<typeof featureSchema>

// feature-client.tsx
const { register, handleSubmit, formState: { errors } } = useForm<FeatureFormValues>({
  resolver: zodResolver(featureSchema),
  defaultValues: { ... },
})
```

- Zod 스키마는 반드시 `lib/validations/` 에 정의
- 폼 필드는 반드시 `<FieldWrapper>` 사용 (label, error, description 통합)
- `aria-invalid={!!errors.fieldName}` 속성 필수

### FieldWrapper 사용법

```tsx
<FieldWrapper label="레이블" htmlFor="fieldId" error={errors.field?.message} required>
  <Input id="fieldId" {...register("field")} aria-invalid={!!errors.field} />
</FieldWrapper>
```

---

## API Route Handler 규칙

- `params`는 `Promise<{...}>` → 반드시 `await params` 처리
- 에러 응답: `NextResponse.json({ error: "..." }, { status: 4xx })` 형식 통일
- 모든 엔드포인트는 공개 (인증 없음)

### 기능별 API 엔드포인트

| 기능 | 메서드 | 경로 |
|------|--------|------|
| 노션 연동 검증 | GET | `/api/notion/verify` |
| 견적서 목록 조회 | GET | `/api/notion/invoices` |
| 공유 링크 URL 반환 | GET | `/api/invoices/[id]/share` |
| PDF 스트림 | GET | `/api/pdf/[token]` |

---

## 타입 규칙

- 도메인 모델(`SharedInvoice`, `InvoiceSummary`) → `types/index.ts`에만 정의
- 새 도메인 타입 추가 시 `types/index.ts` 수정
- 폼 타입은 Zod 스키마에서 `z.infer<>` 추출 → `lib/validations/` 에 위치

---

## 스타일링 규칙

- Tailwind CSS v4: `@import "tailwindcss"` (설정 파일 없음, `tailwind.config` 불필요)
- 클래스 병합: 반드시 `cn()` 사용 (`import { cn } from "@/lib/utils"`)
- 색상: OKLCH 시스템 CSS 변수 사용 (`text-foreground`, `bg-background` 등)
- 다크모드: `next-themes` → `ThemeProvider`가 이미 적용됨, `dark:` 접두사로 처리

---

## 멀티파일 동시 수정 필수 케이스

| 작업 | 수정 파일 |
|------|----------|
| 사이드바 메뉴 추가 | `lib/constants.ts` + `components/layout/nav-main.tsx` |
| 새 도메인 타입 추가 | `types/index.ts` |
| 새 폼 기능 추가 | `lib/validations/[feature].ts` + `app/.../[feature]-client.tsx` |
| 사이트 메타/네비 수정 | `lib/constants.ts` |

---

## 현재 미구현 기능 (TODO)

- **F002**: 견적서 목록 조회 → `app/api/notion/invoices/route.ts` + `invoices-client.tsx`에서 fetch 후 렌더링
- **F003**: 공유 링크 → 노션 페이지 ID를 그대로 토큰으로 사용, `/view/[id]` URL 복사 버튼 UI
- **F004**: 공개 견적서 뷰 → `app/(marketing)/view/[token]/page.tsx` (노션 페이지 ID로 직접 조회)
- **F005**: PDF 생성 → `app/api/pdf/[token]/route.ts` (`@react-pdf/renderer` 사용, 서버 전용)

---

## ⛔ 금지 사항

- `"use client"` 파일에서 `export const metadata` 사용 금지
- `process.env.*` 직접 참조 금지 (반드시 `lib/env.ts` 경유)
- `NOTION_API_KEY`를 API 응답에 포함하거나 클라이언트에 전달 금지
- Server Component에서 `iconMap`의 React 엘리먼트를 직접 props로 전달 금지
- `params`, `searchParams`, `cookies()`를 `await` 없이 사용 금지
- `tailwind.config.js` 생성 금지 (Tailwind v4는 설정 파일 불필요)
- PDF 생성(`@react-pdf/renderer`)을 Client Component에서 사용 금지 (서버/Route Handler 전용)
- Supabase 관련 패키지·코드 추가 금지 (프로젝트에서 완전 제거됨)
