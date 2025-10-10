"use client"

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

type FormValues = {
  name: string
  birthDate: string
  specialty: 'Gastroenterology' | 'Coloproctology'
  crm: string
  notes?: string
  email: string
}

export default function DoctorContactPage() {
  const { register, handleSubmit } = useForm<FormValues>()
  const [isSending, setIsSending] = useState(false)

  async function onSubmit(values: FormValues) {
    setIsSending(true)
    try {
      const res = await fetch('/api/contact/doctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.error || 'Failed to send request')
        return
      }

      toast.success('Request sent — we will contact you soon')
    } catch (err) {
      console.error(err)
      toast.error('An unexpected error occurred')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Contact for Doctors</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Use this form to send your details if you'd like to be listed as a healthcare provider or to request a doctor account.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input {...register('name', { required: true })} />
            </div>

            <div>
              <Label>Birth date</Label>
              <Input type="date" {...register('birthDate', { required: true })} />
            </div>

            <div>
              <Label>Specialty</Label>
              <select className="block w-full rounded-md border bg-background px-3 py-2" {...register('specialty', { required: true })}>
                <option value="Gastroenterology">Gastroenterology</option>
                <option value="Coloproctology">Coloproctology</option>
              </select>
            </div>

            <div>
              <Label>CRM / License number</Label>
              <Input {...register('crm', { required: true })} />
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" {...register('email', { required: true })} />
            </div>

            <div>
              <Label>Observations</Label>
              <Textarea {...register('notes')} rows={4} />
            </div>

            <div>
              <Button type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Send request'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
