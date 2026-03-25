"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import en from "../locales/en.json"
import es from "../locales/es.json"

type Locale = "en" | "es"
type Translations = typeof en

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const translations: Record<Locale, Translations> = { en, es }

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("es")

  // Load locale from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("hub_locale") as Locale
    if (saved && (saved === "en" || saved === "es")) {
      setLocale(saved)
    }
  }, [])

  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem("hub_locale", newLocale)
  }

  const t = (key: string): string => {
    const keys = key.split(".")
    let result: any = translations[locale]
    
    for (const k of keys) {
      if (result && k in result) {
        result = result[k]
      } else {
        return key // Return the key itself if translation is missing
      }
    }
    
    return result as string
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale: handleSetLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
