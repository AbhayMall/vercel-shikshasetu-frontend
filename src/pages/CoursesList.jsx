import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchCourses } from '../features/courses/courseSlice'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'

export default function CoursesList() {
  const dispatch = useDispatch()
  const { items, loading, error } = useSelector((s) => s.courses)
  const { token, user } = useSelector((s) => s.auth)
  const { t } = useTranslation()
  const [aiItems, setAiItems] = useState([])

useEffect(() => { 
    dispatch(fetchCourses()) 
  }, [dispatch])

  useEffect(() => {
    async function loadAI() {
      try {
        const { data } = await api.get('/ai/courses/my')
        // tag items as AI for rendering
        setAiItems((data.courses || []).map(c => ({ ...c, _ai: true })))
      } catch {
        // ignore
      }
    }
    if (token && user?.role === 'student') loadAI()
  }, [token, user])

  // Optional: Uncomment if you want to require login to view courses
  // useEffect(() => {
  //   if (!token) {
  //     navigate('/login')
  //   }
  // }, [token, navigate])

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-2 rounded-full mb-6">
              <span className="text-blue-600 font-semibold text-sm">{t('courses.exploreBadge')}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              {t('courses.discoverYourNext')}
              <br />
              {t('courses.learningAdventure')}
            </h1>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              {t('courses.heroSubtitle')}
            </p>
            {!token && (
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/signup" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-200 text-lg"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  {t('courses.startLearningToday')}
                </Link>
                <Link 
                  to="/login" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-800 rounded-xl font-bold border-2 border-gray-200 hover:border-blue-600 hover:shadow-xl transition-all duration-200 text-lg"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  {t('courses.signIn')}
                </Link>
              </div>
            )}
          </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-lg text-gray-600">{t('courses.loading')}</p>
          </div>
        )}
        
        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

          {!loading && items.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl shadow-2xl max-w-3xl mx-auto border-2 border-gray-100">
              <div className="text-9xl mb-8 animate-bounce">📚</div>
              <h3 className="text-3xl font-bold mb-4 text-gray-900">{t('courses.noCourses')}</h3>
              <p className="text-gray-600 text-xl mb-8 max-w-md mx-auto">
                {t('courses.noCoursesSub')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  {t('courses.backToHome')}
                </Link>
                {!token && (
                  <Link 
                    to="/signup" 
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-800 rounded-xl font-bold border-2 border-gray-200 hover:border-blue-600 hover:shadow-xl transition-all duration-200"
                  >
                    {t('courses.getNotified')}
                  </Link>
                )}
              </div>
            </div>
          )}

{/* Courses Grid */}
          {!loading && (items.length > 0 || aiItems.length > 0) && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('courses.availableCourses')} <span className="text-blue-600">({items.length + aiItems.length})</span>
                </h2>
                {/* Optional: Add filter/sort buttons here */}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...aiItems, ...items].map(c => (
                  <Link
                    key={c._id}
                    to={c._ai ? `/ai-courses/${c._id}` : `/courses/${c._id}`}
                    className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.03] overflow-hidden border-2 border-transparent hover:border-blue-500"
                  >
                    <div className="relative h-56 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
<div className="absolute top-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full">
                        <span className="text-xs font-bold text-gray-700">{c._ai ? 'AI' : 'NEW'}</span>
                      </div>
                      <div className="text-white text-8xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">📖</div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                        {c.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-5 line-clamp-3 leading-relaxed">
                        {c.description}
                      </p>
                      <div className="flex items-center justify-between text-sm mb-5">
                        <div className="flex items-center gap-2 text-gray-500">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-sm">
                            <span className="text-lg">👨‍🏫</span>
                          </div>
                          <div>
<p className="text-xs text-gray-400">{t('courses.instructor')}</p>
                            <p className="line-clamp-1 font-semibold text-gray-700">{c._ai ? 'AI Tutor' : (c.instructor?.name || 'Unknown')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-2 rounded-xl">
                          <span className="text-lg">👥</span>
                          <div>
                            <p className="text-xs text-gray-400">{t('courses.students')}</p>
                            <p className="font-bold text-gray-700">{c.students?.length || 0}</p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <span className="inline-flex items-center gap-2 text-blue-600 font-bold group-hover:text-purple-600 transition-colors text-base">
                          {t('courses.exploreCourse')}
                          <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
      </div>
    </div>
  )
}
