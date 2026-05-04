import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Brain,
  User,
  FileText,
  Sparkles,
  Loader,
  Plus,
  Search,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react'
import { Card, Button } from '../components/ui'
import DashboardLayout from '../layouts/DashboardLayout'
import { useAuth } from '@clerk/react'

const API_URL = 'http://127.0.0.1:5000/api'

const SourceCard = ({ source, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="p-4 bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-xl hover:border-primary-500/50 transition-all group"
  >
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-500/30 transition-colors">
        <FileText className="w-5 h-5 text-primary-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white mb-1 truncate">
          {source.name}
        </h4>
        <div className="flex items-center gap-3 text-xs text-dark-400">
          <span className="flex items-center gap-1">
            <FileText className="w-3 h-3" />
            Page {source.page}
          </span>
          {source.score && (
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {(source.score * 100).toFixed(1)}%
            </span>
          )}
        </div>
        {source.preview && (
          <p className="mt-2 text-xs text-dark-300 line-clamp-2">
            {source.preview}
          </p>
        )}
      </div>
    </div>
  </motion.div>
)

const SearchResultCard = ({ result, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"
  >
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-primary-400" />
        <span className="text-sm font-medium text-white">{result.documentName}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-dark-400">Page {result.pageNumber}</span>
        <div className="px-2 py-1 bg-primary-500/20 rounded-md">
          <span className="text-xs font-semibold text-primary-300">
            {(result.score * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
    <p className="text-sm text-dark-300 leading-relaxed line-clamp-3">
      {result.text}
    </p>
  </motion.div>
)

const ChatPage = () => {
  const { getToken } = useAuth()
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. Ask me anything about your company documents.',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const [searchMode, setSearchMode] = useState(false)
  const [searchResults, setSearchResults] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSearch = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    const query = input
    setInput('')
    setIsTyping(true)
    setError(null)
    setSearchResults(null)

    try {
      const token = await getToken()

      const response = await fetch(`${API_URL}/chat/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get search results')
      }

      setSearchResults(data.data)

      const resultMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: data.message,
        searchResults: data.data.results,
        metadata: data.data.metadata,
        timestamp: new Date(),
        isSearch: true
      }

      setMessages(prev => [...prev, resultMessage])
    } catch (err) {
      console.error('Search error:', err)
      setError(err.message)

      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}`,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleChat = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    const query = input
    setInput('')
    setIsTyping(true)
    setError(null)

    try {
      const token = await getToken()

      const response = await fetch(`${API_URL}/chat/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get response')
      }

      const aiMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: data.data.response,
        sources: data.data.sources.map(source => ({
          name: source.filename,
          page: source.pageNumber,
          documentId: source.documentId,
          score: source.similarity
        })),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      console.error('Chat error:', err)
      setError(err.message)

      const errorMessage = {
        id: messages.length + 2,
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}`,
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSend = () => {
    if (searchMode) {
      handleSearch()
    } else {
      handleChat()
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto h-[calc(100vh-12rem)] flex gap-6">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {searchMode ? 'Search Documents' : 'Chat'}
              </h1>
              <p className="text-dark-400">
                {searchMode ? 'Find relevant information in your documents' : 'Ask questions about your documents'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={searchMode ? 'primary' : 'secondary'}
                icon={Search}
                iconPosition="left"
                onClick={() => setSearchMode(!searchMode)}
              >
                {searchMode ? 'Search Mode' : 'Chat Mode'}
              </Button>
              <Button
                variant="secondary"
                icon={Plus}
                iconPosition="left"
                onClick={() => {
                  setMessages([{
                    id: 1,
                    role: 'assistant',
                    content: 'Hello! I\'m your AI assistant. Ask me anything about your company documents.',
                    timestamp: new Date()
                  }])
                  setError(null)
                  setSearchResults(null)
                }}
              >
                New Chat
              </Button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          <Card glass className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div className={`
                      w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                      ${message.role === 'user'
                        ? 'bg-gradient-to-br from-primary-500 to-blue-600'
                        : 'bg-gradient-to-br from-purple-500 to-pink-600'
                      }
                    `}>
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Brain className="w-5 h-5 text-white" />
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`
                        inline-block max-w-3xl p-4 rounded-2xl
                        ${message.role === 'user'
                          ? 'bg-primary-500/20 border border-primary-500/30'
                          : message.isError
                          ? 'bg-red-500/10 border border-red-500/30'
                          : 'bg-white/5 border border-white/10'
                        }
                      `}>
                        <p className="text-white leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>

                        {/* Search Results */}
                        {message.isSearch && message.searchResults && (
                          <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-xs font-medium text-primary-300">
                                Found {message.searchResults.length} results
                              </p>
                              {message.metadata && (
                                <p className="text-xs text-dark-400">
                                  Avg similarity: {(message.metadata.avgSimilarity * 100).toFixed(1)}%
                                </p>
                              )}
                            </div>
                            {message.searchResults.slice(0, 3).map((result, idx) => (
                              <SearchResultCard key={idx} result={result} index={idx} />
                            ))}
                          </div>
                        )}

                        {/* Sources */}
                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                            <p className="text-xs font-medium text-primary-300 mb-2">Sources:</p>
                            {message.sources.map((source, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2 text-dark-400">
                                  <FileText className="w-3 h-3" />
                                  <span>{source.name}, Page {source.page}</span>
                                </div>
                                {source.score && (
                                  <span className="text-primary-400 font-medium">
                                    {(source.score * 100).toFixed(1)}%
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-dark-500 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 p-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={searchMode ? "Search for: refund policy, leave policy, etc..." : "Ask anything about your documents..."}
                    rows="1"
                    className="
                      w-full px-4 py-3 pr-12
                      bg-dark-800/50 border border-dark-700
                      rounded-xl text-white placeholder-dark-500
                      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
                      resize-none
                      transition-all
                    "
                  />
                  {searchMode ? (
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                  ) : (
                    <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                  )}
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  icon={searchMode ? Search : Send}
                  className="px-6"
                >
                  {searchMode ? 'Search' : 'Send'}
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sources Sidebar */}
        <div className="w-80 space-y-4">
          {searchResults && searchResults.results && searchResults.results.length > 0 && (
            <Card glass>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Search Results</h3>
              </div>
              <div className="space-y-3">
                {searchResults.results.map((result, idx) => (
                  <SourceCard
                    key={idx}
                    source={{
                      name: result.documentName,
                      page: result.pageNumber,
                      score: result.score,
                      preview: result.text.substring(0, 100) + '...'
                    }}
                    index={idx}
                  />
                ))}
              </div>
              {searchResults.metadata && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-400">Documents searched</span>
                    <span className="text-white font-medium">{searchResults.metadata.documentsSearched}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-dark-400">Avg similarity</span>
                    <span className="text-primary-400 font-medium">
                      {(searchResults.metadata.avgSimilarity * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              )}
            </Card>
          )}

          <Card glass>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary-400" />
              <h3 className="text-lg font-semibold text-white">Quick Searches</h3>
            </div>
            <div className="space-y-2">
              {[
                'What is our refund policy?',
                'How do I request leave?',
                'What is the escalation matrix?',
                'Security guidelines',
                'Password reset procedure'
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(suggestion)}
                  className="w-full text-left p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-dark-300 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </Card>

          <Card glass>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Tips</h3>
            </div>
            <div className="space-y-3 text-xs text-dark-300">
              <p className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Use Search Mode to find exact document chunks with similarity scores</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Use Chat Mode to get AI-generated answers with source citations</span>
              </p>
              <p className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Similarity scores above 70% indicate highly relevant results</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ChatPage
