'use client'

import React from 'react'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import BackToTopBtn from '@/components/Other/BackToTopBtn'
import NavigationList from '@/components/Other/NavigationList'
import { ToastContainer } from 'react-toastify'

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="App">
      <header>
        <Header />
      </header>

      <main>
        {children}
      </main>

      <footer>
        <Footer />
      </footer>

      <BackToTopBtn />
      <NavigationList />
      <ToastContainer position="top-right" autoClose={4000} closeOnClick />
    </div>
  )
}

export default AppLayout
