'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function FeedbackPage({ params }: { params: { projectSlug: string } }) {
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
    rating: 5,
    email: ''
  })
  const [hoveredStar, setHoveredStar] = useState(0)

  useEffect(() => {
    fetchProject()
  }, [])

  const fetchProject = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', params.projectSlug)
        .single()

      if (error) throw error
      setProject(data)
    } catch (error) {
      console.error('Error fetching project:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: project.id,
          ...formData
        })
      })

      const data = await response.json()
      if (data.success) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to submit feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Project Not Found</h1>
          <p className="text-gray-400">This feedback link may be invalid or expired.</p>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-emerald-900/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500 rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
        </div>

        <div className="relative z-10 max-w-md w-full">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800 p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-3">
              Thank You! 🎉
            </h1>
            <p className="text-gray-300 text-lg mb-2">{project.thank_you_message}</p>
            <p className="text-gray-500 text-sm">Your feedback helps us improve every day</p>
            
            <div className="mt-8 pt-6 border-t border-gray-800">
              <p className="text-xs text-gray-600">Powered by AI-driven feedback analysis</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getRatingText = () => {
    switch(formData.rating) {
      case 5: return "Excellent! 🌟"
      case 4: return "Great! 😊"
      case 3: return "Good 👍"
      case 2: return "Fair 😐"
      case 1: return "Poor 😔"
      default: return ""
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] opacity-20 animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-2 bg-purple-500/10 rounded-full mb-4">
              <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <span className="text-xs font-semibold text-white uppercase tracking-wider">Feedback Hub</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              Share Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500">
                Feedback
              </span>
            </h1>
            
            <p className="text-gray-400 text-lg">
              for <span className="font-semibold text-white">{project.name}</span>
            </p>
            {project.description && (
              <p className="text-gray-500 mt-2 max-w-lg mx-auto">{project.description}</p>
            )}
          </div>

          {/* Form Card */}
          <div className="bg-gray-900/30 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-800 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Section */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4 text-center">
                  How would you rate your experience?
                </label>
                <div className="flex justify-center space-x-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className="focus:outline-none transform transition-all duration-200 hover:scale-125"
                    >
                      <svg
                        className={`w-12 h-12 transition-all duration-200 ${
                          star <= (hoveredStar || formData.rating)
                            ? 'text-yellow-400 fill-current drop-shadow-lg'
                            : 'text-gray-600 hover:text-gray-500'
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <p className="text-center mt-3 text-sm text-gray-500">
                  {getRatingText()}
                </p>
              </div>

              {/* Feedback Text */}
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-300 mb-2">
                  Tell us more <span className="text-purple-400">*</span>
                </label>
                <textarea
                  id="feedback"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows={5}
                  placeholder="What's on your mind? Your feedback helps us improve..."
                  maxLength={500}
                />
                <p className="text-xs text-gray-600 mt-1">
                  {formData.content.length}/500 characters
                </p>
              </div>

              {/* Email (Optional) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-gray-600">(Optional)</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="you@example.com"
                />
                <p className="text-xs text-gray-600 mt-1">
                  We'll only use this to follow up if needed
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !formData.content}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-xl"
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Submit Feedback
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Privacy Note */}
            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  100% Secure
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  Anonymous Option
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  AI-Analyzed
                </div>
              </div>
            </div>
          </div>

          {/* Powered by */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-600">
              Powered by FeedbackHub AI
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}