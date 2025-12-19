import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { 
  Download, 
  Link, 
  Sparkles, 
  Image as ImageIcon,
  Video,
  ExternalLink,
  Zap,
  History,
  Star,
  Rocket,
  Globe,
  Shield,
  Zap as Lightning
} from 'lucide-react'
import DownloadCard from './components/DownloadCard'
import MediaPreview from './components/MediaPreview'
import AuroraBackground from './components/AuroraBackground'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [downloadHistory, setDownloadHistory] = useState([])
  const [stats, setStats] = useState({ totalDownloads: 0, successRate: 98 })

  useEffect(() => {
    // Load download history from localStorage
    const savedHistory = localStorage.getItem('pinterestDownloadHistory')
    const savedStats = localStorage.getItem('pinterestDownloadStats')
    
    if (savedHistory) {
      setDownloadHistory(JSON.parse(savedHistory))
    }
    
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [])

  useEffect(() => {
    // Save download history to localStorage
    if (downloadHistory.length > 0) {
      localStorage.setItem('pinterestDownloadHistory', JSON.stringify(downloadHistory))
    }
    
    // Save stats to localStorage
    localStorage.setItem('pinterestDownloadStats', JSON.stringify(stats))
  }, [downloadHistory, stats])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!url.trim()) {
      setError('Please enter a Pinterest URL')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await axios.post('https://pin-dl.vercel.app', {
        url: url.trim()
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.data.status === 'success') {
        setResult(response.data.data)
        const newHistory = [{
          ...response.data.data,
          timestamp: new Date().toLocaleTimeString(),
          date: new Date().toLocaleDateString(),
          url: url.trim(),
          id: Date.now()
        }, ...downloadHistory.slice(0, 4)]
        
        setDownloadHistory(newHistory)
        setStats(prev => ({
          ...prev,
          totalDownloads: prev.totalDownloads + 1
        }))
      } else {
        setError('Failed to fetch media. Please check the URL.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleExampleClick = () => {
    setUrl('https://pin.it/3WDQvZszP')
  }

  const clearHistory = () => {
    setDownloadHistory([])
    localStorage.removeItem('pinterestDownloadHistory')
  }

  const removeFromHistory = (id) => {
    setDownloadHistory(prev => prev.filter(item => item.id !== id))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <AuroraBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6"
        >
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-50 animate-glow"></div>
              <div className="relative p-4 rounded-2xl bg-gray-900/70 backdrop-blur-xl border border-gray-700/50">
                <Download className="w-10 h-10 text-white" />
                <div className="absolute -top-2 -right-2 animate-bounce-slow">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Pinterest Downloader
              </h1>
              <p className="text-gray-400 text-sm mt-2 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Download high-quality media from Pinterest instantly
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-900/50 backdrop-blur-sm border border-gray-700/30">
              <Star className="w-4 h-4 text-yellow-400" />
              <div>
                <span className="text-sm font-medium text-white">
                  {stats.totalDownloads} Downloads
                </span>
                <div className="text-xs text-gray-400">
                  {stats.successRate}% success rate
                </div>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Download Card */}
            <motion.div variants={itemVariants} className="mb-8">
              <DownloadCard
                url={url}
                setUrl={setUrl}
                onSubmit={handleSubmit}
                loading={loading}
                error={error}
                onExampleClick={handleExampleClick}
              />
            </motion.div>

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8"
              >
                <LoadingSpinner />
              </motion.div>
            )}

            {/* Results */}
            <AnimatePresence mode="wait">
              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 100 }}
                  className="mb-8"
                >
                  <MediaPreview result={result} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Features */}
            <motion.div 
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-16 mb-12"
            >
              <div className="glass-card p-8 rounded-3xl border border-gray-700/30">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Why Choose Our Downloader?
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Experience the best Pinterest downloader with cutting-edge features and premium quality
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <Lightning className="w-8 h-8" />,
                      title: "Lightning Fast",
                      desc: "Download in seconds with our optimized servers",
                      color: "from-blue-500/20 to-blue-600/10 border-blue-500/30"
                    },
                    {
                      icon: <Shield className="w-8 h-8" />,
                      title: "Safe & Secure",
                      desc: "No data collection. Your privacy matters",
                      color: "from-purple-500/20 to-purple-600/10 border-purple-500/30"
                    },
                    {
                      icon: <Globe className="w-8 h-8" />,
                      title: "No Limits",
                      desc: "Unlimited downloads, no registration required",
                      color: "from-pink-500/20 to-pink-600/10 border-pink-500/30"
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -8 }}
                      className={`p-6 rounded-2xl bg-gradient-to-br ${feature.color} backdrop-blur-sm`}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${feature.color.split(' ')[0]} ${feature.color.split(' ')[1]}`}>
                          <div className="text-white">
                            {feature.icon}
                          </div>
                        </div>
                        <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                      </div>
                      <p className="text-gray-400 text-sm">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Download History */}
            {downloadHistory.length > 0 && (
              <motion.div
                variants={itemVariants}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-12"
              >
                <div className="glass-card p-8 rounded-3xl border border-gray-700/30">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30">
                        <History className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Recent Downloads
                        </h2>
                        <p className="text-gray-400 text-sm">
                          Your download history
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearHistory}
                      className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-medium transition-all"
                    >
                      Clear All
                    </motion.button>
                  </div>
                  
                  <div className="space-y-3">
                    {downloadHistory.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="group relative p-4 rounded-2xl bg-gray-900/30 backdrop-blur-sm border border-gray-700/30 hover:border-blue-500/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl ${item.type === 'image' ? 'bg-blue-500/20' : 'bg-purple-500/20'}`}>
                              {item.type === 'image' ? (
                                <ImageIcon className="w-5 h-5 text-blue-400" />
                              ) : (
                                <Video className="w-5 h-5 text-purple-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {item.metadata?.title || 'Pinterest Media'}
                              </p>
                              <p className="text-xs text-gray-400 truncate mt-1">
                                {item.date} • {item.timestamp}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs ${item.type === 'image' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                              {item.type}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => removeFromHistory(item.id)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all"
                            >
                              <Zap className="w-4 h-4 text-gray-400 hover:text-red-400" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 pt-8 border-t border-gray-800/50"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-gray-400">
                Powered by{' '}
                <a 
                  href="https://pin-dl.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  pin-dl.vercel.app API
                </a>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                This tool is for personal use only. Please respect content creators' rights.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                v2.0.0 • Aurora Edition
              </div>
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}

export default App
