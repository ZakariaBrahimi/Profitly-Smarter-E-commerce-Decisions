import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { saveTemplate } from '@/lib/storage/templates'
import type { CalculatorInputs } from '@/types/calculator'

export interface SaveTemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  inputs: CalculatorInputs
  onSaved: (name: string) => void
}

export function SaveTemplateDialog({ open, onOpenChange, inputs, onSaved }: SaveTemplateDialogProps) {
  const [name, setName] = React.useState(inputs.productName)
  const [description, setDescription] = React.useState('')

  React.useEffect(() => {
    if (open) {
      setName(inputs.productName)
      setDescription('')
    }
  }, [open, inputs.productName])

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    saveTemplate(trimmed, description.trim(), inputs)
    onOpenChange(false)
    onSaved(trimmed)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Calculator Template</DialogTitle>
          <DialogDescription>Store the current inputs so you can reuse them later.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="template-name">Template name</Label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="T-shirt Campaign"
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="template-description">Description</Label>
            <Input
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Save Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
