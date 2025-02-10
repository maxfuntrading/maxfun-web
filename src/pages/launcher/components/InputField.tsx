import clsx from 'clsx'

export default function InputField({
  label,
  placeholder = '',
  required = false,
  type = 'text',
  value,
  onChange,
  className,
  inputClassName,
  errorInfo,
  disabled = false,
  onBlur,
}: {
  label: string
  placeholder?: string
  type?: 'text' | 'number'
  required?: boolean
  className?: string
  inputClassName?: string
  value: string
  onChange: (value: string) => void
  errorInfo?: string | undefined
  disabled?: boolean
  onBlur?: () => void
}) {
  return (
    <div className={clsx('space-y-2 flex flex-col w-full relative', className)}>
      <label className="text-sm mdup:text-xl font-['Outfit']">
        {label} {required && <span className="text-red-10">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={clsx(
          'w-full h-[2.75rem] mdup:h-[4.375rem] bg-white/5 rounded-[0.625rem] border-2 border-[#FFFFFF1A] focus:border-red-10 text-white text-base mdup:text-xl px-4 outline-none',
          disabled ? 'text-[#FFFFFF4C]' : 'hover:border-red-10',
          inputClassName
        )}
        placeholder={placeholder}
        disabled={disabled}
        onBlur={onBlur}
      />
      {errorInfo && (
        <span className="text-red-600 text-xs mdup:text-sm absolute bottom-[-1.45rem] left-0">
          {errorInfo}
        </span>
      )}
    </div>
  )
}
