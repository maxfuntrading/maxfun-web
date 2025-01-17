import clsx from 'clsx'

export default function Holder({className}: {className?: string}) {
  return (
    <div className={clsx("w-full bg-black-10 rounded-[0.625rem] px-[0.91rem] py-4 mdup:px-[1.55rem] mdup:py-[1.37rem]", className)}>
      <div className='flex justify-between items-center'>
        <span className='text-[1.25rem]'>Holder Distribution</span>
        <span className='text-[0.875rem]'>1234</span>
      </div>

      <div className='text-[0.875rem] text-white/60 flex justify-between items-center mt-2'>
        <span>Account</span>
        <span>Percentage</span>
      </div>

      <div className='mt-3'>
        {Array.from({length: 10}).map((_, index) => {
          return <div key={index} className='flex justify-between items-center h-[2.5rem] mdup:h-[3.75rem] border-b border-white/10 first:border-t'>
            <div className='flex items-center gap-[0.59rem]'>
              <a href="https://www.google.com" target='_blank' className='flex items-center gap-[0.59rem]'>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M8.30737 2.177H12.3907V6.26034" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12.3906 9.0235V11.802C12.3906 12.2853 11.9989 12.677 11.5156 12.677H2.76562C2.28238 12.677 1.89062 12.2853 1.89062 11.802V3.052C1.89062 2.56875 2.28238 2.177 2.76562 2.177H5.39062" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7.66553 6.90195L12.128 2.43945" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className='text-[0.75rem] mdup:text-[0.875rem] font-medium'>0x43684D03...9d426F042</span>
              </a>
            </div>
            <span className='text-[0.75rem] mdup:text-[0.875rem] font-semibold text-[#06D188]'>12.34%</span>
          </div>
        })}
      </div>

    </div>
  )
}