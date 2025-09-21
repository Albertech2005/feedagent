'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'



interface ProjectResult {
  id: string
  slug: string
  name: string
  owner_email?: string
  description?: string
  project?: {
    id: string
    slug: string
    name: string
    owner_email?: string
    description?: string
  }
}

export default function Home() {
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner_email: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ProjectResult | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return // Still loading
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  // Set email from Google account
  useEffect(() => {
  if (session?.user?.email) {
    setFormData(prev => ({ 
      ...prev, 
      owner_email: session.user?.email || ''
    }))
  }
}, [session])

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  
  const emailToUse = session?.user?.email || formData.owner_email
  
  try {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        ownerEmail: emailToUse
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create project')
    }
    
    // Make sure we're setting the correct data
    console.log('Project created:', data) // Debug log
    setResult(data.project || data)
    
  } 
  catch (error: any) {
    console.error('Error:', error)
    alert(error.message || 'Failed to create project')
  } 
  finally {
    setLoading(false)
  }
}
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
  }

  // Loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  // Not authenticated
  if (!session) {
    return null // Router will redirect to login
  }

  
  // Success view
  if (result) {
   // Handle different response structures
   const projectData = result.project || result
   const feedbackUrl = `${window.location.origin}/f/${projectData.slug}`
   const dashboardUrl = `${window.location.origin}/dashboard/${projectData.id}`
  
   return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center py-6 px-4">
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-700 p-6 sm:p-8">
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
              Your Feedback Hub is Live! 🚀
            </h1>
            <p className="text-sm sm:text-base text-gray-400">
              Your AI-powered feedback system is ready
            </p>
          </div>

          {/* Feedback Link */}
          <div className="bg-gray-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-700">
            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">
              Your Feedback Link
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={feedbackUrl}
                readOnly
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 font-mono text-xs sm:text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(feedbackUrl)
                  alert('Copied to clipboard!')
                }}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium text-sm sm:text-base"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Dashboard Link - ADDED THIS SECTION */}
          <div className="bg-gray-900/50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-gray-700">
            <label className="block text-xs sm:text-sm font-medium text-gray-400 mb-2">
              Your Dashboard Link
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={dashboardUrl}
                readOnly
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-gray-300 font-mono text-xs sm:text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(dashboardUrl)
                  alert('Dashboard link copied!')
                }}
                className="px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium text-sm sm:text-base"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            
              href={feedbackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center px-4 py-2.5 sm:px-6 sm:py-3 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-200 border border-gray-600 text-sm sm:text-base"
            <a>
              View Feedback Page
            </a>
            
              href={dashboardUrl}
              className="block text-center px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 font-medium shadow-lg text-sm sm:text-base"
            <a>
              Open Dashboard
            </a>
          </div>

          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <p className="text-xs sm:text-sm text-blue-400">
              <strong>💡 Pro Tip:</strong> Save both links! The feedback link is for your users, the dashboard link is for you to view their feedback.
            </p>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setResult(null)
                setFormData({ name: '', description: '', owner_email: '' })
              }}
              className="text-xs sm:text-sm text-gray-500 hover:text-gray-300 underline transition-colors"
            >
              Create another project
            </button>      
          </div>
        </div>
      </div>
    </div>
   )
  }
  // Main form view
  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500 rounded-full filter blur-[100px] sm:blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-500 rounded-full filter blur-[100px] sm:blur-[128px] opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-8 px-4">
        <div className="w-full max-w-2xl">
          {/* User info bar with Google account */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              {session.user?.image && (
                <img 
                  src={session.user.image} 
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div className="text-gray-400 text-sm">
                Welcome, <span className="text-white font-semibold">{session.user?.name || session.user?.email}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/dashboard')}
                    className="px-3 py-1.5 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700 border border-gray-600 text-sm"
                  >
                My Projects
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center p-1.5 sm:p-2 bg-purple-500/10 rounded-full mb-3 sm:mb-4">
              <div className="px-2.5 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <span className="text-[10px] sm:text-xs font-semibold text-white">AI-POWERED PLATFORM</span>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4">
              Create Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                Feedback Hub
              </span>
            </h1>
            
            <p className="text-base sm:text-xl text-gray-400 max-w-lg mx-auto px-4">
              Collect, analyze, and act on user feedback with AI-driven insights
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8 px-4 sm:px-0">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-[10px] sm:text-sm text-gray-400">Instant Setup</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-[10px] sm:text-sm text-gray-400">AI Analysis</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-[10px] sm:text-sm text-gray-400">Real-time</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-gray-900/30 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-800 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  placeholder="My Awesome App"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-300 mb-1.5 sm:mb-2">
                  Description <span className="text-gray-500">(Optional)</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                  rows={3}
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg sm:rounded-xl hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-xl text-sm sm:text-base"
              >
                {loading ? 'Creating Your Hub...' : 'Launch Feedback Hub'}
              </button>
            </form>

            {/* Trust badges */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-800">
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[10px] sm:text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Free Forever
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Google Secured
                </div>
                <div className="flex items-center">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  AI-Powered
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}