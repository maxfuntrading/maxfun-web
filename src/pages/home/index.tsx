
export default function Home() {

  return (
    <div className=" w-full bg-red-400 md:bg-blue-400 lg:bg-green-400">
      {Array.from({ length: 50 }).map((_, index) => (
        <div key={index} className="w-full h-[100px]">{index}</div>
      ))}
    </div>
  )
}
