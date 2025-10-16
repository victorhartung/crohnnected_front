"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import en from '@/locales/en.json'
import pt from '@/locales/pt.json'

type Locale = 'en' | 'pt'

const translations: Record<Locale, any> = {
  en,
  pt,
}

interface LanguageContextValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: 'en',
  setLocale: () => {},
  t: (k) => k,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('locale') as Locale | null
      if (saved && (saved === 'en' || saved === 'pt')) setLocale(saved)
    } catch (e) {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('locale', locale)
    } catch (e) {
      // ignore
    }
  }, [locale])

  const t = useMemo(() => {
    return (key: string, vars?: Record<string, any> | string) => {
      const parts = key.split('.')
      let cur: any = translations[locale]
      for (const p of parts) {
        cur = cur?.[p]
        if (cur == null) break
      }

      let result = typeof cur === 'string' ? cur : key

      // If vars is an object, perform simple {placeholder} replacement
      if (vars && typeof vars === 'object') {
        for (const k of Object.keys(vars)) {
          const re = new RegExp(`\\{${k}\\}`, 'g')
          result = result.replace(re, String(vars[k]))
        }
      }

      // If vars is a string and key not found, allow fallback string
      if ((cur == null || cur == undefined) && typeof vars === 'string') {
        return vars
      }

      return result
    }
  }, [locale])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export function useT() {
  const { t } = useContext(LanguageContext)
  return t
}
