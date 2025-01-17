
import LoadingMore from "@/components/LoadingMore"
import { useState } from "react"

export default function Comments() {
  const [comment, setComment] = useState('')
  const [isLoading,] = useState(false)

  return (
    <div className="w-full px-[0.91rem] mdup:px-[1.88rem] flex flex-col mt-[2rem]">
      <div className="w-full h-[9.375rem] mdup:h-[7.5rem] bg-white/20 rounded-[0.625rem] px-[1.35rem] py-[0.83rem] flex flex-col">
        <textarea 
          className=" w-full flex-1 font-medium text-white placeholder:text-white/40 bg-transparent outline-none resize-none" 
          placeholder="Write your comments"
          maxLength={250}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="text-[0.875rem] text-white">{comment.length}/250</div>
      </div>
      <button className="self-end w-[7.5rem] h-[2.25rem] bg-red-10 rounded-[0.625rem] text-[1rem] mdup:text-[1.125rem] font-medium text-white mt-[1.16rem]">Submit</button>
      
      <div className="text-[1rem] mdup:text-[1.125rem] font-medium text-white mt-[1.16rem]">Comment (30)</div>

      <div className="w-full flex flex-col">
        {Array.from({ length: 30 }).map((_, index) => (
          <CommentItem key={index} />
        ))}
      </div>

      { isLoading && <LoadingMore />}
    </div>
  )
}

function CommentItem() {
  return (
    <div className="w-full flex flex-col border-b border-white/10 py-[1.1rem] mdup:py-[1.65rem] gap-[0.84rem] mdup:gap-[0.57rem]">
      <div className="flex justify-between items-center">
        <div className="relative w-[8.09rem] h-[1.875rem] mdup:w-[10rem] mdup:h-[2.125rem] rounded-[0.375rem] border border-red-10 flex items-center gap-[0.52rem] mdup:gap-[0.78rem]">
          <div className=" size-[1.875rem] mdup:size-[2.125rem] bg-red-10 rounded-[0.25rem] overflow-hidden"></div>
          <span className="text-[0.75rem] mdup:text-[0.875rem] font-medium">0x97...a48b01</span>
        </div>

        <div className="text-[0.875rem] mdup:text-[1rem] font-medium text-white flex items-center gap-[0.62rem]">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
            <g opacity="0.4">
              <path d="M12.8592 3.88867H2.35921C2.03705 3.88867 1.77588 4.14984 1.77588 4.47201V12.0553C1.77588 12.3775 2.03705 12.6387 2.35921 12.6387H12.8592C13.1814 12.6387 13.4425 12.3775 13.4425 12.0553V4.47201C13.4425 4.14984 13.1814 3.88867 12.8592 3.88867Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4.69287 2.72205V5.05538" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7.9012 7.68042H4.69287" stroke="#1E2022" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10.5262 10.0137H4.69287" stroke="#1E2022" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10.5259 2.72205V5.05538" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </g>
          </svg>
          <span className="text-[0.75rem] mdup:text-[0.875rem] font-medium text-white/50">2 days</span>
        </div>
      </div>

      <div className="text-[0.875rem] mdup:text-[1rem]">
        Launch of the main token snake coin 2025!  Hey! Launch of the main token snake coin 2025!
        Hey! Launch of the main token snake coin 2025!  Hey! Launch of the main token snake coin 2025!
      </div>
    </div>
  )
}
