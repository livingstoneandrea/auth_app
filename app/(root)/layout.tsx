
import Header from '@/components/Header'

import { redirect } from 'next/navigation'
import React from 'react'

const Layout = async ({children} : {children: React.ReactNode}) => {
  return (
    <main className="flex h-screen">
        <section className="flex h-full flex-1 flex-col">
            
            <div className="main-content">{children}</div>
        </section>
    </main>
  )
}

export default Layout