import { createContext, useContext, useState } from 'react';
import translations from '../context/translations';

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('bn'); // default বাংলা

    /**
     * t('dashboard')         → translations.dashboard[lang]
     * t('common')            → translations.common[lang]
     * t('birthCert')         → translations.birthCert[lang]
     * ইত্যাদি — translations.js-এ যত section আছে সব কাজ করবে
     */
    const t = (section) => translations[section]?.[lang] ?? {};

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

/* ─── Hook ─── */
export const useLanguage = () => {
    const ctx = useContext(LanguageContext);
    if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
    return ctx;
};

/* ─── LangSwitcher — Header-এ রাখুন ─── */
export const LangSwitcher = () => {
    const { lang, setLang } = useLanguage();
    return (
        <div style={{
            display: 'inline-flex',
            border: '1.5px solid #d1d5db',
            borderRadius: 8,
            overflow: 'hidden',
            fontSize: 13,
            fontWeight: 600,
        }}>
            {[
                { code: 'bn', label: 'বাংলা' },
                { code: 'en', label: 'EN' },
            ].map(({ code, label }) => (
                <button
                    key={code}
                    onClick={() => setLang(code)}
                    style={{
                        padding: '6px 14px',
                        border: 'none',
                        cursor: 'pointer',
                        background: lang === code ? '#166534' : 'white',
                        color: lang === code ? 'white' : '#374151',
                        transition: 'all 0.15s ease',
                    }}
                >
                    {label}
                </button>
            ))}
        </div>
    );
};

export default LanguageContext;
