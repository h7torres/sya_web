import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router doesn't reset scroll position on navigation by default —
// without this, clicking a link (like "Submit to the Archive") lands
// you on the new page at whatever scroll position you were previously
// at, instead of the top. This runs on every route change and scrolls
// back to 0,0. Renders nothing — it's just a side-effect component.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}