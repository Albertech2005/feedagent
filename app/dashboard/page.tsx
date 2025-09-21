'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  slug: string
  description?: string
  owner_email: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/login')
    }
  }, [session, status, router])

  useEffect(() => {
    if (session?.user?.email) {
      fetchProjects(session.user.email)
    }
  }, [session])

  const fetchProjects = async (email: string) => {
    try {
      const response = await fetch('/api/projects/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (err) {
      console.error('Error fetching projects:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' })
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    alert(`${type} copied to clipboard!`)
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
      
      <div className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                Your Dashboard
              </h1>
              <div className="flex items-center gap-2">
                {session?.user?.image && (
                  <img 
                    src={session.user.image} 
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <p className="text-gray-400">
                  {session?.user?.name || session?.user?.email}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/create')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all"
              >
                + New Project
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 border border-red-500/30 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-900/30 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
              <h3 className="text-gray-400 text-sm mb-2">Total Projects</h3>
              <p className="text-3xl font-bold text-white">{projects.length}</p>
            </div>
            <div className="bg-gray-900/30 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
              <h3 className="text-gray-400 text-sm mb-2">Total Feedback</h3>
              <p className="text-3xl font-bold text-purple-400">0</p>
            </div>
            <div className="bg-gray-900/30 backdrop-blur-xl rounded-xl p-6 border border-gray-800">
              <h3 className="text-gray-400 text-sm mb-2">Avg Rating</h3>
              <p className="text-3xl font-bold text-green-400">--</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6">Your Projects</h2>
          
          {projects.length === 0 ? (
            <div className="bg-gray-900/30 backdrop-blur-xl rounded-xl p-12 border border-gray-800 text-center">
              <svg 
                className="w-20 h-20 mx-auto mb-4 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h2 className="text-xl font-semibold text-white mb-2">
                No projects yet
              </h2>
              <p className="text-gray-400 mb-6">
                Create your first feedback hub to get started
              </p>
              <button
                onClick={() => router.push('/create')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => {
                const feedbackUrl = `${window.location.origin}/f/${project.slug}`
                const projectDashUrl = `/dashboard/${project.id}`
                
                return (
                  <div 
                    key={project.id} 
                    className="bg-gray-900/30 backdrop-blur-xl rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {project.name}
                        </h3>
                        {project.description && (
                          <p className="text-gray-400 text-sm">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-500 mb-4">
                      Created: {new Date(project.created_at).toLocaleDateString()}
                    </p>
                    
                    <div className="flex gap-4 mb-4">
                      <div className="flex-1 text-center py-3 bg-gray-800/50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-400">0</p>
                        <p className="text-xs text-gray-400">Feedbacks</p>
                      </div>
                      <div className="flex-1 text-center py-3 bg-gray-800/50 rounded-lg">
                        <p className="text-2xl font-bold text-green-400">--</p>
                        <p className="text-xs text-gray-400">Avg Rating</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Feedback Form Link (Share with users)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={feedbackUrl}
                            readOnly
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300"
                          />
                          <button
                            onClick={() => copyToClipboard(feedbackUrl, 'Feedback link')}
                            className="px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-all"
                          >
                            Copy
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400 mb-1 block">
                          Dashboard Link (View feedback)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={`${window.location.origin}${projectDashUrl}`}
                            readOnly
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300"
                          />
                          <button
                            onClick={() => copyToClipboard(`${window.location.origin}${projectDashUrl}`, 'Dashboard link')}
                            className="px-3 py-2 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-all"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button
                        onClick={() => router.push(projectDashUrl)}
                        className="text-center px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all font-medium"
                      >
                        View Feedback
                      </button>
                      <button
                        onClick={() => window.open(feedbackUrl, '_blank')}
                        className="text-center px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all font-medium"
                      >
                        Test Form
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-500 text-sm">
            © 2025 Feedback Hub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
