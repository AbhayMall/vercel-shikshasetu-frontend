import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signup } from '../features/auth/authSlice'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { useTranslation } from 'react-i18next'

export default function Signup() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loading, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [oauthError, setOauthError] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      const errorMessages = {
        google_auth_failed: 'Google authentication failed. Please try again.',
        authentication_failed: 'Authentication failed. Please try again.',
        invalid_token: 'Invalid authentication token. Please try again.',
        no_token: 'No authentication token received. Please try again.'
      }
      setOauthError(errorMessages[errorParam] || 'An error occurred during authentication.')
    }
  }, [searchParams])

  const onSubmit = async (e) => {
    e.preventDefault()
    setOauthError(null)
    if (!acceptTerms) {
      alert('Please accept the terms and conditions')
      return
    }
    const res = await dispatch(signup(form))
    if (res.meta.requestStatus === 'fulfilled') navigate('/dashboard')
  }

  const handleGoogleSignup = () => {
    setOauthError(null)
    // Redirect to Google OAuth
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
    window.location.href = `${apiUrl}/auth/google`
  }

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' }
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']
    return { strength, label: labels[strength], color: colors[strength] }
  }

  const passwordStrength = getPasswordStrength(form.password)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-2xl font-bold text-gray-800">
                {t('common.brand')}
              </span>
            </Link>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{t('auth.createAccount')}</h2>
            <p className="text-gray-600 text-sm">{t('auth.joinCommunity')}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* OAuth Error Message */}
            {oauthError && (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-md text-sm flex items-start gap-2">
                <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{oauthError}</span>
              </div>
            )}

            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 px-4 py-2 rounded-md font-medium text-gray-700 hover:border-gray-400 hover:shadow-sm transition-all text-sm"
            >
              <FcGoogle className="text-xl" />
              <span>{t('auth.continueWithGoogle')}</span>
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-500 font-medium text-xs">{t('auth.orSignUpEmail')}</span>
              </div>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.fullName')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="text-gray-400 text-sm" />
                  </div>
                  <input 
                    className="w-full border border-gray-300 pl-9 pr-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm" 
                    placeholder={t('auth.namePlaceholder')} 
                    value={form.name} 
                    onChange={(e)=>setForm({...form, name:e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.emailAddress')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400 text-sm" />
                  </div>
                  <input 
                    className="w-full border border-gray-300 pl-9 pr-4 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm" 
                    placeholder={t('auth.emailAddress')} 
                    type="email" 
                    value={form.email} 
                    onChange={(e)=>setForm({...form, email:e.target.value})}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400 text-sm" />
                  </div>
                  <input 
                    className="w-full border border-gray-300 pl-9 pr-10 py-2 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm" 
                    placeholder={t('auth.passwordPlaceholder')} 
                    type={showPassword ? "text" : "password"}
                    value={form.password} 
                    onChange={(e)=>setForm({...form, password:e.target.value})}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                        />
                      </div>
                    <span className="text-xs font-medium text-gray-600">{passwordStrength.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">Use 8+ characters with a mix of letters, numbers & symbols</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.iAmA')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({...form, role: 'student'})}
                    className={`px-3 py-2 rounded-md border transition relative text-sm ${
                      form.role === 'student' 
                        ? 'border-green-600 bg-green-50 text-green-700 font-medium' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {form.role === 'student' && (
                      <div className="absolute top-1 right-1">
                        <FiCheck className="text-green-600 text-xs" />
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-lg mb-1">🎓</div>
                      <div>{t('auth.student')}</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({...form, role: 'instructor'})}
                    className={`px-3 py-2 rounded-md border transition relative text-sm ${
                      form.role === 'instructor' 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-medium' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {form.role === 'instructor' && (
                      <div className="absolute top-1 right-1">
                        <FiCheck className="text-blue-600 text-xs" />
                      </div>
                    )}
                    <div className="text-center">
                      <div className="text-lg mb-1">👨‍🏫</div>
                      <div>{t('auth.instructor')}</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-4">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-2 text-sm">
                  <label htmlFor="terms" className="text-gray-700 text-xs">
                    {t('auth.acceptTerms')} {' '}
                    <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                      {t('auth.termsOfService')}
                    </a>{' '}
                    {t('auth.and')} {' '}
                    <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                      {t('auth.privacyPolicy')}
                    </a>
                  </label>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button 
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-md font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm" 
                disabled={loading || !acceptTerms}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                    {t('auth.creatingAccount')}
                  </span>
                ) : t('auth.createAccount')}
              </button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                {t('auth.alreadyHaveAccount')}{' '}
                <Link className="text-green-600 hover:text-green-700 font-medium transition" to="/login">
                  {t('auth.signInCta')}
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-gray-600 hover:text-green-600 transition text-xs">
              {t('auth.backToHome')}
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs">© {new Date().getFullYear()} {t('common.brand')}. {t('footer.rights')}</p>
        </div>
      </footer>
    </div>
  )
}
