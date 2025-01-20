import clsx from 'clsx'

export default function LoadingMore({className, isDark = false}: {className?: string, isDark?: boolean}) {
  const color = isDark ? '#636363' : 'white'

  return (
    <div className={clsx('w-full h-[3rem] flex-center gap-[0.92rem]', className)}>
      <svg className='animate-spin [animation-duration:2s] size-[1.5rem]' xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
        <path d="M12.3286 2V4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.3286 3.33984L16.3286 5.07189" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20.9889 7L19.2568 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M22.3286 12H20.3286" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20.9889 17L19.2568 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17.3286 20.6603L16.3286 18.9282" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12.3286 22V20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.32861 20.6603L8.32861 18.9282" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.66846 17L5.40051 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.32861 12H4.32861" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3.66846 7L5.40051 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.32861 3.33984L8.32861 5.07189" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className={`font-medium ${isDark ? 'text-black-40' : 'text-white'}`}>loading</span>
    </div>
  )
}


