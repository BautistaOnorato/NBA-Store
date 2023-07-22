"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./dialog"

interface ModalProps {
  children?: React.ReactNode
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
}

const Modal: React.FC<ModalProps> = ({ children, title, description, isOpen, onClose }) => {

  const onChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  )
}

export default Modal