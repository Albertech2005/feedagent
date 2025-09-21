'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard({ params }: { params: { projectId: string } }) {
  const [project, setProject] = useState<any>(null)
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [stats, setStats] = useState<any>(null)
  
  // AI Advisor states
  const [showAdvisor, setShowAdvisor] = useState(false)
  const [insights, setInsights] = useState<any>(null)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [userQuestion, setUserQuestion] = useState('')

  useEffect(() => {
    fetchProjectAndFeedback()
  }, [])

  const fetchProjectAndFeedback = async () => {
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', params.projectId)
        .single()

      if (projectError) throw projectError
      setProject(projectData)

      const response = await fetch(`/api/feedback?projectId=${params.projectId}`)
      const data = await response.json()
      
      if (data.success) {
        setFeedbacks(data.feedback)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAIInsights = async (question?: string) => {
    setLoadingInsights(true)
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: params.projectId,
          question: question || null
        })
      })

      const data = await response.json()
      if (data.success) {
        setInsights(data.insights)
      }
    } catch (error) {
      console.error('Error getting insights:', error)
      alert('Failed to generate insights')
    } finally {
      setLoadingInsights(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSentimentBg = (sentiment: string) => {
    switch(sentiment) {
      case 'positive': return 'bg-green-500/10 border-green-500/30 text-green-400'
      case 'negative': return 'bg-red-500/10 border-red-500/30 text-red-400'
      default: return 'bg-gray-500/10 border-gray-500/30 text-gray-400'
    }
  }

  const filteredFeedbacks = feedbacks.filter(f => {
    if (filter === 'all') return true
    if (filter === 'positive') return f.sentiment_label === 'positive' || f.sentiment > 0.3
    if (filter === 'negative') return f.sentiment_label === 'negative' || f.sentiment < -0.3
    if (filter === 'neutral') return f.sentiment_label === 'neutral' || (f.sentiment >= -0.3 && f.sentiment <= 0.3)
    return true
  })

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Project Not Found</h1>
          <p className="text-gray-400">This project doesn't exist or you don't have access.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] opacity-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-[128px] opacity-10"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                {project.name}
              </h1>
              <p className="text-sm text-gray-500">AI-Powered Feedback Dashboard</p>
            </div>
            <div className="flex gap-3">
              <a
                href="/"
                className="px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-all duration-200 border border-gray-700"
              >
                ← Back
              </a>
              <a
                href={`/f/${project.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg"
              >
                View Feedback Page →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900/50 backdrop-blur rounded-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-400">Total Feedback</p>
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">All responses</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur rounded-xl border border-gray-800 p-6 hover:border-green-500/50 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-400">Positive</p>
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-400">{stats.positive}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.total > 0 ? `${((stats.positive / stats.total) * 100).toFixed(0)}% satisfaction` : '0% satisfaction'}
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur rounded-xl border border-gray-800 p-6 hover:border-red-500/50 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-400">Negative</p>
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-red-400">{stats.negative}</p>
              <p className="text-xs text-gray-500 mt-1">Need attention</p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur rounded-xl border border-gray-800 p-6 hover:border-blue-500/50 transition-all duration-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-400">Avg Sentiment</p>
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                {stats.avgSentiment > 0 ? '+' : ''}{(stats.avgSentiment * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Overall mood</p>
            </div>
          </div>
        )}

        {/* AI Advisor Section */}
        <div className="mb-8">
          {!showAdvisor ? (
            <button
              onClick={() => setShowAdvisor(true)}
              className="w-full py-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur border border-purple-500/30 text-white rounded-2xl hover:from-purple-900/70 hover:to-pink-900/70 transition-all duration-300 font-medium text-lg shadow-xl group relative overflow-hidden"
            >
              <span className="relative flex items-center justify-center">
                <span className="text-3xl mr-3 animate-bounce">🤖</span>
                <span className="font-bold">
                  Ask AI Advisor for Improvement Recommendations
                </span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>
          ) : (
            <div className="bg-gray-900/50 backdrop-blur rounded-2xl border border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 flex items-center">
                  <span className="text-2xl mr-2 animate-pulse">🤖</span>
                  AI Advisor
                </h2>
                <button
                  onClick={() => {
                    setShowAdvisor(false)
                    setInsights(null)
                    setUserQuestion('')
                  }}
                  className="text-gray-500 hover:text-gray-300 transition-colors hover:rotate-90 duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!insights ? (
                <div>
                  <p className="text-gray-400 mb-4">
                    Ask me anything about your {feedbacks.length} feedback responses! I'll analyze patterns and provide actionable recommendations.
                  </p>
                  
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={userQuestion}
                      onChange={(e) => setUserQuestion(e.target.value)}
                      placeholder="e.g., How can I improve user satisfaction? What features should I prioritize?"
                      className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      onKeyPress={(e) => e.key === 'Enter' && getAIInsights(userQuestion)}
                    />
                    <button
                      onClick={() => getAIInsights(userQuestion)}
                      disabled={loadingInsights}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:scale-105"
                    >
                      {loadingInsights ? (
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        'Ask'
                      )}
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    {['What should I fix first?', 'What do users love most?', 'How to improve UX?'].map((q) => (
                      <button
                        key={q}
                        onClick={() => getAIInsights(q)}
                        className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-full text-sm hover:bg-purple-500/20 transition-all duration-200 hover:scale-105"
                      >
                        <span className="flex items-center">
                          <span className="mr-1">✨</span>
                          {q}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {loadingInsights ? (
                    <div className="text-center py-12">
                      <div className="relative">
                        <div className="w-20 h-20 mx-auto">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-spin"></div>
                          <div className="absolute inset-2 bg-gray-900 rounded-full"></div>
                        </div>
                        <p className="text-gray-400 mt-6 animate-pulse">Analyzing all feedback with AI...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {insights.summary && (
                        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 p-4 rounded-xl">
                          <h3 className="font-semibold text-purple-400 mb-2 flex items-center">
                            <span className="mr-2">📊</span>
                            Executive Summary
                          </h3>
                          <p className="text-gray-300">{insights.summary}</p>
                        </div>
                      )}

                      {insights.userQuestionAnswer && (
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                          <h3 className="font-semibold text-blue-400 mb-2 flex items-center">
                            <span className="mr-2">💡</span>
                            Answer to Your Question
                          </h3>
                          <p className="text-gray-300">{insights.userQuestionAnswer}</p>
                        </div>
                      )}

                      {insights.strengths && insights.strengths.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-white mb-3 flex items-center">
                            <span className="text-green-400 mr-2">💪</span>
                            What Users Love
                          </h3>
                          <div className="space-y-2">
                            {insights.strengths.map((strength: string, i: number) => (
                              <div key={i} className="flex items-start">
                                <span className="text-green-400 mr-2 mt-1">✓</span>
                                <span className="text-gray-300">{strength}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {insights.priorities && insights.priorities.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-white mb-3 flex items-center">
                            <span className="text-red-400 mr-2">🚨</span>
                            Fix These First
                          </h3>
                          <div className="space-y-2">
                            {insights.priorities.map((priority: string, i: number) => (
                              <div key={i} className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                                <span className="text-red-400 mr-2 font-bold">{i + 1}.</span>
                                <span className="text-gray-300">{priority}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {insights.improvements && insights.improvements.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-white mb-3 flex items-center">
                            <span className="text-amber-400 mr-2">🔧</span>
                            Recommended Improvements
                          </h3>
                          <div className="space-y-2">
                            {insights.improvements.map((improvement: string, i: number) => (
                              <div key={i} className="flex items-start">
                                <span className="text-amber-400 mr-2">•</span>
                                <span className="text-gray-300">{improvement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {insights.nextSteps && insights.nextSteps.length > 0 && (
                        <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-xl">
                          <h3 className="font-semibold text-white mb-3 flex items-center">
                            <span className="text-purple-400 mr-2">📋</span>
                            Your Next Steps
                          </h3>
                          <div className="space-y-2">
                            {insights.nextSteps.map((step: string, i: number) => (
                              <div key={i} className="flex items-start">
                                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 flex-shrink-0">
                                  {i + 1}
                                </span>
                                <span className="text-gray-300">{step}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-gray-800 pt-4">
                        <button
                          onClick={() => {
                            setInsights(null)
                            setUserQuestion('')
                          }}
                          className="text-purple-400 hover:text-purple-300 font-medium transition-colors inline-flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Ask another question
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: 'All', count: feedbacks.length },
            { key: 'positive', label: 'Positive', count: stats?.positive || 0, color: 'from-green-500 to-emerald-500' },
            { key: 'negative', label: 'Negative', count: stats?.negative || 0, color: 'from-red-500 to-pink-500' },
            { key: 'neutral', label: 'Neutral', count: stats?.neutral || 0, color: 'from-gray-500 to-gray-600' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilter(item.key)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === item.key
                  ? item.color 
                    ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                    : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 border border-gray-700'
              }`}
            >
              {item.label} ({item.count})
            </button>
          ))}
        </div>

        {/* Feedback List */}
        <div className="bg-gray-900/50 backdrop-blur rounded-2xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
              </svg>
              Feedback Analysis
            </h2>
          </div>
          <div className="divide-y divide-gray-800">
            {filteredFeedbacks.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-gray-500">No feedback matches this filter.</p>
              </div>
            ) : (
              filteredFeedbacks.map((feedback) => (
                <div key={feedback.id} className="px-6 py-4 hover:bg-gray-800/30 transition-all duration-200">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      {feedback.rating && (
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-5 h-5 ${
                                star <= feedback.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-700'
                              }`}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                        </div>
                      )}
                      {(feedback.sentiment_label || feedback.sentiment !== null) && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                          getSentimentBg(
                            feedback.sentiment_label || 
                            (feedback.sentiment > 0.3 ? 'positive' : feedback.sentiment < -0.3 ? 'negative' : 'neutral')
                          )
                        }`}>
                          {feedback.sentiment_label || 
                           (feedback.sentiment > 0.3 ? 'positive' : feedback.sentiment < -0.3 ? 'negative' : 'neutral')}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(feedback.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">{feedback.content}</p>
                  
                  {feedback.email && (
                    <div className="mt-3 flex items-center text-xs text-gray-500">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {feedback.email}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}