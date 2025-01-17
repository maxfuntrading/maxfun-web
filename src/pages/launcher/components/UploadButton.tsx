import upload from '@/assets/images/launcher/upload.svg'

export default function UploadButton({
  onUploaded,
}: {
  onUploaded: (url: string) => void
}) {
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (4MB = 4 * 1024 * 1024 bytes)
    if (file.size > 4 * 1024 * 1024) {
      alert('File size must be less than 4MB')
      return
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG/PNG/WEBP/GIF)')
      return
    }

    //todo: upload file to server
    const url = URL.createObjectURL(file)
    console.log('>>url', url)
    onUploaded(url)
  }

  return (
    <label className="flex flex-col items-center cursor-pointer">
      <input
        type="file"
        className="hidden"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
      />
      <div className="bg-white/5 rounded-[0.625rem] border-2 mdup:border-none size-[7.5rem] mdup:h-[13.125rem] mdup:w-[12.5rem] text-center text-white flex flex-col items-center gap-2 justify-center">
        <img src={upload} alt="" className="size-[2.5rem] mdup:size-[4.5rem]" />
        <div className="mdup:flex flex-col items-center mt-2 hidden">
          <p className="text-xs">JPEG/PNG/WEBP/GIF</p>
          <p className="text-xs">Less Than 4MB</p>
        </div>
      </div>
      <div className="flex flex-col items-center mt-2 opacity-60 mdup:hidden">
        <p className="text-xs">JPEG/PNG/WEBP/GIF</p>
        <p className="text-xs">Less Than 4MB</p>
      </div>
    </label>
  )
}
