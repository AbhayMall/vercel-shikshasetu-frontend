import { Link, Route, Routes, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './features/auth/authSlice';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GoogleAuthSuccess from './pages/GoogleAuthSuccess';
import Dashboard from './pages/Dashboard';
import CoursesList from './pages/CoursesList';
import CourseDetail from './pages/CourseDetail';
import Lectures from './pages/Lectures';
import VideoPlayer from './pages/VideoPlayer';
import Assignments from './pages/Assignments';
import Submissions from './pages/Submissions';
import Chat from './pages/Chat';
import AdminUsers from './pages/AdminUsers';
import CreateCourse from './pages/CreateCourse';
import ManageCourse from './pages/ManageCourse';
import Profile from './pages/Profile';
import AICourses from './pages/AICourses';
import AICourseDetail from './pages/AICourseDetail';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';

// Icons
import { FiBook, FiHome, FiUser, FiLogIn, FiUserPlus, FiVideo, FiMessageSquare, FiSettings } from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';

// Navigation Component
const Navigation = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-800">{t('common.brand')}</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                to="/"
                className="text-green-600 hover:text-green-700 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50 text-sm inline-flex items-center"
              >
                <FiHome className="mr-1" /> {t('nav.home')}
              </Link>
              <Link
                to="/courses"
                className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50 text-sm inline-flex items-center"
              >
                <FiBook className="mr-1" /> {t('nav.courses')}
              </Link>
{token && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50 text-sm inline-flex items-center"
                  >
                    <FiSettings className="mr-1" /> {t('nav.dashboard')}
                  </Link>
                  {/* AI Courses visible for students */}
                  {user?.role === 'student' && (
                    <Link
                      to="/ai-courses"
                      className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50 text-sm inline-flex items-center"
                    >
                      <FaGraduationCap className="mr-1" /> AI Courses
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center gap-3">
            <LanguageSwitcher />
            {token ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-800">{user?.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                </div>
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-md transition-all"
                >
                  {t('nav.logout')}
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-md hover:bg-green-50 text-sm"
                >
                  <FiLogIn className="inline mr-1" /> {t('nav.login')}
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md font-medium hover:shadow-md transition-all text-sm"
                >
                  <FiUserPlus className="inline mr-1" /> {t('nav.getStarted')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Main Layout Component
const MainLayout = ({ children }) => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Brand Section */}
            <div className="col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-lg font-bold">{t('common.brand')}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">
                {t('home.heroSubtitle')}
              </p>
              <div className="flex gap-2">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-700 hover:bg-green-500 rounded flex items-center justify-center transition-colors">
                  <span className="text-sm">𝕏</span>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-700 hover:bg-blue-500 rounded flex items-center justify-center transition-colors">
                  <span className="text-sm">f</span>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-gray-700 hover:bg-blue-600 rounded flex items-center justify-center transition-colors">
                  <span className="text-sm">in</span>
                </a>
              </div>
            </div>

            {/* Platform */}
            <div>
              <h3 className="font-bold text-gray-200 mb-3 text-sm">{t('footer.platform')}</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/courses" className="hover:text-green-400 transition-colors">{t('footer.browseCourses')}</Link></li>
                <li><Link to="/signup" className="hover:text-green-400 transition-colors">{t('footer.becomeStudent')}</Link></li>
                <li><Link to="/signup" className="hover:text-green-400 transition-colors">{t('footer.teachOn')}</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-bold text-gray-200 mb-3 text-sm">{t('footer.resources')}</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.helpCenter')}</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.documentation')}</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.community')}</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-bold text-gray-200 mb-3 text-sm">{t('footer.company')}</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.aboutUs')}</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.contact')}</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">{t('footer.careers')}</a></li>
              </ul>
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
  );
};

// Home Component
const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t('home.heroTitle1')}
            <br />
            <span className="text-green-600">{t('home.heroTitle2')}</span>
          </h1>
          <p className="text-gray-600 text-sm mb-6 max-w-2xl mx-auto">
            {t('home.heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/courses"
              className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-md font-medium hover:shadow-md transition-all text-sm"
            >
              {t('home.exploreCourses')}
            </Link>
            <Link
              to="/signup"
              className="bg-white text-gray-700 px-6 py-3 rounded-md font-medium border border-gray-300 hover:border-green-500 hover:shadow-sm transition-all text-sm"
            >
              {t('home.getStartedFree')}
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
          {t('home.whyChoose')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-sm transition-all">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
              <FiVideo className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">{t('home.richTitle')}</h3>
            <p className="text-gray-600 text-sm">{t('home.richDesc')}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-sm transition-all">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">{t('home.collabTitle')}</h3>
            <p className="text-gray-600 text-sm">{t('home.collabDesc')}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-sm transition-all">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2 text-gray-800">{t('home.trackTitle')}</h3>
            <p className="text-gray-600 text-sm">{t('home.trackDesc')}</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-8 text-white max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">{t('home.joinCommunity')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
              <div className="text-green-100 text-sm">{t('home.activeStudents')}</div>
              <p className="text-green-200 text-xs mt-1">{t('home.learningEveryDay')}</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100 text-sm">{t('home.expertInstructors')}</div>
              <p className="text-blue-200 text-xs mt-1">{t('home.industryProfessionals')}</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">200+</div>
              <div className="text-purple-100 text-sm">{t('home.qualityCourses')}</div>
              <p className="text-purple-200 text-xs mt-1">{t('home.acrossCategories')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Wrapper component for protected routes with layout
const ProtectedLayout = ({ children, roles }) => (
  <ProtectedRoute roles={roles}>
    <MainLayout>{children}</MainLayout>
  </ProtectedRoute>
);

// Main App Component
export default function App() {
  const { t } = useTranslation();
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
      <Route path="/courses" element={<MainLayout><CoursesList /></MainLayout>} />
      <Route path="/courses/:id" element={<MainLayout><CourseDetail /></MainLayout>} />

      {/* Protected Routes */}
      <Route element={<ProtectedLayout roles={['student', 'instructor', 'admin']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/courses/:id/lectures" element={<Lectures />} />
        <Route path="/courses/:id/lectures/:lectureId" element={<VideoPlayer />} />
        <Route path="/courses/:id/assignments" element={<Assignments />} />
        <Route path="/courses/:id/assignments/:assignmentId/submissions" element={<Submissions />} />
        <Route path="/courses/:id/chat" element={<Chat />} />
      </Route>

      {/* Student-only AI routes */}
      <Route element={<ProtectedLayout roles={['student']} />}>
        <Route path="/ai-courses" element={<AICourses />} />
        <Route path="/ai-courses/:id" element={<AICourseDetail />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedLayout roles={['admin']} />}>
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>

      {/* Instructor/Admin Routes */}
      <Route element={<ProtectedLayout roles={['instructor', 'admin']} />}>
        <Route path="/courses/create" element={<CreateCourse />} />
        <Route path="/courses/:id/manage" element={<ManageCourse />} />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={
        <MainLayout>
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-3">404</h1>
              <p className="text-gray-600 text-sm mb-6">Oops! Page not found</p>
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-md font-medium hover:shadow-md transition-all text-sm"
              >
                {t('home.goBackHome')}
              </Link>
            </div>
          </div>
        </MainLayout>
      } />
    </Routes>
  );
}
