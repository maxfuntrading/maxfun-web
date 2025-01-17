
export default function Comments() {
  return (
    <div className="w-full px-[0.91rem] mdup:px-[1.88rem] flex flex-col mt-[2rem]">
      <div className="w-full h-[9.375rem] bg-white/20 rounded-[0.625rem] px-[1.35rem] py-[0.83rem] flex flex-col">
        <textarea 
          className=" w-full flex-1 font-medium text-white placeholder:text-white/40 bg-transparent outline-none" 
          placeholder="Write your comments"
          maxLength={250}
        />
        <div className="text--[0.875rem] text-white">0/250</div>
      </div>
      <button className="self-end w-[5.625rem] h-[2.5rem] bg-red-10 rounded-[0.625rem] text-[0.875rem] font-medium text-white">Send</button>
    </div>
  )
}
