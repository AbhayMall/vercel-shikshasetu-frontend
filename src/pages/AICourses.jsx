import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { api } from '../lib/api'
import { Link } from 'react-router-dom'

export default function AICourses() {
  const { token } = useSelector((s)=> s.auth)
  const [topic, setTopic] = useState('')
  const [language, setLanguage] = useState('English')
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])
  const [error, setError] = useState(null)

  async function load() {
    try {
      setError(null)
      const { data } = await api.get('/ai/courses/my')
      setItems(data.courses || [])
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load')
    }
  }

  useEffect(()=>{ if (token) load() }, [token])

  async function onGenerate(e) {
    e.preventDefault()
    if (!topic.trim()) return
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.post('/ai/courses/generate', { topic: topic.trim(), language })
      setItems((prev)=> [data.course, ...prev])
      setTopic('')
    } catch (e) {
      setError(e.response?.data?.error || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">AI Courses</h1>
          <p className="text-gray-600 text-sm">Generate personalized courses using AI. Choose a topic and language.</p>
        </div>

        <form onSubmit={onGenerate} className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter topic (e.g., Data Structures in JS)"
              value={topic}
              onChange={(e)=> setTopic(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={language}
              onChange={(e)=> setLanguage(e.target.value)}
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Punjabi</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
            <button
              disabled={loading}
              className={`rounded-md px-4 py-2 text-sm font-medium text-white ${loading ? 'bg-gray-400' : 'bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-md'} transition`}
            >
              {loading ? 'Generating…' : 'Generate Course'}
            </button>
          </div>
          {error && <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>}
        </form>

        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Your AI Courses ({items.length})</h2>
          {items.length === 0 && (
            <div className="text-sm text-gray-600 bg-white border border-gray-200 rounded-md p-4">No AI courses yet. Generate one above.</div>
          )}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(c => (
              <Link key={c._id} to={`/ai-courses/${c._id}`} className="group bg-white rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-6xl">🤖</div>
                <div className="p-4">
                  <div className="flex items-center gap-2 text-xs mb-2">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">AI</span>
                    <span className="text-gray-500">{c.language}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-1">{c.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{c.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}