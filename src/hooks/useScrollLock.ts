import { useEffect } from 'react'

/**
 * A hook to prevent page scrolling
 * @param isLocked - boolean to control scroll lock state
 */
export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return
    
    const preventDefault = (e: Event) => e.preventDefault()
    const options = { passive: false }
    
    // Lock scroll
    document.body.style.cssText = 'overflow:hidden; position:fixed; width:100%'
    document.addEventListener('touchmove', preventDefault, options)
    document.addEventListener('wheel', preventDefault, options)
    
    return () => {
      // Unlock scroll
      document.body.style.cssText = ''
      document.removeEventListener('touchmove', preventDefault)
      document.removeEventListener('wheel', preventDefault)
    }
  }, [isLocked])
}