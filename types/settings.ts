export type ColorThemeId = 'classic-red' | 'ocean-blue' | 'forest-green' | 'midnight-dark' | 'solar-gold' | 'cyber-purple';

export interface ColorTheme {
  id: ColorThemeId;
  name: string;
  primary: string;
  primaryDark: string;
  accent: string;
  accentLight: string;
  screen: string;
  screenText: string;
  screenTextSecondary: string;
  cyan: string;
  yellow: string;
  uiSurface: string;
}

export type FontSizePreset = 'small' | 'medium' | 'large';
export type LayoutDensity = 'compact' | 'normal' | 'comfortable';

export interface AppSettings {
  colorTheme: ColorThemeId;
  fontSize: FontSizePreset;
  layoutDensity: LayoutDensity;
  animationsEnabled: boolean;
  showStatusBar: boolean;
  showCornerDecorations: boolean;
  scale: number;
}

export interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;
  currentTheme: ColorTheme;
}
