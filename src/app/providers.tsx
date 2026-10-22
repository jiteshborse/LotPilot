import React, { createContext, useContext, useState } from 'react';
import { PersistenceManager, UserPreferences } from '../lib/persistence/storage';

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() =>
    PersistenceManager.getPreferences()
  );

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    const updated = PersistenceManager.savePreferences(prefs);
    setPreferences(updated);
  };

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
};

export const useAppPreferences = (): PreferencesContextType => {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('useAppPreferences must be used within AppProviders');
  }
  return ctx;
};
