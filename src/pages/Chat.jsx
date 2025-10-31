import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { api } from '../lib/api'
import Layout from '../components/Layout'

export default function Chat() {
  const { id } = useParams() // course id
  const { user, token } = useSelector((s)=> s.auth)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Fetch initial messages
    api.get(`/courses/${id}/chat`).then(({ data }) => setMessages(data.messages || []))

    // Setup socket
    const baseURL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'
    socketRef.current = io(baseURL, {
      auth: { token }
    })

    socketRef.current.emit('join-course', id)

    socketRef.current.on('new-message', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    return () => {
      if (socketRef.current) socketRef.current.disconnect()
    }
  }, [id, token])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !user) return
    socketRef.current.emit('send-message', {
      courseId: id,
      senderId: user.id,
      message: input.trim()
    })
    setInput('')
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col h-[calc(100vh-200px)]">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Course Chat</h2>
          <p className="text-gray-600 text-sm">Real-time communication with course participants</p>
        </div>
        
        {/* Messages Container */}
        <div className="flex-1 border border-gray-200 rounded-lg bg-white overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map(m => (
                <div 
                  key={m._id} 
                  className={`flex ${m.sender?.id === user?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      m.sender?.id === user?.id 
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {m.sender?.id !== user?.id && (
                      <div className="text-xs font-medium text-gray-600 mb-1">
                        {m.sender?.name || 'Unknown'}
                      </div>
                    )}
                    <div className="text-sm">{m.message}</div>
                    <div className={`text-xs mt-1 ${
                      m.sender?.id === user?.id ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {new Date(m.createdAt || Date.now()).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2 mt-3">
          <input 
            className="flex-1 border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyPress={(e)=>e.key==='Enter' && sendMessage()}
            placeholder="Type your message here..."
          />
          <button 
            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md font-medium hover:shadow-md transition-all disabled:opacity-50 text-sm"
            onClick={sendMessage}
            disabled={!input.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </Layout>
  )
}