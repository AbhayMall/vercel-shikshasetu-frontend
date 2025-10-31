import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { enrollInCourse, fetchCourse } from '../features/courses/courseSlice'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function CourseDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { current, loading, error } = useSelector((s) => s.courses)
  const { user, token } = useSelector((s)=> s.auth)
  const { t } = useTranslation()

  useEffect(() => { dispatch(fetchCourse(id)) }, [dispatch, id])

  const enroll = async () => {
    if (!token) return navigate('/login')
    const res = await dispatch(enrollInCourse(id))
    if (res.meta.requestStatus === 'fulfilled') {
      alert('Enrolled!')
    }
  }

  const isEnrolled = current?.students?.includes(user?.id);
  const canManage = user && (user.role === 'admin' || current?.instructor?._id === user.id);

  return (
    <div className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-3"></div>
            <p className="text-gray-600 text-sm">{t('courseDetail.loading')}</p>
          </div>
        )}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}
        {current && (
          <div>
            {/* Course Header */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 md:p-8 text-white mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  <div className="inline-block bg-white bg-opacity-20 px-3 py-1 rounded-md text-xs font-medium mb-3">
                    {t('courseDetail.courseDetails')}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-3">{current.title}</h1>
                  <p className="text-green-100 text-sm mb-4">{current.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-md">
                      <div className="w-6 h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-xs">
                        👨‍🏫
                      </div>
                      <span>{current.instructor?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white bg-opacity-20 px-3 py-1 rounded-md">
                      <div className="w-6 h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center text-xs">
                        👥
                      </div>
                      <span>{current.students?.length || 0} {t('courseDetail.students')}</span>
                    </div>
                  </div>
                </div>
                {canManage && (
                  <Link
                    to={`/courses/${id}/manage`}
                    className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all flex items-center gap-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {t('courseDetail.manageCourse')}
                  </Link>
                )}
              </div>
              
              {!isEnrolled && user?.role === 'student' && (
                <button
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:shadow-md transition-all flex items-center gap-2 text-sm"
                  onClick={enroll}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {t('courseDetail.enroll')}
                </button>
              )}
              {!token && (
                <Link
                  to="/login"
                  className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:shadow-md transition-all inline-flex items-center gap-2 text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {t('courseDetail.loginToEnroll')}
                </Link>
              )}
              {isEnrolled && (
                <div className="bg-green-500 bg-opacity-20 border border-green-300 px-4 py-2 rounded-lg inline-flex items-center gap-2 font-medium text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {t('courseDetail.enrolled')}
                </div>
              )}
            </div>

            {/* Course Content Navigation */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{t('courseDetail.content')}</h2>
              <p className="text-gray-600 text-sm">{t('courseDetail.accessAll')}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to={`/courses/${id}/lectures`}
                className="group bg-white p-6 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-green-600 transition-colors">{t('courseDetail.lectures')}</h3>
                  <p className="text-gray-600 text-xs mb-3">{t('courseDetail.watchLectures')}</p>
                  <span className="text-green-600 font-medium text-sm group-hover:text-green-700 transition-colors flex items-center gap-1">
                    {t('courseDetail.startLearning')}
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>

              <Link
                to={`/courses/${id}/assignments`}
                className="group bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">{t('courseDetail.assignments')}</h3>
                  <p className="text-gray-600 text-xs mb-3">{t('courseDetail.completeAssignments')}</p>
                  <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors flex items-center gap-1">
                    {t('courseDetail.viewTasks')}
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>

              <Link
                to={`/courses/${id}/chat`}
                className="group bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-500 hover:shadow-md transition-all"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors">{t('courseDetail.chat')}</h3>
                  <p className="text-gray-600 text-xs mb-3">{t('courseDetail.discuss')}</p>
                  <span className="text-purple-600 font-medium text-sm group-hover:text-purple-700 transition-colors flex items-center gap-1">
                    {t('courseDetail.joinDiscussion')}
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}