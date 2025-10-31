import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { fetchAssignments, submitAssignment } from '../features/assignments/assignmentSlice'
import Layout from '../components/Layout'
import { useTranslation } from 'react-i18next'

export default function Assignments() {
  const { id } = useParams() // course id
  const dispatch = useDispatch()
  const { byCourseId, loading, error } = useSelector((s)=> s.assignments)
  const { user } = useSelector((s)=> s.auth)
  const assignments = byCourseId[id] || []
  const [selectedFile, setSelectedFile] = useState(null)
  const [submittingId, setSubmittingId] = useState(null)
  const { t } = useTranslation()

  useEffect(()=>{ dispatch(fetchAssignments(id)) }, [dispatch, id])

  const handleSubmit = async (assignmentId) => {
    if (!selectedFile) return alert('Select a file')
    setSubmittingId(assignmentId)
    const res = await dispatch(submitAssignment({ courseId: id, assignmentId, file: selectedFile }))
    if (res.meta.requestStatus === 'fulfilled') {
      alert('Submitted!')
      setSelectedFile(null)
    }
    setSubmittingId(null)
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">{t('assignments.title')}</h2>
          <p className="text-gray-600 text-sm">{t('assignments.subtitle')}</p>
        </div>
      
        {loading && (
          <div className="text-center py-8 text-gray-600">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
            {t('assignments.loading')}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {assignments.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 text-sm">
            {t('assignments.noAssignments')}
          </div>
        )}

        <ul className="space-y-3">
          {assignments.map(a => (
            <li key={a._id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
              <div className="mb-3">
                <h3 className="font-semibold text-gray-800 text-lg">{a.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{a.description}</p>
                {a.dueAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Due: {new Date(a.dueAt).toLocaleString()}
                  </p>
                )}
              </div>
              
              {user?.role === 'student' && (
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('assignments.upload')}
                    </label>
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e)=>setSelectedFile(e.target.files[0])} 
                      className="block w-full text-sm text-gray-600
                        file:mr-3 file:py-2 file:px-3 file:rounded-md
                        file:border-0 file:text-sm file:font-medium
                        file:bg-green-50 file:text-green-700
                        hover:file:bg-green-100 transition-colors" 
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('assignments.fileHelp')}
                    </p>
                  </div>
                  <button 
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={()=>handleSubmit(a._id)}
                    disabled={submittingId === a._id || !selectedFile}
                    >
                      {submittingId === a._id ? (
                        <>
                          <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></span>
                          {t('assignments.submitting')}
                        </>
                      ) : (
                        t('assignments.submit')
                      )}
                    </button>
                </div>
              )}
              
              {user?.role === 'instructor' && (
                <Link 
                  className="inline-flex items-center text-green-600 hover:text-green-800 font-medium text-sm transition-colors mt-2" 
                  to={`/courses/${id}/assignments/${a._id}/submissions`}
                >
                  {t('assignments.viewSubmissions')}
                  <span className="ml-1">→</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}