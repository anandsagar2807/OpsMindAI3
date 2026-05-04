import { useState, useRef, useEffect } from 'react';
import { Send, StopCircle, RotateCcw, FileText, Trash2, MessageSquare } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function GroqChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [sources, setSources] = useState([]);
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
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
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

  const deleteChat = async (chatId) => {
    try {
      const token = localStorage.getItem('token');
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
      const token = localStorage.getItem('token');
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

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={startNewChat}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Chat History</h3>
          {chatHistory.map(chat => (
            <div
              key={chat._id}
              className={`group p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                currentChatId === chat._id
                  ? 'bg-indigo-50 border border-indigo-200'
                  : 'hover:bg-gray-50 border border-transparent'
              }`}
              onClick={() => loadChat(chat._id)}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-gray-700 line-clamp-2 flex-1">{chat.title}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat._id);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="w-4 h-4 text-red-500 hover:text-red-700" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(chat.updatedAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-xl font-semibold text-gray-800">OpsMind AI Chat</h1>
          <p className="text-sm text-gray-500">Ask questions about your company SOPs</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Start a Conversation</h2>
                <p className="text-gray-500">Ask me anything about your company documents and SOPs</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.role === 'assistant' && idx === messages.length - 1 && isStreaming && (
                      <span className="inline-block w-2 h-4 bg-gray-400 animate-pulse ml-1"></span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Sources Panel */}
        {sources.length > 0 && (
          <div className="bg-gray-100 border-t border-gray-200 px-6 py-3">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-xs font-semibold text-gray-600 uppercase mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Sources Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {sources.map((source, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-xs"
                  >
                    <span className="font-medium text-gray-700">{source.filename}</span>
                    <span className="text-gray-500"> • Page {source.pageNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about your SOPs..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  rows={1}
                  disabled={isStreaming}
                  style={{
                    minHeight: '48px',
                    maxHeight: '120px',
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
                  className="px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2"
                >
                  <StopCircle className="w-5 h-5" />
                  Stop
                </button>
              ) : (
                <>
                  {messages.length > 0 && (
                    <button
                      onClick={handleRetry}
                      className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
    </div>
  );
}
