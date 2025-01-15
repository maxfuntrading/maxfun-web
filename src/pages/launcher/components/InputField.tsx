export default function InputField({
  label,
  placeholder,
  required = false,
}: {
  label: string
  placeholder: string
  required?: boolean
}) {
  return (
    <div className="space-y-2 flex flex-col w-full">
      <label className="text-base mdup:text-xl font-['Outfit']">
        {label} {required && <span className="text-red-10">*</span>}
      </label>
      <input
        type="text"
        className="w-full h-[2.75rem] mdup:h-[4.375rem] bg-white/5 rounded-[0.625rem] border-2 border-[#FFFFFF1A] focus:border-red-10 hover:border-red-10  text-white text-base mdup:text-xl px-4 outline-none"
        placeholder={placeholder}
      />
    </div>
  )
}
