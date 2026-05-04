import { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, RotateCcw, FileText, Trash2, MessageSquare, Sparkles, ChevronRight, X, Plus, Edit2, User, Bot, Clock, Hash } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import EnterpriseLayout from '../layouts/EnterpriseLayout';
import { useUser } from '@clerk/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function EnterpriseChatPage() {
  const { user } = useUser();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const messagesEndRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const token = await user?.getToken();
      const response = await axios.get(`${API_URL}/api/groq-chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatHistory(response.data.data);
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const token = await user?.getToken();
      const response = await axios.get(`${API_URL}/api/groq-chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const chat = response.data.data;
      setMessages(chat.messages);
      setCurrentChatId(chat._id);

      const lastAssistantMsg = chat.messages.filter(m => m.role === 'assistant').pop();
      if (lastAssistantMsg?.sources) {
        setSources(lastAssistantMsg.sources);
      }
    } catch (error) {
      toast.error('Failed to load chat');
    }
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    try {
      const token = await user?.getToken();
      await axios.delete(`${API_URL}/api/groq-chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (currentChatId === chatId) {
        setMessages([]);
        setCurrentChatId(null);
        setSources([]);
      }

      loadChatHistory();
      toast.success('Chat deleted');
    } catch (error) {
      toast.error('Failed to delete chat');
    }
  };

  const renameChat = async (chatId, newTitle) => {
    try {
      const token = await user?.getToken();
      await axios.patch(`${API_URL}/api/groq-chat/${chatId}`,
        { title: newTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadChatHistory();
      setEditingChatId(null);
      toast.success('Chat renamed');
    } catch (error) {
      toast.error('Failed to rename chat');
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setSources([]);
    setInput('');
  };

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);
    setSources([]);

    const assistantMessage = { role: 'assistant', content: '' };
    setMessages(prev => [...prev, assistantMessage]);

    try {
      const token = await user?.getToken();
      abortControllerRef.current = new AbortController();

      const response = await fetch(`${API_URL}/api/groq-chat/ask/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          question: userMessage.content,
          chatId: currentChatId
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'content') {
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1].content += data.content;
                return updated;
              });
            } else if (data.type === 'sources') {
              setSources(data.sources);
              if (data.chatId) {
                setCurrentChatId(data.chatId);
                loadChatHistory();
              }
            } else if (data.type === 'error') {
              toast.error(data.message);
            }
          }
        }
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        toast('Response stopped', { icon: '⏹️' });
      } else {
        toast.error('Failed to get response');
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = 'Error: Failed to generate response';
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRetry = () => {
    if (messages.length >= 2) {
      const lastUserMessage = messages[messages.length - 2];
      if (lastUserMessage.role === 'user') {
        setMessages(prev => prev.slice(0, -2));
        setInput(lastUserMessage.content);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredChats = chatHistory.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <EnterpriseLayout activeTab="chat">
      <div className="flex h-full">
        {/* Chat History Sidebar */}
        <div className="w-80 glass border-r border-white/20 flex flex-col">
          {/* New Chat Button */}
          <div className="p-4 border-b border-white/10">
            <button
              onClick={startNewChat}
              className="w-full btn btn-primary shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              New Chat
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
              <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Recent Chats</h3>
            {filteredChats.map(chat => (
              <div
                key={chat._id}
                className={`group relative p-3 rounded-xl cursor-pointer transition-all animate-fade-in ${currentChatId === chat._id
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white/50 hover:bg-white/80 text-gray-700 hover:shadow-md'
                  }`}
                onClick={() => loadChat(chat._id)}
              >
                {editingChatId === chat._id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={() => renameChat(chat._id, editingTitle)}
                    onKeyPress={(e) => e.key === 'Enter' && renameChat(chat._id, editingTitle)}
                    className="w-full px-2 py-1 text-sm bg-white text-gray-900 rounded border-2 border-indigo-500 focus:outline-none"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <Hash className="w-3 h-3 opacity-50" />
                        <p className="text-sm font-medium line-clamp-2">{chat.title}</p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingChatId(chat._id);
                            setEditingTitle(chat.title);
                          }}
                          className="p-1 hover:bg-white/20 rounded transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => deleteChat(chat._id, e)}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <p className={`text-xs mt-1 ${currentChatId === chat._id ? 'text-white/70' : 'text-gray-500'}`}>
                      {new Date(chat.updatedAt).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-white/30 backdrop-blur-sm">
          {/* Header */}
          <div className="glass border-b border-white/20 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Assistant</h1>
                <p className="text-sm text-gray-600">Ask anything about your documents</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-md animate-fade-in">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl">
                    <MessageSquare className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Start a Conversation</h2>
                  <p className="text-gray-600 mb-6">Ask me anything about your company documents and SOPs</p>
                  <div className="grid grid-cols-1 gap-3">
                    {['What are our refund policies?', 'How do I process an invoice?', 'What are the security guidelines?'].map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setInput(suggestion)}
                        className="px-4 py-3 text-sm text-left bg-white/80 hover:bg-white rounded-xl shadow-md hover:shadow-lg transition-all text-gray-700"
                      >
                        <ChevronRight className="w-4 h-4 inline mr-2 text-indigo-600" />
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} items-start gap-3 animate-fade-in`}
                  >
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-indigo-100' : 'bg-purple-100'}`}>
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Bot className="w-4 h-4 text-purple-600" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div
                        className={`max-w-[80%] rounded-2xl px-5 py-4 shadow-md ${msg.role === 'user'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'glass text-gray-800'
                          }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                        {msg.role === 'assistant' && idx === messages.length - 1 && isStreaming && (
                          <span className="inline-block w-2 h-5 bg-indigo-600 animate-pulse ml-1 rounded"></span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 mt-1 ml-2">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Sources Panel */}
          {sources.length > 0 && (
            <div className="glass border-t border-white/20 px-6 py-4">
              <div className="max-w-4xl mx-auto">
                <h3 className="text-xs font-semibold text-gray-600 uppercase mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Sources Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sources.map((source, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSource(source)}
                      className="group px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition-all text-sm border border-gray-200 hover:border-indigo-300"
                    >
                      <span className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                        {source.filename}
                      </span>
                      <span className="text-gray-500 ml-2">• Page {source.pageNumber}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="glass border-t border-white/20 px-6 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about your SOPs..."
                    className="w-full px-5 py-4 bg-white border-2 border-gray-200 focus:border-indigo-500 rounded-2xl focus:outline-none resize-none shadow-md transition-all"
                    rows={1}
                    disabled={isStreaming}
                    style={{
                      minHeight: '56px',
                      maxHeight: '160px',
                      height: 'auto'
                    }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                </div>

                {isStreaming ? (
                  <button
                    onClick={handleStop}
                    className="px-5 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-2xl hover:shadow-lg transition-all flex items-center gap-2 font-medium shadow-md"
                  >
                    <StopCircle className="w-5 h-5" />
                    Stop
                  </button>
                ) : (
                  <>
                    {messages.length > 0 && (
                      <button
                        onClick={handleRetry}
                        className="px-4 py-4 bg-white text-gray-700 rounded-2xl hover:shadow-lg transition-all shadow-md border border-gray-200"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium shadow-lg"
                    >
                      <Send className="w-5 h-5" />
                      Send
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Source Preview Modal */}
        {selectedSource && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="glass max-w-2xl w-full rounded-2xl shadow-2xl animate-scale-in">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedSource.filename}</h3>
                  <p className="text-sm text-gray-600">Page {selectedSource.pageNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedSource(null)}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    PDF preview feature coming soon. This will display the relevant section from the document with highlighted text.
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                    Similarity: {(selectedSource.similarity * 100).toFixed(1)}%
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    Document ID: {selectedSource.documentId.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </EnterpriseLayout>
  );
}
