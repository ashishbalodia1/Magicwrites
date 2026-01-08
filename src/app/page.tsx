'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageCircle, Bookmark, Sparkles, TrendingUp, Users, Feather, ChevronRight, Star, Award, Zap } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/lib/utils'

interface Writing {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  genre: string | null
  mood: string | null
  createdAt: string
  author: {
    id: string
    name: string
    username: string
    isFounder: boolean
  }
  _count: {
    likes: number
    reflections: number
    reposts: number
  }
}

export default function HomePage() {
  const { user } = useAuth()
  const [writings, setWritings] = useState<Writing[]>([])
  const [featuredWriting, setFeaturedWriting] = useState<Writing | null>(null)
  const [loading, setLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [savedPosts, setSavedPosts] = useState<Set<string>>(new Set())
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  useEffect(() => {
    fetchWritings()
  }, [])

  const fetchWritings = async () => {
    try {
      const res = await fetch('/api/writings?limit=20')
      const data = await res.json()
      if (data.writings && data.writings.length > 0) {
        setFeaturedWriting(data.writings[0])
        setWritings(data.writings.slice(1))
      }
    } catch (error) {
      console.error('Failed to fetch writings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (writingId: string) => {
    if (!user) {
      showToastMessage('Please sign in to like writings')
      return
    }
    
    try {
      const res = await fetch(`/api/writings/${writingId}/like`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        if (data.liked) {
          setLikedPosts(new Set([...likedPosts, writingId]))
          showToastMessage('Added to your favorites ❤️')
        } else {
          const newLiked = new Set(likedPosts)
          newLiked.delete(writingId)
          setLikedPosts(newLiked)
        }
        fetchWritings()
      }
    } catch (error) {
      console.error('Failed to like:', error)
    }
  }

  const handleSave = (writingId: string) => {
    if (savedPosts.has(writingId)) {
      const newSaved = new Set(savedPosts)
      newSaved.delete(writingId)
      setSavedPosts(newSaved)
      showToastMessage('Removed from saved')
    } else {
      setSavedPosts(new Set([...savedPosts, writingId]))
      showToastMessage('Saved for later 📚')
    }
  }

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-[#FFED4E]/5 via-transparent to-transparent opacity-50" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center space-x-2 mb-6 px-5 py-2.5 bg-gradient-to-r from-[#FFED4E]/20 to-yellow-500/20 border border-[#FFED4E]/40 rounded-full shadow-lg shadow-[#FFED4E]/10">
              <Award className="w-5 h-5 text-[#FFED4E]" />
              <span className="text-[#FFED4E] text-sm font-bold tracking-wide">PREMIUM WRITERS COMMUNITY</span>
              <Sparkles className="w-4 h-4 text-[#FFED4E]" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 bg-gradient-to-r from-white via-[#FFED4E] to-white bg-clip-text text-transparent leading-tight">
              Where Words Become Legacy
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-300 max-w-2xl mx-auto mb-8 font-light">
              Join an <span className="text-[#FFED4E] font-semibold">exclusive community</span> of writers crafting stories that matter
            </p>

            {!user && (
              <div className="flex items-center justify-center space-x-4 flex-wrap gap-2">
                <Link href="/write" className="px-8 py-4 bg-[#FFED4E] text-black font-bold rounded-xl hover:bg-[#FFE830] transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-[#FFED4E]/20">
                  <Feather size={20} />
                  <span>Start Writing</span>
                </Link>
                <Link href="/community" className="px-8 py-4 bg-neutral-800 text-white font-semibold rounded-xl hover:bg-neutral-700 transition-all duration-300 border border-neutral-700">
                  Explore Community
                </Link>
              </div>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          >
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 backdrop-blur-sm border border-[#FFED4E]/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-[#FFED4E]/20 transition-all"
            >
              <Users className="w-8 h-8 text-[#FFED4E] mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">Elite</div>
              <div className="text-neutral-300 text-sm font-medium">Writers Community</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 backdrop-blur-sm border border-[#FFED4E]/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-[#FFED4E]/20 transition-all"
            >
              <Feather className="w-8 h-8 text-[#FFED4E] mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">{loading ? '...' : writings.length + (featuredWriting ? 1 : 0)}</div>
              <div className="text-neutral-300 text-sm font-medium">Published Works</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-neutral-900 to-neutral-800 backdrop-blur-sm border border-[#FFED4E]/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-[#FFED4E]/20 transition-all"
            >
              <TrendingUp className="w-8 h-8 text-[#FFED4E] mx-auto mb-3" />
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <div className="text-neutral-300 text-sm font-medium">Quality Content</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Writing */}
      {featuredWriting && (
        <section className="px-4 sm:px-6 lg:px-8 mb-16">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mb-6 flex items-center justify-between"
            >
              <h2 className="text-2xl font-serif font-bold text-[#FFED4E] flex items-center space-x-2">
                <Sparkles className="w-6 h-6" />
                <span>Featured Story</span>
              </h2>
            </motion.div>

            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              whileHover={{ scale: 1.01 }}
              className="relative bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl overflow-hidden border border-[#FFED4E]/30 shadow-2xl shadow-[#FFED4E]/20 hover:shadow-[#FFED4E]/30 transition-all duration-500 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFED4E]/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFED4E]/5 rounded-full blur-3xl" />
              
              <div className="relative p-8 md:p-12">
                {/* Author Info */}
                <Link href={`/writers/${featuredWriting.author.username}`} className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFED4E] to-yellow-600 flex items-center justify-center text-black font-bold text-2xl">
                    {featuredWriting.author.name[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-white">{featuredWriting.author.name}</span>
                      {featuredWriting.author.isFounder && (
                        <span className="px-3 py-1 bg-[#FFED4E] text-black text-xs font-bold rounded-full">
                          FOUNDER
                        </span>
                      )}
                    </div>
                    <span className="text-neutral-400 text-sm">@{featuredWriting.author.username}</span>
                  </div>
                </Link>

                {/* Content */}
                <Link href={`/writings/${featuredWriting.slug}`}>
                  <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 hover:text-[#FFED4E] transition-colors">
                    {featuredWriting.title}
                  </h3>
                  <p className="text-xl text-neutral-300 leading-relaxed mb-6 line-clamp-3">
                    {featuredWriting.excerpt}
                  </p>
                </Link>

                {/* Tags & Actions */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center space-x-3">
                    {featuredWriting.genre && (
                      <span className="px-4 py-2 bg-neutral-800 text-[#FFED4E] text-sm font-medium rounded-full border border-[#FFED4E]/30">
                        {featuredWriting.genre}
                      </span>
                    )}
                    {featuredWriting.mood && (
                      <span className="px-4 py-2 bg-neutral-800 text-neutral-300 text-sm rounded-full border border-neutral-700">
                        {featuredWriting.mood}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-6 text-neutral-400">
                    <button
                      onClick={() => handleLike(featuredWriting.id)}
                      disabled={!user}
                      className="flex items-center space-x-2 hover:text-red-400 transition-colors disabled:opacity-50"
                    >
                      <Heart size={20} fill={likedPosts.has(featuredWriting.id) ? 'currentColor' : 'none'} className={likedPosts.has(featuredWriting.id) ? 'text-red-400' : ''} />
                      <span>{featuredWriting._count.likes}</span>
                    </button>
                    
                    <Link href={`/writings/${featuredWriting.slug}#reflections`} className="flex items-center space-x-2 hover:text-[#FFED4E] transition-colors">
                      <MessageCircle size={20} />
                      <span>{featuredWriting._count.reflections}</span>
                    </Link>
                    
                    <button
                      onClick={() => handleSave(featuredWriting.id)}
                      className="flex items-center space-x-2 hover:text-[#FFED4E] transition-colors"
                    >
                      <Bookmark size={20} fill={savedPosts.has(featuredWriting.id) ? 'currentColor' : 'none'} className={savedPosts.has(featuredWriting.id) ? 'text-[#FFED4E]' : ''} />
                    </button>

                    <Link href={`/writings/${featuredWriting.slug}`} className="flex items-center space-x-2 text-[#FFED4E] hover:text-[#FFE830] transition-colors font-medium">
                      <span>Read More</span>
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>
        </section>
      )}

      {/* Recent Writings Grid */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-white">Latest from the Community</h2>
            <Link href="/community" className="text-[#FFED4E] hover:text-[#FFE830] flex items-center space-x-2 font-medium">
              <span>View All</span>
              <ChevronRight size={20} />
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFED4E]"></div>
            </div>
          ) : writings.length === 0 && !featuredWriting ? (
            <div className="text-center py-20 bg-neutral-900 rounded-2xl border border-neutral-800">
              <Feather className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
              <p className="text-neutral-400 text-lg mb-6">No writings yet. Be the first to share!</p>
              {user && (
                <Link href="/write" className="inline-flex items-center space-x-2 px-6 py-3 bg-[#FFED4E] text-black font-semibold rounded-xl hover:bg-[#FFE830] transition-colors">
                  <Feather size={20} />
                  <span>Write Something</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {writings.map((writing, index) => (
                <motion.article
                  key={writing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-[#FFED4E]/50 transition-all duration-300 hover:shadow-xl hover:shadow-[#FFED4E]/20 group"
                >
                  {/* Author */}
                  <div className="p-4 border-b border-neutral-800">
                    <Link href={`/writers/${writing.author.username}`} className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFED4E] to-yellow-600 flex items-center justify-center text-black font-bold">
                        {writing.author.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white text-sm">{writing.author.name}</span>
                          {writing.author.isFounder && (
                            <span className="px-2 py-0.5 bg-[#FFED4E] text-black text-xs font-bold rounded">F</span>
                          )}
                        </div>
                        <span className="text-xs text-neutral-400">{formatDate(writing.createdAt)}</span>
                      </div>
                    </Link>
                  </div>

                  {/* Content */}
                  <Link href={`/writings/${writing.slug}`} className="block p-6">
                    <h3 className="text-xl font-serif font-bold text-white mb-3 hover:text-[#FFED4E] transition-colors line-clamp-2">
                      {writing.title}
                    </h3>
                    <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3 mb-4">
                      {writing.excerpt}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {writing.genre && (
                        <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-xs rounded-full">
                          {writing.genre}
                        </span>
                      )}
                      {writing.mood && (
                        <span className="px-3 py-1 bg-neutral-800 text-neutral-300 text-xs rounded-full">
                          {writing.mood}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Actions */}
                  <div className="px-6 pb-4 flex items-center justify-between text-neutral-400 text-sm">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(writing.id)}
                      disabled={!user}
                      className="flex items-center space-x-1 hover:text-red-400 transition-colors disabled:opacity-50 group"
                    >
                      <Heart size={16} fill={likedPosts.has(writing.id) ? 'currentColor' : 'none'} className={likedPosts.has(writing.id) ? 'text-red-400' : ''} />
                      <span className="font-medium">{writing._count.likes}</span>
                    </motion.button>
                    
                    <Link href={`/writings/${writing.slug}#reflections`} className="flex items-center space-x-1 hover:text-[#FFED4E] transition-colors group">
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <MessageCircle size={16} />
                      </motion.div>
                      <span className="font-medium">{writing._count.reflections}</span>
                    </Link>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSave(writing.id)}
                      className="hover:text-[#FFED4E] transition-colors"
                    >
                      <Bookmark size={16} fill={savedPosts.has(writing.id) ? 'currentColor' : 'none'} className={savedPosts.has(writing.id) ? 'text-[#FFED4E]' : ''} />
                    </motion.button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="px-4 sm:px-6 lg:px-8 mt-20">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative bg-gradient-to-br from-[#FFED4E]/10 to-neutral-900 rounded-3xl p-12 text-center border border-[#FFED4E]/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
              <div className="relative z-10">
                <Sparkles className="w-12 h-12 text-[#FFED4E] mx-auto mb-6" />
                <h3 className="text-3xl font-serif font-bold text-white mb-4">
                  Ready to Share Your Story?
                </h3>
                <p className="text-neutral-300 text-lg mb-8 max-w-2xl mx-auto">
                  Join our community of writers. No judgment, no metrics, just pure creative expression.
                </p>
                <Link href="/write" className="inline-flex items-center space-x-2 px-8 py-4 bg-[#FFED4E] text-black font-bold rounded-xl hover:bg-[#FFE830] transition-all duration-300 shadow-lg shadow-[#FFED4E]/20">
                  <Feather size={20} />
                  <span>Start Writing Now</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-[#FFED4E]/20 border border-[#FFED4E]/30 z-50 flex items-center space-x-3"
          >
            <Zap className="w-5 h-5 text-[#FFED4E]" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
