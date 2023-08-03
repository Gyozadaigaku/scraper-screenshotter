'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { FC, ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'

interface LayoutProps {
  children: ReactNode
}

const queryClient = new QueryClient()

const Providers: FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ThemeProvider>
  )
}

export default Providers
