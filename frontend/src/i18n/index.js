import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import hi from './locales/hi.json';
import kn from './locales/kn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import mr from './locales/mr.json';
import bn from './locales/bn.json';

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  kn: { translation: kn },
  ta: { translation: ta },
  te: { translation: te },
  mr: { translation: mr },
  bn: { translation: bn },
  ur: { translation: hi },
  gu: { translation: hi },
  or: { translation: hi },
  ml: { translation: hi },
  pa: { translation: hi },
  as: { translation: hi },
  mai: { translation: hi },
  sa: { translation: hi },
  ks: { translation: hi },
  ne: { translation: hi },
  sd: { translation: hi },
  kok: { translation: hi },
  doi: { translation: hi },
  mni: { translation: hi },
  brx: { translation: hi }
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'hi', // Default to Hindi for rural Indian audience
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false
      }
    });
}

export default i18n;
