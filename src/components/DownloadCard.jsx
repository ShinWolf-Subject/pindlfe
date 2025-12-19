import React from 'react'
import { motion } from 'framer-motion'
import { Link, Sparkles, Copy, Zap, ChevronRight } from 'lucide-react'

function DownloadCard({ url, setUrl, onSubmit, loading, error, onExampleClick }) {
  
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch (err) {
      console.error('Failed to read clipboard:', err)
    }
  }

  return (
    <motion.div 
      initial={{ y: 40, opacity: 0, scale: 0.95 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative glass-card p-8 rounded-3xl border border-gray-700/30 backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-700/50">
                <Link className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Enter Pinterest URL
              </h2>
              <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Supports pin.it and pinterest.com links
              </p>
            </div>
          </div>
          
          <div className="flex-1"></div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExampleClick}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-400 font-medium hover:from-blue-500/30 hover:to-purple-500/30 transition-all flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            Try Example
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative flex items-center">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Pinterest URL here... (e.g., https://pin.it/3WDQvZszP)"
                className="flex-1 px-6 py-5 bg-gray-900/80 backdrop-blur-xl rounded-2xl border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none text-white placeholder-gray-500 transition-all text-lg"
                disabled={loading}
              />
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePaste}
                className="absolute right-3 px-4 py-2 rounded-xl bg-gray-800/50 hover:bg-gray-800/80 border border-gray-600/30 text-gray-300 text-sm font-medium transition-all flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Paste
              </motion.button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20"
            >
              <div className="p-2 rounded-xl bg-red-500/20">
                <Zap className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-medium">Error</p>
                <p className="text-red-400/80 text-sm mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 40px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="relative flex-1 px-8 py-5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-50 group-hover:opacity-70 transition duration-500"></div>
              <span className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin-slow"></div>
                    Processing Request...
                  </>
                ) : (
                  <>
                    <Link className="w-6 h-6" />
                    Download Media Now
                  </>
                )}
              </span>
            </motion.button>
          </div>
        </form>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: <Sparkles className="w-5 h-5" />,
              title: "High Quality",
              desc: "Download in original resolution",
              color: "from-blue-500/10 to-blue-600/5 border-blue-500/20"
            },
            {
              icon: <Zap className="w-5 h-5" />,
              title: "Fast & Free",
              desc: "No registration required",
              color: "from-purple-500/10 to-purple-600/5 border-purple-500/20"
            },
            {
              icon: <ChevronRight className="w-5 h-5" />,
              title: "Multi-Format",
              desc: "Images, videos & galleries",
              color: "from-pink-500/10 to-pink-600/5 border-pink-500/20"
            }
          ].map((feature, index) => (
            <div key={index} className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color}`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${feature.color.split(' ')[0]} ${feature.color.split(' ')[1]}`}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <p className="text-lg font-semibold text-white">{feature.title}</p>
              </div>
              <p className="text-sm text-gray-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 rounded-2xl bg-gray-900/30 border border-gray-700/30">
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-blue-400" />
            Copy any Pinterest URL from the browser address bar or right-click on a pin and select "Copy link address"
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default DownloadCard
