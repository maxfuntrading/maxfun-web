import { useEffect } from 'react'

/**
 * A hook to prevent page scrolling while preserving scroll position
 * @param isLocked - boolean to control scroll lock state
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return
    
    const preventDefault = (e: Event) => e.preventDefault()
    const options = { passive: false }
    
    // Store current scroll position
    const scrollY = window.scrollY
    
    // Lock scroll and fix body at current position
    document.body.style.cssText = `
      overflow:hidden; 
      position:fixed; 
      width:100%;
      top:-${scrollY}px;
    `
    
    document.addEventListener('touchmove', preventDefault, options)
    document.addEventListener('wheel', preventDefault, options)
    
    return () => {
      // Unlock scroll
      document.body.style.cssText = ''
      // Restore scroll position
      window.scrollTo(0, scrollY)
      
      document.removeEventListener('touchmove', preventDefault)
      document.removeEventListener('wheel', preventDefault)
    }
  }, [isLocked])
}