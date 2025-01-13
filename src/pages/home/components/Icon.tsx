import clsx from "clsx"

export const DownArrowIcon = ({className}: {className?: string}) => {
  return (
    <svg className={clsx(className)} xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path d="M5.33398 7.89288L10.334 12.8929L15.334 7.89288" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export const UpArrowIcon = ({className}: {className?: string}) => {
  return (
    <svg className={clsx(className)} xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
      <path d="M5.80859 13.7263L10.8086 8.72626L15.8086 13.7263" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}