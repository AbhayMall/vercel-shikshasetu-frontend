import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, Link } from 'react-router-dom'
import { fetchLectures } from '../features/lectures/lectureSlice'
import Layout from '../components/Layout'
import { api } from '../lib/api'
import { useTranslation } from 'react-i18next'

export default function Lectures() {
  const { id } = useParams() // course id
  const dispatch = useDispatch()
  const { byCourseId, loading, error } = useSelector((s)=> s.lectures)
  const lectures = byCourseId[id] || []
  const [downloadingId, setDownloadingId] = useState(null)
  const { t } = useTranslation()

  useEffect(()=>{ dispatch(fetchLectures(id)) }, [dispatch, id])

  async function handleDownload(lectureId, title) {
    try {
      setDownloadingId(lectureId)
      const { data } = await api.get(`/courses/${id}/lectures/${lectureId}/download`, { responseType: 'blob' })
      const blob = new Blob([data], { type: 'video/mp4' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeTitle = (title || 'lecture').replace(/[<>:"/\\|?*]+/g, ' ').trim()
      a.download = `${safeTitle || 'lecture'}.mp4`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed', err)
      alert('Failed to download video')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-1 text-gray-800">{t('lectures.title')}</h2>
          <p className="text-gray-600 text-sm">{t('lectures.subtitle')}</p>
        </div>
        
        {loading && (
          <div className="text-center py-8 text-gray-600">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
            {t('lectures.loading')}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {lectures.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500 text-sm">
            {t('lectures.noLectures')}
          </div>
        )}

        <ul className="space-y-3">
          {lectures.map(l => (
            <li key={l._id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">{l.title}</h3>
                  <p className="text-gray-600 text-xs">{l.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={()=> handleDownload(l._id, l.title)}
                    disabled={downloadingId === l._id}
                    className={`px-3 py-2 rounded-md text-sm font-medium text-white ${downloadingId === l._id ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
                  >
                    {downloadingId === l._id ? t('lectures.preparing') : t('lectures.download')}
                  </button>
                  <Link 
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md hover:shadow-md transition-all text-sm font-medium" 
                    to={`/courses/${id}/lectures/${l._id}`}
                  >
                    {t('lectures.play')}
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  )
}
