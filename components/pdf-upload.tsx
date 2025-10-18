'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, FileText, X, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useLanguage } from '@/components/language-provider'

interface PDFUploadProps {
  onFileChange: (file: {
    base64: string
    originalName: string
    mime: string
    sizeBytes: number
  } | null) => void
  currentFile?: {
    originalName: string
    sizeBytes: number
  } | null
  disabled?: boolean
}

export function PDFUpload({ onFileChange, currentFile, disabled }: PDFUploadProps) {
  const { t } = useLanguage()
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

  const validateFile = (file: File): string | null => {
    if (file.type !== 'application/pdf') {
      return t('common.pleaseSelectPdf')
    }

    if (file.size > MAX_FILE_SIZE) {
      return t('common.fileSizeTooLarge').replace('{size}', String(MAX_FILE_SIZE / (1024 * 1024)))
    }

    return null
  }

  const handleFile = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')

    try {
      // Convert file to base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          const base64 = result.split(',')[1] // Remove data:application/pdf;base64, prefix
          onFileChange({
            base64,
            originalName: file.name,
            mime: file.type,
            sizeBytes: file.size,
          })
          toast.success(t('common.pdfUploadSuccess'))
        }
      }
      reader.onerror = () => {
        setError(t('common.failedToReadFile'))
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setError(t('common.failedToProcessFile'))
      console.error('File processing error:', error)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const removeFile = () => {
    onFileChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setError('')
    toast.success(t('common.pdfRemoved'))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>{t('common.pdfDocument')}</Label>
        <p className="text-sm text-muted-foreground">
          {t('common.uploadPdfMax').replace('{size}', String(MAX_FILE_SIZE / (1024 * 1024)))}
        </p>
      </div>

      {!currentFile ? (
        <Card
          className={`border-2 border-dashed p-6 text-center transition-colors ${
            dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Upload className="h-10 w-10 text-muted-foreground mb-4" />
            <h3 className="font-semibold">{t('common.uploadPdf')}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t('common.dragDropPdf')}
            </p>
            <Button
              type="button"
              variant="default"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
            >
              {t('common.selectFile')}
            </Button>
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileInput}
            className="hidden"
            disabled={disabled}
          />
        </Card>
      ) : (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-red-500" />
              <div>
                <p className="font-medium">{currentFile.originalName}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(currentFile.sizeBytes)}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}
