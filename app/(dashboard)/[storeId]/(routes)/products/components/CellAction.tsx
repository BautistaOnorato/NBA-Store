"use client"

import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { ProductColumn } from './Columns'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import AlertModal from '@/components/ui/modals/AlertModal'
import { toast } from 'react-hot-toast'
import axios from 'axios'

interface CellActionProps {
  data: ProductColumn
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success("Id copied!")
  }

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${data.id}`)
      router.refresh()
      toast.success("Product deleted")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false);
    }
  }

  const onUpdate = () => {
    router.push(`/${params.storeId}/products/${data.id}`)
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={() => onDelete()}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem className='cursor-pointer hover:bg-gray-100' onClick={() => copyId(data.id)}>
            <Copy className='h-4 w-4 mr-2' />
            <span>Copy Id</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer hover:bg-gray-100' onClick={onUpdate}>
            <Edit className='h-4 w-4 mr-2' />
            <span>Update</span>
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer text-red-500 hover:bg-red-100' onClick={() => setOpen(true)}>
            <Trash className='h-4 w-4 mr-2' />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default CellAction