import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../lib/api'
import Layout from '../components/Layout'
import { FiDownload, FiUser, FiCheckCircle, FiXCircle, FiClock } from 'react-icons/fi'
import { useTranslation } from 'react-i18next'

export default function Submissions() {
  const { id: courseId, assignmentId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { t } = useTranslation()

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true)
      const response = await api.get(`/courses/${courseId}/assignments/${assignmentId}/submissions`)
      setData(response.data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch submissions')
    } finally {
      setLoading(false)
    }
  }, [courseId, assignmentId])

  useEffect(() => {
    fetchSubmissions()
  }, [fetchSubmissions])

  const handleViewFile = async (fileUrl, fileName) => {
    try {
      // First try to open the file directly
      const newWindow = window.open(fileUrl, '_blank')
      
      // If that fails (blocked by CORS/401), try the proxy endpoint
      if (!newWindow) {
        const encodedUrl = btoa(fileUrl) // Base64 encode the URL
        const proxyUrl = `/api/files/proxy/${encodedUrl}`
        window.open(proxyUrl, '_blank')
      }
    } catch (error) {
      console.error('Error opening file:', error)
      // Fallback: try to download the file
      const link = document.createElement('a')
      link.href = fileUrl
      link.download = fileName || 'submission'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getFileIcon = (fileName) => {
    if (!fileName) return <FiDownload className="w-4 h-4" />
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return <span className="text-red-600 font-bold text-xs">PDF</span>
    if (['jpg', 'jpeg', 'png'].includes(ext)) return <span className="text-green-600 font-bold text-xs">IMG</span>
    return <FiDownload className="w-4 h-4" />
  }

  if (loading) return (
    <Layout>
      <div className="text-center py-8 text-gray-600">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
        {t('lectures.loading')}
      </div>
    </Layout>
  )
  
  if (error) return (
    <Layout>
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-center text-sm">
        {error}
      </div>
    </Layout>
  )
  
  if (!data) return (
    <Layout>
      <div className="text-center py-8 text-gray-500 text-sm">{t('submissions.noData')}</div>
    </Layout>
  )

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-6">
          <Link 
            to={`/courses/${courseId}/assignments`}
            className="text-green-600 hover:text-green-700 mb-3 inline-block text-sm"
          >
            {t('submissions.back')}
          </Link>
          <h1 className="text-xl font-bold text-gray-800 mb-1">{data.assignment?.title}</h1>
          <p className="text-gray-600 text-sm">{data.assignment?.description}</p>
          {data.assignment?.dueAt && (
            <p className="text-xs text-gray-500 mt-1">
              Due: {new Date(data.assignment.dueAt).toLocaleString()}
            </p>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiUser className="w-6 h-6 text-blue-600 mr-2" />
              <div>
                <p className="text-lg font-bold text-blue-900">{data.enrolledStudents}</p>
                <p className="text-blue-700 text-xs">{t('submissions.totalStudents')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiCheckCircle className="w-6 h-6 text-green-600 mr-2" />
              <div>
                <p className="text-lg font-bold text-green-900">{data.submittedCount}</p>
                <p className="text-green-700 text-xs">{t('submissions.submitted')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiClock className="w-6 h-6 text-orange-600 mr-2" />
              <div>
                <p className="text-lg font-bold text-orange-900">{data.notSubmittedStudents?.length || 0}</p>
                <p className="text-orange-700 text-xs">{t('submissions.pending')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submissions */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">{t('submissions.submissions')}</h2>
          </div>
          
          {data.submissions?.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {data.submissions.map((submission) => (
                <div key={submission._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold text-xs">
                            {submission.student?.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-800">
                          {submission.student?.name}
                        </h3>
                        <p className="text-xs text-gray-500">{submission.student?.email}</p>
                        <p className="text-xs text-gray-400">
                          Submitted: {new Date(submission.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {submission.fileName && (
                        <div className="flex items-center space-x-1 text-xs text-gray-600">
                          {getFileIcon(submission.fileName)}
                          <span className="max-w-20 truncate">{submission.fileName}</span>
                        </div>
                      )}
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleViewFile(submission.fileUrl, submission.fileName)}
                          className="bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-1 text-xs"
                        >
                          <FiDownload className="w-3 h-3" />
                          <span>{t('submissions.view')}</span>
                        </button>
                        <a
                          href={submission.fileUrl}
                          download={submission.fileName || 'submission'}
                          className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1 text-xs"
                        >
                          <FiDownload className="w-3 h-3" />
                          <span>{t('submissions.download')}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  {submission.grade !== undefined && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-md">
                      <p className="text-xs font-medium text-gray-700">
                        {t('submissions.grade')}: {submission.grade}/100
                      </p>
                      {submission.feedback && (
                        <p className="text-xs text-gray-600 mt-1">
                          {t('submissions.feedback')}: {submission.feedback}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 text-sm">
              {t('submissions.noSubmissionsYet')}
            </div>
          )}
        </div>

        {/* Students who haven't submitted */}
        {data.notSubmittedStudents?.length > 0 && (
          <div className="mt-6 bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FiXCircle className="w-4 h-4 text-orange-500 mr-2" />
                {t('submissions.notSubmittedHeader')} ({data.notSubmittedStudents.length})
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {data.notSubmittedStudents.map((student) => (
                  <div key={student._id} className="flex items-center space-x-2 p-2 bg-orange-50 rounded-md">
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-xs">
                        {student.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-xs">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}