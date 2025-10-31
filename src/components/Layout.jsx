import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'

export default function Layout({ children }) {
  const { user, token } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { t } = useTranslation()

  // If not logged in, show minimal layout
  if (!token || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Simple Navigation for non-logged in users */}
        <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center shadow">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-gray-800">
                  {t('common.brand')}
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <Link to="/" className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50 text-sm">
                  {t('nav.home')}
                </Link>
                <Link to="/courses" className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50 text-sm">
                  {t('nav.courses')}
                </Link>
                <div className="mx-1">
                  <LanguageSwitcher />
                </div>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50 text-sm"
                >
                  {t('nav.login')}
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md font-medium hover:shadow-md transition-all duration-200 text-sm"
                >
                  {t('nav.signup')}
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <div className="flex-1">
          {children}
        </div>
        {/* Simple Footer */}
        <footer className="bg-gray-800 text-white mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} ShikshaSetu. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-6">
              <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
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
              <Link to="/profile" className="text-right hover:opacity-80 transition-opacity">
                <div className="text-sm font-medium text-gray-800">{user.name}</div>
                <div className="text-xs text-gray-500 capitalize">{user.role}</div>
              </Link>
              <button 
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-md transition-all duration-200" 
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
          {children}
        </div>
      </div>

      {/* Professional Footer */}
      <footer className="bg-gray-800 text-white mt-auto">
        <div className="max-w-full px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Brand Section */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-lg font-bold">{t('common.brand')}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering learners with quality online education. Join our growing learning community today.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-gray-200 mb-3">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/courses" className="hover:text-green-400 transition-colors">{t('footer.browseCourses')}</Link></li>
                <li><Link to="/dashboard" className="hover:text-green-400 transition-colors">Dashboard</Link></li>
                {user.role === 'instructor' && (
                  <li><Link to="/courses/create" className="hover:text-green-400 transition-colors">Create Course</Link></li>
                )}
                {user.role === 'admin' && (
                  <li><Link to="/admin/users" className="hover:text-green-400 transition-colors">{t('nav.adminPanel')}</Link></li>
                )}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-gray-200 mb-3">{t('footer.resources')}</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.helpCenter')}</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.documentation')}</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.community')}</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contact Support</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-gray-200 mb-3">Connect With Us</h3>
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
              © {new Date().getFullYear()} {t('common.brand')}. {t('footer.rights')}
            </p>
            <div className="flex gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-green-400 transition-colors text-xs">{t('footer.privacyPolicy')}</a>
              <a href="#" className="hover:text-green-400 transition-colors text-xs">{t('footer.terms')}</a>
              <a href="#" className="hover:text-green-400 transition-colors text-xs">{t('footer.cookies')}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}