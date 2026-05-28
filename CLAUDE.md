# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Next.js 버전 주의

이 프로젝트는 **Next.js 16** 입니다. 훈련 데이터와 API, 컨벤션, 파일 구조가 다를 수 있습니다. 코드 작성 전 반드시 `node_modules/next/dist/docs/`의 관련 가이드를 읽고, deprecation 경고를 따르세요.

## 명령어

```bash
npm run dev       # Turbopack 개발 서버 (http://localhost:3000)
npm run build     # Turbopack 프로덕션 빌드
npm run start     # 프로덕션 서버 실행
npm run lint      # ESLint 검사
```

테스트 러너는 Playwright (`@playwright/test`)가 설치되어 있으나 테스트 파일은 아직 없습니다.

## 아키텍처

### Route Groups

두 개의 레이아웃 그룹으로 분리됩니다:

- **`app/(marketing)/`** — 헤더+푸터 레이아웃. 공개 페이지 (`/`, `/privacy`, `/terms`)
- **`app/(app)/`** — 사이드바 레이아웃. 인증 영역 (`/dashboard/**`, `/settings`)

### Server / Client 컴포넌트 분리 패턴

`"use client"` 파일에서는 `metadata`를 export할 수 없습니다. 페이지에 인터랙션이 필요하면 다음 패턴을 사용하세요:

```
app/(app)/settings/
  page.tsx          ← Server Component: metadata export + Client 컴포넌트 렌더링만
  settings-client.tsx  ← "use client": 실제 폼/훅 로직
```

### 사이드바 네비게이션 아이콘

Server Component에서 Client Component로 React 엘리먼트를 직렬화하면 오류가 발생합니다. `dashboardNav` (`lib/constants.ts`)에서는 아이콘 컴포넌트 대신 `iconKey` 문자열을 사용하고, `NavMain` (`components/layout/nav-main.tsx`)의 `iconMap`에서 매핑합니다. 새 아이콘을 추가할 때는 이 두 곳을 함께 수정하세요.

### 스타일링

- Tailwind CSS v4 (`@import "tailwindcss"`) + OKLCH 색상 시스템
- 클래스 병합: `cn()` from `lib/utils.ts` (clsx + tailwind-merge)
- shadcn/ui 컴포넌트: `components/ui/` (radix-nova 스타일, CSS 변수 기반)
- 다크모드: `next-themes` + `ThemeProvider` (`components/providers/theme-provider.tsx`)

### 폼 검증

`react-hook-form` + `zod` + `@hookform/resolvers` 조합을 사용합니다. Zod 스키마는 `lib/validations/`에 정의하고, `FieldWrapper` (`components/forms/field-wrapper.tsx`)로 레이블·에러·설명을 통합합니다.

### 전역 설정

- 사이트 메타데이터·네비게이션: `lib/constants.ts`의 `siteConfig`
- 대시보드 사이드바 메뉴: `lib/constants.ts`의 `dashboardNav`
- 공통 타입: `types/index.ts`
