'use client'

import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { User, LogOut, FileText, Home } from 'lucide-react'

const Header = () => {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-secondary" />
              <span className="text-2xl font-bold text-primary">MedPal</span>
            </Link>
            
            {session && (
              <nav className="flex space-x-6">
                <Link
                  href="/"
                  className="flex items-center space-x-1 text-black-300 hover:text-primary transition-colors"
                >
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1 text-black-300 hover:text-primary transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'User'}
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-secondary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-black-200">
                    {session.user?.name}
                  </span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-black-300 hover:text-primary transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn('google')}
                className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header