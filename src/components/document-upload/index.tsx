'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader2, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DocumentUploadProps {
  onFileProcessed: (data: any) => void
}

export function DocumentUpload({ onFileProcessed }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      console.log('File selected:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size
      });
      setFile(selectedFile)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    console.log('Starting upload process...');
    setIsProcessing(true)
    setError(null)

    try {
      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      console.log('Sending file to API...', {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size
      });

      const response = await fetch('/api/intake/process', {
        method: 'POST',
        body: formData
      })

      console.log('Response received:', {
        status: response.status,
        statusText: response.statusText
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json()
      console.log('Upload result:', result);

      if (result.success) {
        console.log('Upload successful, parsed data:', result.data);
        onFileProcessed(result.data)
      } else {
        throw new Error(result.error || 'Failed to process document')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setError(error instanceof Error ? error.message : 'Error uploading file')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="bg-white/95 backdrop-blur-md shadow-sm border border-white/20 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 py-3 px-4 flex flex-row items-center space-x-2">
        <Upload className="w-5 h-5 text-blue-600" />
        <div>
          <CardTitle className="text-sm font-semibold text-gray-900">Upload Intake Package</CardTitle>
          <CardDescription className="text-xs text-gray-500">Upload a document to auto-fill the form fields</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="py-3 px-4 space-y-3">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="flex items-center gap-2">
          <Input
            type="file"
            accept=".docx,.doc"
            className="text-sm bg-white text-gray-900 border-gray-300 flex-1"
            onChange={handleFileChange}
          />
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
            onClick={handleUpload}
            disabled={!file || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}