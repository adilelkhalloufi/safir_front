import { useState } from 'react';
 
type ColorTheme = {
  [key: string]: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
};
const themes : ColorTheme = {
  indigo: {
    primary: '#4F46E5',
    secondary: '#9333EA',
    accent: '#F59E0B',
    background: '#F3F4F6',
    text: '#111827',
  },
  purple: {
    primary: '#9333EA',
    secondary: '#4F46E5',
    accent: '#F59E0B',
    background: '#F3F4F6',
    text: '#111827',
  },
  amber: {
    primary: '#F59E0B',
    secondary: '#4F46E5',
    accent: '#9333EA',
    background: '#F3F4F6',
    text: '#111827',
  },
  light: {
    primary: '#4F46E5',
    secondary: '#9333EA',
    accent: '#F59E0B',
    background: '#FFFFFF',
    text: '#111827',
  },
  dark: {
    primary: '#4F46E5',
    secondary: '#9333EA',
    accent: '#F59E0B',
    background: '#111827',
    text: '#FFFFFF',
  }
};

const ThemeSwitcherColor = () => {
  const [theme, setTheme] = useState(themes.indigo);

  const handleThemeChange = (newTheme : any) => {
    setTheme(themes[newTheme]);
    // createTheme(themes[newTheme]);  
  };

  return (
    <div style={{ backgroundColor: theme.background, color: theme.text, minHeight: '100vh', padding: '20px' }}>
      <h1>Theme Switcher</h1>
      <div>
        <button onClick={() => handleThemeChange('indigo')} style={{ backgroundColor: theme.primary, color: theme.text }}>
          Indigo Theme
        </button>
        <button onClick={() => handleThemeChange('purple')} style={{ backgroundColor: theme.secondary, color: theme.text }}>
          Purple Theme
        </button>
        <button onClick={() => handleThemeChange('amber')} style={{ backgroundColor: theme.accent, color: theme.text }}>
          Amber Theme
        </button>
        <button onClick={() => handleThemeChange('light')} style={{ backgroundColor: theme.background, color: theme.text }}>
          Light Theme
        </button>
        <button onClick={() => handleThemeChange('dark')} style={{ backgroundColor: theme.primary, color: theme.text }}>
          Dark Theme
        </button>
      </div>
      <p>Click a button above to change the theme!</p>
    </div>
  );
};

export default ThemeSwitcherColor;
