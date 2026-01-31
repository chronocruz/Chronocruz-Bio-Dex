import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { AppSettings, SettingsContextValue, ColorTheme, FontSizePreset, LayoutDensity } from '../types/settings';
import { THEMES, DEFAULT_THEME_ID } from '../constants/themes';

const STORAGE_KEY = 'biodex-settings';

const DEFAULT_SETTINGS: AppSettings = {
  colorTheme: DEFAULT_THEME_ID,
  fontSize: 'medium',
  layoutDensity: 'normal',
  animationsEnabled: true,
  showStatusBar: true,
  showCornerDecorations: true,
  scale: 1,
};

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // ignore corrupted storage
  }
  return { ...DEFAULT_SETTINGS };
}

function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // storage full or unavailable
  }
}

function applyThemeToDOM(theme: ColorTheme): void {
  const root = document.documentElement;
  root.style.setProperty('--dex-primary', theme.primary);
  root.style.setProperty('--dex-primary-dark', theme.primaryDark);
  root.style.setProperty('--dex-accent', theme.accent);
  root.style.setProperty('--dex-accent-light', theme.accentLight);
  root.style.setProperty('--dex-screen', theme.screen);
  root.style.setProperty('--dex-screen-text', theme.screenText);
  root.style.setProperty('--dex-screen-text-secondary', theme.screenTextSecondary);
  root.style.setProperty('--dex-cyan', theme.cyan);
  root.style.setProperty('--dex-yellow', theme.yellow);
  root.style.setProperty('--dex-ui-surface', theme.uiSurface);
}

function applyFontSizeToDOM(fontSize: FontSizePreset): void {
  const root = document.documentElement;
  const sizeMap: Record<FontSizePreset, string> = { small: '14px', medium: '16px', large: '18px' };
  const scaleMap: Record<FontSizePreset, string> = { small: '0.875', medium: '1', large: '1.125' };
  root.style.setProperty('--dex-font-base', sizeMap[fontSize]);
  root.style.setProperty('--dex-font-scale', scaleMap[fontSize]);
}

function applyDensityToDOM(density: LayoutDensity): void {
  const root = document.documentElement;
  const gapMap: Record<LayoutDensity, string> = { compact: '0.5rem', normal: '1rem', comfortable: '1.5rem' };
  const paddingMap: Record<LayoutDensity, string> = { compact: '0.5rem', normal: '1rem', comfortable: '1.5rem' };
  const cardHeightMap: Record<LayoutDensity, string> = { compact: '8rem', normal: '10rem', comfortable: '13rem' };
  root.style.setProperty('--dex-grid-gap', gapMap[density]);
  root.style.setProperty('--dex-card-padding', paddingMap[density]);
  root.style.setProperty('--dex-card-height', cardHeightMap[density]);
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(loadSettings);

  const currentTheme = useMemo(
    () => THEMES[settings.colorTheme] || THEMES[DEFAULT_THEME_ID],
    [settings.colorTheme]
  );

  useEffect(() => {
    applyThemeToDOM(currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    applyFontSizeToDOM(settings.fontSize);
  }, [settings.fontSize]);

  useEffect(() => {
    applyDensityToDOM(settings.layoutDensity);
  }, [settings.layoutDensity]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    document.body.classList.toggle('animations-disabled', !settings.animationsEnabled);
  }, [settings.animationsEnabled]);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
  }, []);

  const value: SettingsContextValue = useMemo(() => ({
    settings,
    updateSettings,
    resetSettings,
    currentTheme,
  }), [settings, updateSettings, resetSettings, currentTheme]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
