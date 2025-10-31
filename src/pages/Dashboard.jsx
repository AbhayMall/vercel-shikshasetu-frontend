import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { fetchCourses } from '../features/courses/courseSlice'
import { fetchStatistics } from '../features/admin/adminSlice'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function Dashboard() {
  const { user, token } = useSelector((s) => s.auth)
  const { items: courses } = useSelector((s) => s.courses)
  const { statistics } = useSelector((s) => s.admin)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (token && user) {
      dispatch(fetchCourses())
      if (user.role === 'admin') {
        dispatch(fetchStatistics())
      }
    }
  }, [dispatch, token, user])

  if (!token || !user) {
    navigate('/login')
    return null
  }

  const myCourses = user.role === 'instructor' 
    ? courses.filter(c => c.instructor?._id === user.id)
    : courses.filter(c => c.students?.includes(user.id))

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center shadow">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-gray-800">
                  {t('common.brand')}
                </span>
              </Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50 text-sm">
                {t('nav.dashboard')}
              </Link>
              <Link to="/courses" className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50 text-sm">
                {t('nav.courses')}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin/users" className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50 text-sm">
                  {t('nav.adminPanel')}
                </Link>
              )}
              <div className="ml-1">
                <LanguageSwitcher />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </div>
              <button 
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-md transition-all" 
                onClick={() => {
                  dispatch(logout())
                  navigate('/')
                }}
              >
                {t('nav.logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1 text-gray-800">
              Welcome back, {user.name}! 👋
            </h1>
            <p className="text-gray-600 text-sm">Here's your learning overview</p>
          </div>

          {/* Admin Dashboard */}
          {user.role === 'admin' && statistics && (
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-3 text-gray-800">Platform Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-lg">
                  <div className="text-xl font-bold mb-1">{statistics.totalUsers}</div>
                  <div className="text-green-100 text-xs">Total Users</div>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg">
                  <div className="text-xl font-bold mb-1">{statistics.totalCourses}</div>
                  <div className="text-blue-100 text-xs">Courses</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-lg">
                  <div className="text-xl font-bold mb-1">{statistics.totalLectures}</div>
                  <div className="text-purple-100 text-xs">Lectures</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg">
                  <div className="text-xl font-bold mb-1">{statistics.totalAssignments}</div>
                  <div className="text-orange-100 text-xs">Assignments</div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-lg">
                  <div className="text-xl font-bold mb-1">{statistics.totalSubmissions}</div>
                  <div className="text-red-100 text-xs">Submissions</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/admin/users" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Manage Users</h3>
                      <p className="text-gray-600 text-xs">View and manage all platform users</p>
                    </div>
                  </div>
                </Link>
                <Link to="/courses" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm">Manage Courses</h3>
                      <p className="text-gray-600 text-xs">Oversee all courses and content</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Instructor Dashboard */}
          {user.role === 'instructor' && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-gray-800">My Courses</h2>
                <Link to="/courses/create" className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md hover:shadow-md transition-all text-sm">
                  + Create Course
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {myCourses.length === 0 ? (
                  <div className="col-span-3 bg-white p-8 rounded-lg border border-gray-200 text-center">
                    <div className="text-4xl mb-3">📚</div>
                    <h3 className="font-semibold mb-2 text-sm">No courses yet</h3>
                    <p className="text-gray-600 text-xs mb-4">Create your first course to get started</p>
                    <Link to="/courses/create" className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md hover:shadow-md transition-all text-sm">
                      Create Course
                    </Link>
                  </div>
                ) : (
                  myCourses.map(course => (
                    <Link key={course._id} to={`/courses/${course._id}`} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-sm transition-all">
                      <h3 className="font-semibold mb-2 text-sm">{course.title}</h3>
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>👥 {course.students?.length || 0} students</span>
                        <span className="text-green-600 font-medium">Manage →</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Student Dashboard */}
          {user.role === 'student' && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-gray-800">My Enrolled Courses</h2>
                <Link to="/courses" className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md hover:shadow-md transition-all text-sm">
                  Browse Courses
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {myCourses.length === 0 ? (
                  <div className="col-span-3 bg-white p-8 rounded-lg border border-gray-200 text-center">
                    <div className="text-4xl mb-3">🎓</div>
                    <h3 className="font-semibold mb-2 text-sm">No enrolled courses</h3>
                    <p className="text-gray-600 text-xs mb-4">Start learning by enrolling in a course</p>
                    <Link to="/courses" className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md hover:shadow-md transition-all text-sm">
                      Browse Courses
                    </Link>
                  </div>
                ) : (
                  myCourses.map(course => (
                    <Link key={course._id} to={`/courses/${course._id}`} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-sm transition-all">
                      <h3 className="font-semibold mb-2 text-sm">{course.title}</h3>
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">By {course.instructor?.name}</span>
                        <span className="text-green-600 font-medium">Continue →</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-3 text-gray-800">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Link to="/courses" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-sm transition-all text-center">
                <div className="text-2xl mb-1">📚</div>
                <div className="font-medium text-xs">All Courses</div>
              </Link>
              {user.role !== 'admin' && (
                <Link to="/courses" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-sm transition-all text-center">
                  <div className="text-2xl mb-1">💬</div>
                  <div className="font-medium text-xs">Messages</div>
                </Link>
              )}
              <Link to="/profile" className="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-500 hover:shadow-sm transition-all text-center">
                <div className="text-2xl mb-1">👤</div>
                <div className="font-medium text-xs">Profile</div>
              </Link>
              <div className="bg-white p-4 rounded-lg border border-gray-200 hover:border-orange-500 hover:shadow-sm transition-all text-center cursor-pointer">
                <div className="text-2xl mb-1">⚙️</div>
                <div className="font-medium text-xs">Settings</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Brand Section */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-lg font-bold">ShikshaSetu</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering learners with quality online education. Join our growing learning community.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-200 mb-3 text-sm">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/courses" className="hover:text-green-400 transition-colors">Browse Courses</Link></li>
                <li><Link to="/dashboard" className="hover:text-green-400 transition-colors">Dashboard</Link></li>
                {user.role === 'instructor' && (
                  <li><Link to="/courses/create" className="hover:text-green-400 transition-colors">Create Course</Link></li>
                )}
                {user.role === 'admin' && (
                  <li><Link to="/admin/users" className="hover:text-green-400 transition-colors">Admin Panel</Link></li>
                )}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-gray-200 mb-3 text-sm">Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Community Forum</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-gray-200 mb-3 text-sm">Connect With Us</h3>
              <ul className="space-y-2 text-gray-400 text-sm mb-3">
                <li className="flex items-center gap-2">
                  <span>📧</span>
                  <span>support@shikshasetu.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📱</span>
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
              <div className="flex gap-2">
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-700 hover:bg-green-500 rounded flex items-center justify-center transition-colors"
                  title="Twitter"
                >
                  <span className="text-sm">𝕏</span>
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-700 hover:bg-blue-600 rounded flex items-center justify-center transition-colors"
                  title="LinkedIn"
                >
                  <span className="text-sm">in</span>
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-700 hover:bg-blue-500 rounded flex items-center justify-center transition-colors"
                  title="Facebook"
                >
                  <span className="text-sm">f</span>
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} ShikshaSetu. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-green-400 transition-colors text-xs">Privacy</a>
              <a href="#" className="hover:text-green-400 transition-colors text-xs">Terms</a>
              <a href="#" className="hover:text-green-400 transition-colors text-xs">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}