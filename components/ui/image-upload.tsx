"use client"

import { useEffect, useState } from "react"
import { Button } from "./button"
import { ImagePlus, Trash } from "lucide-react"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"

interface ImageUploadProps {
  disabled?: boolean
  onChange: (url: string) => void
  onRemove: (url: string) => void
  value: string[]
}

const ImageUpload: React.FC<ImageUploadProps> = ({ disabled, onChange, onRemove, value }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-4">
        {
          value.map(url => (
            <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden ">
              <div className="absolute z-10 top-2 right-2">
                <Button type="button" variant="destructive" size="icon" onClick={() => onRemove(url)} >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              <Image fill className="object-cover" alt="image" src={url} />
            </div>
          ))
        }
      </div>
      <CldUploadWidget uploadPreset="svlskdkl" onUpload={onUpload}>
        {({ open }) => {
          const onClick = () => {
            open()
          }

          return (
            <Button type="button" variant="secondary" disabled={disabled} onClick={onClick}>
              <ImagePlus className="w-4 h-4 mr-2" />
              Upload an image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}

export default ImageUpload