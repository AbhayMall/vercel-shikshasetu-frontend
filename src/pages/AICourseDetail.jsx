import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function AICourseDetail() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      try {
        const { data } = await api.get(`/ai/courses/${id}`)
        setCourse(data.course)
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <div className="min-h-[50vh] flex items-center justify-center text-gray-600">Loading…</div>
  )
  if (error) return (
    <div className="min-h-[50vh] flex items-center justify-center text-red-700">{error}</div>
  )

  const data = course?.content || {}

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/ai-courses" className="text-sm text-blue-600 hover:underline">← Back</Link>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs">AI</span>
            <span className="text-xs text-gray-500">{course.language}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{data.title || course.title}</h1>
          <p className="text-gray-700 mt-2">{data.description || course.description}</p>
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {(data.modules || []).map((m, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
              <h2 className="font-semibold text-gray-800 mb-2">Module {idx+1}: {m.title}</h2>
              <div className="space-y-2">
                {(m.lessons || []).map((l, i) => (
                  <div key={i} className="border-t border-gray-100 pt-2">
                    <h3 className="font-medium text-gray-800">{l.title}</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{l.content}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quizzes */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Quizzes</h2>

          {/* MCQ */}
          {Array.isArray(data.quizzes?.mcq) && data.quizzes.mcq.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Multiple Choice</h3>
              <ol className="list-decimal list-inside space-y-2">
                {data.quizzes.mcq.map((q, i) => (
                  <li key={i}>
                    <div className="font-medium text-gray-800">{q.question}</div>
                    <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                      {(q.options || []).map((op, k) => (
                        <li key={k}>{op}</li>
                      ))}
                    </ul>
                    <div className="text-green-700 text-sm mt-1">Answer: {q.answer}</div>
                    {q.explanation && <div className="text-gray-600 text-xs">{q.explanation}</div>}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* True/False */}
          {Array.isArray(data.quizzes?.true_false) && data.quizzes.true_false.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">True / False</h3>
              <ol className="list-decimal list-inside space-y-2">
                {data.quizzes.true_false.map((q, i) => (
                  <li key={i}>
                    <div className="font-medium text-gray-800">{q.question}</div>
                    <div className="text-green-700 text-sm mt-1">Answer: {String(q.answer)}</div>
                    {q.explanation && <div className="text-gray-600 text-xs">{q.explanation}</div>}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Fill in the blanks */}
          {Array.isArray(data.quizzes?.fill_in_the_blanks) && data.quizzes.fill_in_the_blanks.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Fill in the Blanks</h3>
              <ol className="list-decimal list-inside space-y-2">
                {data.quizzes.fill_in_the_blanks.map((q, i) => (
                  <li key={i}>
                    <div className="font-medium text-gray-800">{q.question}</div>
                    <div className="text-green-700 text-sm mt-1">Answer: {q.answer}</div>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}