import React, { createContext, useContext, useState, useMemo } from 'react'

const PageTitleContext = createContext({ title: '', setTitle: () => {} })

export function PageTitleProvider({ children }) {
  const [title, setTitle] = useState('')
  const value = useMemo(() => ({ title, setTitle }), [title])
  return (
    <PageTitleContext.Provider value={value}>
      {children}
    </PageTitleContext.Provider>
  )
}

export function usePageTitle() {
  return useContext(PageTitleContext)
}


