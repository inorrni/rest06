import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('ko')

  // keep <html lang> in sync (the road engine / live map read documentElement.lang)
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  // t('한글', 'English') — picks the string for the current language
  const t = useCallback((ko, en) => (lang === 'en' ? en : ko), [lang])

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
