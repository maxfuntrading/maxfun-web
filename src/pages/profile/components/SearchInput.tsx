import { useState } from 'react'
import SearchIcon from '@/assets/icons/search.png'

export default function SearchInput({
  onSearch,
}: {
  onSearch: (value: string) => void
}) {
  const [search, setSearch] = useState('')
  return (
    <div className="relative w-full mdup:flex-1 h-[3rem] flex gap-4">
      <input
        className=" flex-1 h-full bg-transparent outline-none"
        type="text"
        placeholder="Search Token"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSearch(search)
          }
        }}
      />
      <button onClick={() => onSearch(search)}>
        <img className="size-[0.875rem]" src={SearchIcon} alt="" />
      </button>
      <div className=" absolute w-full left-0 bottom-0 border-b-[2px] border-b-[#fff] rounded-[0.625rem] opacity-20"></div>
    </div>
  )
}
