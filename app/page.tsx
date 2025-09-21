'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Replace with your actual links
  const TELEGRAM_LINK = "https://t.me/feedaiagent"
  const TWITTER_LINK = "https://x.com/feed_agent"
  const DOCS_LINK = "https://feed.gitbook.io/feed-docs"

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Instant Setup",
      description: "Create your feedback hub in seconds. No complex configuration needed."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: "AI-Powered Analysis",
      description: "Advanced AI automatically categorizes and analyzes feedback sentiment."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: "Real-time Dashboard",
      description: "Track feedback metrics and insights with beautiful, live dashboards."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Privacy First",
      description: "Your data is encrypted and secure. Complete control over your feedback data."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      title: "User Friendly",
      description: "Beautiful, intuitive interface that your users will love to use."
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "Developer API",
      description: "Integrate feedback collection directly into your applications."
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />
        <div className="absolute top-0 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-purple-600/5 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-blue-600/5 rounded-full filter blur-3xl" />
      </div>

      {/* Header Navbar */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'
           }`}>
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
               <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg sm:text-xl">


                                                      <div className="cursor-pointer" onClick={() => router.push('/')}>
                                      <img 
                                        src="/logo.png"
                                        alt="feed"
                                        className="h-8 sm:h-10 w-auto"  // Height fixed, width auto for aspect ratio
                                      />
                                    </div>




                </span>
              </div>
             
            </div>

            {/* Desktop Nav Icons */}
              
            <div className="hidden md:flex items-center gap-1">
              {/* Twitter Button */}
              <button
                onClick={() => window.open('https://x.com/feed_agent', '_blank')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                title="Twitter"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </button>

              {/* Telegram Button */}
              <button
                onClick={() => window.open('https://t.me/feedaiagent', '_blank')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                title="Telegram"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                </svg>
              </button>

              {/* Docs Button */}
              <button
                onClick={() => window.open('https://feed.gitbook.io/feed-docs', '_blank')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                title="Documentation"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </button>

              <div className="w-px h-6 bg-gray-700 mx-2" />

              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all"
              >
                Get Started
              </button>
            </div>        


            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
                                          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-white/10">
              <div className="px-4 py-4 space-y-3">
                <button
                  onClick={() => window.open('https://x.com/feed_agent', '_blank')}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 w-full text-left"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                  </svg>
                  <span>Twitter</span>
                </button>
                
                <button
                  onClick={() => window.open('https://t.me/feedaiagent', '_blank')}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 w-full text-left"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                  </svg>
                  <span>Telegram</span>
                </button>
                
                <button
                  onClick={() => window.open('https://feed.gitbook.io/feed-docs', '_blank')}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 w-full text-left"
                >
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span>Documentation</span>
                </button>
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    router.push('/login')
                  }}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-medium rounded-lg"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
         
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-32">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-xs sm:text-sm text-gray-300 mb-6 sm:mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              AI-Powered Feedback Platform
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
              <span className="block">Transform Feedback</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mt-2">
                Into Growth
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-10 px-4">
              Feed uses cutting-edge AI to help you collect, analyze, and act on user feedback. 
              Build better products with real user insights.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button
                onClick={() => router.push('/login')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-semibold rounded-lg overflow-hidden transition-all hover:scale-105"
              >
                Start Free Trial
              </button>
              
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/5 backdrop-blur-sm text-white font-semibold rounded-lg border border-white/10 hover:bg-white/10 transition-all"
              >
                See How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-500 px-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Free Forever Plan
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Enterprise Security
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                10K+ Users
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Everything You Need to Understand Your Users
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400">
              Powerful features designed for modern teams
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 transition-all"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white mb-3 sm:mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-white/90">
                Join thousands of teams already using Feed to build better products
              </p>
              <button
                onClick={() => router.push('/login')}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-semibold rounded-lg hover:scale-105 transition-transform"
              >
                Create Your Free Account
              </button>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/70">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 text-gray-400 text-xs sm:text-sm">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs sm:text-sm">



                    
                                                      <div className="cursor-pointer" onClick={() => router.push('/')}>
                                      <img 
                                        src="/logo.png"
                                        alt="feed"
                                        className="h-8 sm:h-10 w-auto"  // Height fixed, width auto for aspect ratio
                                      />
                                    </div>

                  </span>
                </div>
                <span>© 2025 Feed. All rights reserved.</span>
              </div>
             
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
