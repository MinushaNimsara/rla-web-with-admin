import { createContext, useContext, useState, useEffect } from 'react';
import { getHomeSettings } from '../services/firestore';

const defaultSettings = {
  logoUrl: '',
  factoryVideoUrl: '',
  footerBrandName: '',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  contactWeb: '',
  contactPageHeading: '',
  contactPageDescription: '',
  contactPageBgUrl: '',
  socialFacebook: '',
  socialInstagram: '',
  socialLinkedIn: '',
};

const SiteSettingsContext = createContext(defaultSettings);

export function SiteSettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);

  const refreshSettings = () => {
    getHomeSettings()
      .then(setSettings)
      .catch(() => {});
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ ...settings, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
