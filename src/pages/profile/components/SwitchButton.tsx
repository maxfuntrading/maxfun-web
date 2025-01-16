export default function SwitchButton({
  title,
  selected,
  onClick,
}: {
  title: string
  selected: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button className="flex flex-col items-center" onClick={onClick}>
      <div
        className={`w-full h-full text-base mdup:text-[1.25rem] font-medium ${
          selected ? 'text-red-10' : 'text-white'
        }`}
      >
        {title}
      </div>
      <div
        className={`mdup:w-[1.875rem] w-full h-[0.25rem] bg-red-10 mt-3 rounded-[0.3125rem] transition-all duration-300 ${
          selected ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </button>
  )
}
