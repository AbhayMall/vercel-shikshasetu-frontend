import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', labelKey: 'switcher.english' },
  { code: 'hi', labelKey: 'switcher.hindi' },
  { code: 'pa', labelKey: 'switcher.punjabi' }
]

export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)

  const current = i18n.language?.split('-')[0] || 'en'

  const changeLang = (lng) => {
    i18n.changeLanguage(lng)
    try { localStorage.setItem('i18nextLng', lng) } catch { void 0 }
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        type="button"
        className="inline-flex items-center gap-2 px-3 py-2 text-sm border rounded-md text-gray-700 hover:bg-gray-50"
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="w-4 h-4">🌐</span>
        <span className="capitalize">{t('switcher.label')}: {current.toUpperCase()}</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <ul className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-50" role="listbox">
          {languages.map((lng) => (
            <li key={lng.code}>
              <button
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${current === lng.code ? 'text-green-600 font-medium' : 'text-gray-700'}`}
                onClick={() => changeLang(lng.code)}
                role="option"
                aria-selected={current === lng.code}
              >
                {t(lng.labelKey)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
