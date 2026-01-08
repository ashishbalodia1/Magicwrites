'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Send, Hash, Users, MessageCircle, TrendingUp, Sparkles, Heart, Bookmark, PenSquare } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { formatDate } from '@/lib/utils'

interface Message {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
    username: string
    isFounder: boolean
    profileImage: string | null
  }
}

interface Writing {
  id: string
  title: string
  excerpt: string
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

export default function CommunityPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'feed' | 'chat'>('feed')
  const [writings, setWritings] = useState<Writing[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchWritings()
    fetchMessages()
    
    // Poll for new messages every 3 seconds when on chat tab
    const interval = setInterval(() => {
      if (activeTab === 'chat') {
        fetchMessages()
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [activeTab])

  const scrollToBottom = () => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const fetchWritings = async () => {
    try {
      const res = await fetch('/api/writings?limit=20')
      const data = await res.json()
      setWritings(data.writings || [])
    } catch (error) {
      console.error('Failed to fetch writings:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages?limit=100')
      const data = await res.json()
      setMessages(data.messages || [])
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newMessage.trim() || sending) return

    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
      })

      if (res.ok) {
        setNewMessage('')
        await fetchMessages()
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between flex-wrap gap-4"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#FFED4E] mb-2 flex items-center space-x-3">
                <Users className="w-10 h-10" />
                <span>Community</span>
              </h1>
              <p className="text-neutral-400 text-lg">
                Connect, share, and chat with fellow writers
              </p>
            </div>

            {/* Tab Switcher & Create Button */}
            <div className="flex items-center gap-3">
              <div className="flex bg-neutral-900 rounded-xl p-1 border border-neutral-800">
                <button
                  onClick={() => setActiveTab('feed')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                    activeTab === 'feed'
                      ? 'bg-[#FFED4E] text-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <TrendingUp size={20} />
                  <span>Feed</span>
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                    activeTab === 'chat'
                      ? 'bg-[#FFED4E] text-black'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <MessageCircle size={20} />
                  <span>Chat</span>
                </button>
              </div>
              
              {user && activeTab === 'feed' && (
                <Link
                  href="/write"
                  className="px-6 py-3 bg-gradient-to-r from-[#FFED4E] to-yellow-500 text-black font-bold rounded-xl hover:shadow-lg hover:shadow-[#FFED4E]/30 transition-all flex items-center space-x-2"
                >
                  <PenSquare size={20} />
                  <span>Create</span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Content Area */}
        {activeTab === 'feed' ? (
          // FEED VIEW
          <div>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFED4E]"></div>
              </div>
            ) : writings.length === 0 ? (
              <div className="text-center py-20 bg-neutral-900/50 rounded-2xl border border-neutral-800">
                <Sparkles className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                <p className="text-neutral-400 text-lg mb-6">No writings yet. Be the first!</p>
                {user && (
                  <Link
                    href="/write"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-[#FFED4E] text-black font-semibold rounded-xl hover:bg-[#FFE830] transition-colors"
                  >
                    <span>Start Writing</span>
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
                    transition={{ delay: index * 0.05 }}
                    className="bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 hover:border-[#FFED4E]/30 transition-all duration-300"
                  >
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

                    <Link href={`/writings/${writing.slug}`} className="block p-6">
                      <h3 className="text-xl font-serif font-bold text-white mb-3 hover:text-[#FFED4E] transition-colors line-clamp-2">
                        {writing.title}
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed line-clamp-3 mb-4">
                        {writing.excerpt}
                      </p>
                      
                      {(writing.genre || writing.mood) && (
                        <div className="flex flex-wrap gap-2">
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
                      )}
                    </Link>

                    <div className="px-6 pb-4 flex items-center space-x-6 text-neutral-400 text-sm">
                      <div className="flex items-center space-x-1">
                        <Heart size={16} />
                        <span>{writing._count.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle size={16} />
                        <span>{writing._count.reflections}</span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        ) : (
          // CHAT VIEW - Discord/Telegram Style
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden" style={{ height: 'calc(100vh - 300px)' }}>
            <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="bg-neutral-800/50 px-6 py-4 border-b border-neutral-800 flex items-center space-x-3">
                <Hash className="w-6 h-6 text-[#FFED4E]" />
                <div>
                  <h3 className="text-white font-semibold text-lg">General</h3>
                  <p className="text-neutral-400 text-sm">Community chat for all writers</p>
                </div>
              </div>

              {/* Messages Area */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
              >
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageCircle className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
                      <p className="text-neutral-400">No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex space-x-3 hover:bg-neutral-800/30 p-2 rounded-lg transition-colors"
                    >
                      <Link href={`/writers/${message.user.username}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFED4E] to-yellow-600 flex items-center justify-center text-black font-bold flex-shrink-0">
                          {message.user.name[0].toUpperCase()}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline space-x-2 mb-1">
                          <Link 
                            href={`/writers/${message.user.username}`}
                            className="font-semibold text-white hover:text-[#FFED4E] transition-colors"
                          >
                            {message.user.name}
                          </Link>
                          {message.user.isFounder && (
                            <span className="px-2 py-0.5 bg-[#FFED4E] text-black text-xs font-bold rounded">
                              FOUNDER
                            </span>
                          )}
                          <span className="text-xs text-neutral-500">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <p className="text-neutral-300 break-words">{message.content}</p>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-neutral-800 p-4">
                {user ? (
                  <form onSubmit={handleSendMessage} className="flex space-x-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Message the community..."
                      maxLength={2000}
                      className="flex-1 bg-neutral-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FFED4E] placeholder-neutral-500"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="px-6 py-3 bg-[#FFED4E] text-black font-semibold rounded-xl hover:bg-[#FFE830] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <Send size={20} />
                      <span className="hidden sm:inline">Send</span>
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-neutral-400 mb-4">Sign in to join the conversation</p>
                    <Link
                      href="/auth/login"
                      className="inline-block px-6 py-3 bg-[#FFED4E] text-black font-semibold rounded-xl hover:bg-[#FFE830] transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
