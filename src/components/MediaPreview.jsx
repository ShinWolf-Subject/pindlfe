import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Image as ImageIcon, Video, ExternalLink, Check, Copy, Share2, Maximize2, ChevronLeft, ChevronRight, Layers } from 'lucide-react'

function MediaPreview({ result }) {
  const [copied, setCopied] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)

  const handleDownload = (url) => {
    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.download = `pinterest-${Date.now()}.${result.type === 'image' ? 'jpg' : 'mp4'}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Pinterest Media',
          text: 'Check out this media from Pinterest!',
          url: result.metadata.source
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      handleCopy(result.metadata.source)
    }
  }

  const nextMedia = () => {
    setActiveIndex(prev => (prev < result.urls.length - 1 ? prev + 1 : 0))
  }

  const prevMedia = () => {
    setActiveIndex(prev => (prev > 0 ? prev - 1 : result.urls.length - 1))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      {/* Glow border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition duration-500"></div>
      
      <div className="relative glass-card p-8 rounded-3xl border border-gray-700/30 backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className={`relative ${result.type === 'image' ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10' : 'bg-gradient-to-br from-purple-500/20 to-purple-600/10'} p-4 rounded-2xl border ${result.type === 'image' ? 'border-blue-500/30' : 'border-purple-500/30'}`}>
              {result.type === 'image' ? (
                <ImageIcon className="w-8 h-8 text-blue-400" />
              ) : (
                <Video className="w-8 h-8 text-purple-400" />
              )}
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-xs font-bold text-white">{result.urls.length}</span>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">
                Media Preview
              </h2>
              <p className="text-gray-400 text-sm mt-2">
                {result.type === 'image' ? 'Image Gallery' : 'Video Collection'} • {result.urls.length} item{result.urls.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30">
              <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {result.type.toUpperCase()}
              </span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="p-3 rounded-xl bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/30 text-gray-300 hover:text-white transition-all"
            >
              <Share2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Media Gallery */}
        <div className="mb-8">
          <div className="relative">
            {/* Media Counter */}
            {result.urls.length > 1 && (
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-400">
                    {activeIndex + 1} of {result.urls.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {result.urls.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === activeIndex ? 'bg-blue-400 scale-125' : 'bg-gray-600 hover:bg-gray-500'}`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Media Display */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-900/50">
              {result.type === 'image' ? (
                <motion.img
                  key={activeIndex}
                  src={result.urls[activeIndex].url}
                  alt={result.urls[activeIndex].alt || `Pinterest image ${activeIndex + 1}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`w-full ${expanded ? 'h-[600px]' : 'h-[400px]'} object-cover transition-all duration-500 cursor-pointer`}
                  onClick={() => setExpanded(!expanded)}
                />
              ) : (
                <video
                  src={result.urls[activeIndex].url}
                  className="w-full h-[400px] object-cover rounded-2xl"
                  controls
                  autoPlay
                  muted
                />
              )}
              
              {/* Navigation Arrows */}
              {result.urls.length > 1 && (
                <>
                  <motion.button
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevMedia}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-xl bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/10 text-white transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextMedia}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-xl bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/10 text-white transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                </>
              )}
              
              {/* Expand Button for Images */}
              {result.type === 'image' && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setExpanded(!expanded)}
                  className="absolute bottom-4 right-4 p-3 rounded-xl bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/10 text-white transition-all"
                >
                  <Maximize2 className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Download Links */}
        <div className="space-y-6">
          {/* Download Link with Copy */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-gray-900/30 to-gray-900/50 backdrop-blur-sm border border-gray-700/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-white flex items-center gap-2">
                <Copy className="w-5 h-5 text-blue-400" />
                Download Link
              </span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCopy(result.downloadLink)}
                className={`px-4 py-2 rounded-xl ${copied ? 'bg-green-500/20 border-green-500/30' : 'bg-blue-500/20 border-blue-500/30'} border transition-all flex items-center gap-2`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-medium text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-medium text-blue-400">Copy Link</span>
                  </>
                )}
              </motion.button>
            </div>
            <p className="text-sm text-gray-400 break-all bg-gray-900/50 p-3 rounded-xl font-mono">
              {result.downloadLink}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 10px 40px rgba(59, 130, 246, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleDownload(result.downloadLink)}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:shadow-2xl transition-all text-lg group"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-xl opacity-50 group-hover:opacity-70 transition duration-500"></div>
              <span className="relative flex items-center gap-3">
                <Download className="w-6 h-6" />
                Download All ({result.urls.length})
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.open(result.metadata.source, '_blank')}
              className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-800/50 hover:bg-gray-800/80 backdrop-blur-xl text-white font-semibold rounded-2xl hover:shadow-xl transition-all border border-gray-700/30 text-lg"
            >
              <ExternalLink className="w-6 h-6" />
              View Original on Pinterest
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MediaPreview
