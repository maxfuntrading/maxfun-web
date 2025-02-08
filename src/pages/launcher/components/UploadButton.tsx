import uploadIcon from '@/assets/images/launcher/upload.svg'
import { toastError } from '@/components/toast'
import { forwardRef, useImperativeHandle, useState } from 'react'

interface UploadButtonProps {
  onUpload: (file: File) => void
  isDisabled: boolean
}

export interface UploadButtonRef {
  reset: () => void
}

const UploadButton = forwardRef<UploadButtonRef, UploadButtonProps>(({ onUpload, isDisabled }, ref) => {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  useImperativeHandle(ref, () => ({
    reset: () => {
      setUploadedUrl(null)
    },
  }))

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (4MB = 4 * 1024 * 1024 bytes)
    if (file.size > 4 * 1024 * 1024) {
      toastError('File size must be less than 4MB')
      return
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      toastError('Please upload a valid image file (JPEG/PNG/WEBP/GIF)')
      return
    }

    //TODO: upload file to server, get url and display it
    const url = URL.createObjectURL(file)
    console.log('>>url', url)
    setUploadedUrl(url)
    onUpload(file)
  }

  return (
    <label className="flex flex-col items-center cursor-pointer">
      <input
        type="file"
        className="hidden"
        disabled={isDisabled}
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
      />
      <div className="bg-white/5 rounded-[0.625rem] border-2 mdup:border-none size-[7.5rem] mdup:h-[13.125rem] mdup:w-[12.5rem] text-center text-white flex flex-col items-center gap-2 justify-center">
        <img
          src={uploadedUrl || uploadIcon}
          alt=""
          className="size-[2.5rem] mdup:size-[4.5rem] object-cover"
        />
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
})

export default UploadButton
