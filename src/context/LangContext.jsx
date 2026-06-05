import { createContext, useContext } from 'react'

export const LangContext = createContext({ lang: 'it', switchLang: () => {} })

export function useLang() {
  return useContext(LangContext)
}

export function useT() {
  const { lang } = useLang()
  return (it, en) => lang === 'it' ? it : en
}
