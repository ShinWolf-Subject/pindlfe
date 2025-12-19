import React from 'react'
import { motion } from 'framer-motion'

function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-10 group-hover:opacity-20 transition duration-500"></div>
      
      <div className="relative glass-card p-12 rounded-3xl border border-gray-700/30 backdrop-blur-xl">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Main spinner */}
          <div className="relative">
            {/* Outer ring */}
            <div className="w-32 h-32 border-4 border-gray-700/30 rounded-full"></div>
            
            {/* Animated gradient ring */}
            <motion.div
              className="absolute top-0 left-0 w-32 h-32 border-4 border-transparent border-t-blue-500 border-r-purple-500 border-b-pink-500 border-l-blue-400 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner pulse */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <motion.div
                className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Text and animation */}
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Processing Your Request
              </h3>
              <p className="text-gray-400">
                Fetching high-quality content from Pinterest servers...
              </p>
            </div>
            
            {/* Animated dots */}
            <div className="flex justify-center gap-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  animate={{ 
                    y: [0, -15, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LoadingSpinner
