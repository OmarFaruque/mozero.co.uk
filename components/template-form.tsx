'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Question = {
  id: string
  label: string
  type: string
  required: boolean
  placeholder?: string
  options?: string[]
}

type TemplateFormProps = {
  templateId: number
  questions: Question[]
  systemPrompt: string
}

export function TemplateForm({ templateId, questions, systemPrompt }: TemplateFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate required fields
    const missingFields = questions
      .filter(q => q.required && !formData[q.id])
      .map(q => q.label)

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`)
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          systemPrompt,
          userInputs: formData
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate document')
      }

      // Redirect to the generated document
      router.push(`/dashboard/documents/${data.documentId}`)
    } catch (err: any) {
      setError(err.message || 'An error occurred while generating the document')
      setIsGenerating(false)
    }
  }

  const handleInputChange = (questionId: string, value: string) => {
    setFormData(prev => ({ ...prev, [questionId]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <Label htmlFor={question.id} className="text-sm sm:text-base">
            {question.label}
            {question.required && <span className="text-destructive ml-1">*</span>}
          </Label>
          
          {question.type === 'text' && (
            <Input
              id={question.id}
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              required={question.required}
              className="min-h-[44px] text-base"
            />
          )}
          
          {question.type === 'textarea' && (
            <Textarea
              id={question.id}
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              placeholder={question.placeholder}
              required={question.required}
              rows={4}
              className="text-base resize-none"
            />
          )}
          
          {question.type === 'date' && (
            <Input
              id={question.id}
              type="date"
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
              className="min-h-[44px] text-base"
            />
          )}
          
          {question.type === 'select' && question.options && (
            <Select
              value={formData[question.id] || ''}
              onValueChange={(value) => handleInputChange(question.id, value)}
              required={question.required}
            >
              <SelectTrigger id={question.id} className="min-h-[44px] text-base">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {question.options.map((option) => (
                  <SelectItem key={option} value={option} className="text-base">
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      ))}

      {error && (
        <div className="p-3 sm:p-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg leading-relaxed">
          {error}
        </div>
      )}

      <Button 
        type="submit" 
        size="lg" 
        className="w-full min-h-[48px] sm:min-h-[52px] text-base"
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
            Generating Document...
          </>
        ) : (
          'Generate Document'
        )}
      </Button>

      <p className="text-xs sm:text-sm text-muted-foreground text-center leading-relaxed px-2">
        By generating a document, you agree to our Terms of Service and acknowledge that this is not legal advice.
      </p>
    </form>
  )
}
