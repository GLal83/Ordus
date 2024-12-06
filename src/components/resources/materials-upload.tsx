'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'

export function MaterialsUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !category) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('category', category)
    formData.append('description', description)

    try {
      const response = await fetch('/api/resources/materials/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      toast({
        title: 'Success',
        description: 'Material uploaded successfully',
      })

      // Reset form
      setFile(null)
      setCategory('')
      setDescription('')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload material',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleUpload} className="space-y-4">
      <div>
        <Label htmlFor="file">File</Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g., Procedures, Guidelines, Training"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the material"
        />
      </div>

      <Button type="submit" disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Material'}
      </Button>
    </form>
  )
} 