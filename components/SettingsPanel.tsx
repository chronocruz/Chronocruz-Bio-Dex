import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { THEMES } from '../constants/themes';
import { FontSizePreset, LayoutDensity } from '../types/settings';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm dex-screen-text">{label}</p>
        <p className="text-[10px]" style={{ color: 'var(--dex-screen-text-secondary)' }}>{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className="relative w-12 h-6 rounded-full transition-colors border-2"
        style={{
          backgroundColor: checked ? 'var(--dex-accent)' : '#44403c',
          borderColor: checked ? 'var(--dex-accent)' : '#57534e',
        }}
      >
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-0.5'
        }`} />
      </button>
    </div>
  );
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, resetSettings } = useSettings();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="absolute inset-0 z-40 bg-black/50"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`absolute top-0 right-0 z-40 h-full w-80 max-w-full
          border-l-4 overflow-y-auto no-scrollbar font-tech
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{
          backgroundColor: 'var(--dex-screen)',
          borderColor: 'var(--dex-primary-dark)',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 border-b-2 border-stone-700 p-4 flex justify-between items-center"
          style={{ backgroundColor: 'var(--dex-screen)' }}
        >
          <h2 className="text-lg font-pixel tracking-widest dex-highlight-text">SETTINGS // CONFIG</h2>
          <button
            onClick={onClose}
            className="font-pixel hover:text-white transition-colors"
            style={{ color: 'var(--dex-primary)' }}
          >
            [X]
          </button>
        </div>

        <div className="p-4 space-y-6">

          {/* Color Theme */}
          <section>
            <h3 className="text-sm uppercase mb-3 border-b border-stone-700 pb-1" style={{ color: 'var(--dex-screen-text-secondary)' }}>
              Color Theme
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(THEMES).map(theme => (
                <button
                  key={theme.id}
                  onClick={() => updateSettings({ colorTheme: theme.id })}
                  className={`flex items-center gap-2 p-2 rounded border-2 transition-all ${
                    settings.colorTheme === theme.id
                      ? 'border-dex-cyan bg-stone-800'
                      : 'border-stone-700 bg-stone-800/50 hover:border-stone-500'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-stone-600 shrink-0"
                    style={{ background: theme.primary }}
                  />
                  <span className="text-xs truncate" style={{ color: 'var(--dex-screen-text)' }}>{theme.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Font Size */}
          <section>
            <h3 className="text-sm uppercase mb-3 border-b border-stone-700 pb-1" style={{ color: 'var(--dex-screen-text-secondary)' }}>
              Font Size
            </h3>
            <div className="flex gap-2">
              {(['small', 'medium', 'large'] as FontSizePreset[]).map(size => (
                <button
                  key={size}
                  onClick={() => updateSettings({ fontSize: size })}
                  className="flex-1 py-2 text-xs uppercase rounded border-b-4 active:border-b-0 active:translate-y-1 transition-all"
                  style={{
                    backgroundColor: settings.fontSize === size ? 'var(--dex-accent)' : '#44403c',
                    borderColor: settings.fontSize === size ? 'var(--dex-accent)' : '#292524',
                    color: settings.fontSize === size ? '#fff' : '#a8a29e',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </section>

          {/* Layout Density */}
          <section>
            <h3 className="text-sm uppercase mb-3 border-b border-stone-700 pb-1" style={{ color: 'var(--dex-screen-text-secondary)' }}>
              Layout Density
            </h3>
            <div className="flex gap-2">
              {(['compact', 'normal', 'comfortable'] as LayoutDensity[]).map(density => (
                <button
                  key={density}
                  onClick={() => updateSettings({ layoutDensity: density })}
                  className="flex-1 py-2 text-[10px] uppercase rounded border-b-4 active:border-b-0 active:translate-y-1 transition-all"
                  style={{
                    backgroundColor: settings.layoutDensity === density ? 'var(--dex-accent)' : '#44403c',
                    borderColor: settings.layoutDensity === density ? 'var(--dex-accent)' : '#292524',
                    color: settings.layoutDensity === density ? '#fff' : '#a8a29e',
                  }}
                >
                  {density}
                </button>
              ))}
            </div>
          </section>

          {/* Effects */}
          <section>
            <h3 className="text-sm uppercase mb-3 border-b border-stone-700 pb-1" style={{ color: 'var(--dex-screen-text-secondary)' }}>
              Effects
            </h3>
            <ToggleRow
              label="CRT Animations"
              description="Scanlines, flicker, pulse effects"
              checked={settings.animationsEnabled}
              onChange={(v) => updateSettings({ animationsEnabled: v })}
            />
          </section>

          {/* Display */}
          <section>
            <h3 className="text-sm uppercase mb-3 border-b border-stone-700 pb-1" style={{ color: 'var(--dex-screen-text-secondary)' }}>
              Display
            </h3>
            <div className="space-y-3">
              <ToggleRow
                label="Status Bar"
                description="Bottom status bar with battery"
                checked={settings.showStatusBar}
                onChange={(v) => updateSettings({ showStatusBar: v })}
              />
              <ToggleRow
                label="Corner Decorations"
                description="Corner brackets on animal cards"
                checked={settings.showCornerDecorations}
                onChange={(v) => updateSettings({ showCornerDecorations: v })}
              />
            </div>
          </section>

          {/* Reset */}
          <button
            onClick={resetSettings}
            className="w-full py-2 border-2 font-pixel text-sm uppercase hover:text-white transition-colors rounded"
            style={{
              backgroundColor: 'transparent',
              borderColor: 'var(--dex-primary)',
              color: 'var(--dex-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--dex-primary)';
              e.currentTarget.style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--dex-primary)';
            }}
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;
