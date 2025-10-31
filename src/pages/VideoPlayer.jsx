import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Layout from '../components/Layout'
import { api } from '../lib/api'
import { useTranslation } from 'react-i18next'

export default function VideoPlayer() {
  const { id, lectureId } = useParams()
  const { byCourseId } = useSelector((s)=> s.lectures)
  const lecture = useMemo(()=> (byCourseId[id] || []).find(l=> l._id === lectureId), [byCourseId, id, lectureId])
  const [downloading, setDownloading] = useState(false)
  const { t } = useTranslation()

  if (!lecture) return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center py-8 text-gray-500 text-sm">
          {t('video.notFound')}
        </div>
      </div>
    </Layout>
  )

  async function handleDownload() {
    try {
      setDownloading(true)
      const { data } = await api.get(`/courses/${id}/lectures/${lectureId}/download`, { responseType: 'blob' })
      const blob = new Blob([data], { type: 'video/mp4' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      const safeTitle = (lecture.title || 'lecture').replace(/[<>:"/\\|?*]+/g, ' ').trim()
      a.download = `${safeTitle || 'lecture'}.mp4`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed', err)
      alert('Failed to download video')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-1">{lecture.title}</h2>
            {lecture.description && (
              <p className="text-gray-600 text-sm">{lecture.description}</p>
            )}
          </div>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className={`shrink-0 inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-white ${downloading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} transition-colors`}
          >
            {downloading ? t('video.preparing') : t('video.downloadCompressed')}
          </button>
        </div>
        <div className="bg-black rounded-lg overflow-hidden">
          <video 
            src={lecture.videoUrl} 
            controls 
            className="w-full aspect-video" 
          />
        </div>
      </div>
    </Layout>
  )
}
