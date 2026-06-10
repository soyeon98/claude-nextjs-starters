import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * 화면 너비가 모바일 기준(768px) 미만인지 여부를 반환합니다.
 * useSyncExternalStore로 외부 시스템(matchMedia)과 동기화하여
 * effect 내 동기 setState로 인한 cascading render를 피합니다.
 */
export function useIsMobile() {
  const subscribe = React.useCallback((onChange: () => void) => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  const getSnapshot = () => window.innerWidth < MOBILE_BREAKPOINT
  // 서버 렌더링 시에는 모바일이 아닌 것으로 간주 (기존 동작과 동일하게 false)
  const getServerSnapshot = () => false

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
