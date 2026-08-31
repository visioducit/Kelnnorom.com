/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-elevated': 'var(--surface-elevated)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        gold: 'var(--accent-gold)',
        'gold-soft': 'var(--accent-gold-soft)',
        tech: 'var(--accent-tech)',
        'tech-soft': 'var(--accent-tech-soft)',
        success: 'var(--success)',
        danger: 'var(--danger)',
      },
      borderRadius: {
        DEFAULT: '8px',
        button: '6px',
        media: '14px',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      maxWidth: {
        content: '1440px',
      },
    },
  },
  plugins: [],
};
