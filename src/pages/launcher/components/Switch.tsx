interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
}

export default function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <div className="flex flex-row gap-2 items-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="w-[50px] h-[28px] mdup:w-[72px] mdup:h-[40px] bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-[22px] mdup:peer-checked:after:translate-x-[32px] rtl:peer-checked:after:-translate-x-[22px] mdup:rtl:peer-checked:after:-translate-x-[32px] peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] mdup:after:top-[4px] after:start-[2px] mdup:after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[24px] after:w-[24px] mdup:after:h-[32px] mdup:after:w-[32px] after:transition-all peer-checked:bg-red-10"></div>
      </label>
      {label && (
        <span className="text-white text-sm mdup:text-xl">{label}</span>
      )}
    </div>
  )
}
