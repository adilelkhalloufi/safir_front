import { useLocation } from 'react-router-dom'

export default function useCheckActiveNav() {
  const { pathname } = useLocation()

  const checkActiveNav = (nav: string) => {
    // Handle root path
    if (nav === '/' && pathname === '/') return true

    // For non-root paths, check if current pathname starts with the nav path
    if (nav !== '/') {
      return pathname === nav || pathname.startsWith(nav + '/')
    }

    return false
  }

  return { checkActiveNav }
}
