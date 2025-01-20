import calendarIcon from '@/assets/images/launcher/calendar.png'
import { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
function formatDateTime(date: Date) {
  return date.toLocaleString().slice(0, 19)
}

interface TimePickerProps {
  value?: Date | null
  onChange?: (value: Date | null) => void
}

export default function TimePicker({ value, onChange }: TimePickerProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const CustomInput = forwardRef(
    (
      { v, onClick }: { v?: string; onClick?: () => void; className?: string },
      ref
    ) => {
      console.log('value', value, v)
      return (
        <div
          className="h-[2.75rem] mdup:h-[4.375rem] bg-[#FFFFFF0D] px-[0.875rem] mdup:px-[1.625rem] flex flex-row justify-between items-center w-full border-2 border-[#FFFFFF1A] rounded-[0.625rem] p-2 cursor-pointer mdup:hover:border-red-10"
          onClick={onClick}
          style={{}}
          ref={ref as React.RefObject<HTMLDivElement>}
        >
          <span className="text-sm mdup:text-xl text-white/60">
            {value ? formatDateTime(new Date(value)) : ''}
          </span>
          <img src={calendarIcon} alt="" className="size-5" />
        </div>
      )
    }
  )

  return (
    <div className="w-full">
      <DatePicker
        selected={startDate}
        onChange={(date) => {
          console.log(date)
          setStartDate(date)
          onChange?.(date)
        }}
        customInput={<CustomInput />}
        wrapperClassName="w-full"
        popperPlacement="top"
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={5}
        dateFormat="yyyy-MM-dd HH:mm"
        minDate={new Date()}
        minTime={new Date()}
        maxTime={new Date(new Date().setHours(23, 59, 0))}
      />
    </div>
  )
}
