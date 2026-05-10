export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'hsl(var(--bg-primary) / <alpha-value>)',
          secondary: 'hsl(var(--bg-secondary) / <alpha-value>)',
          elevated: 'hsl(var(--bg-elevated) / <alpha-value>)',
        },
        border: {
          subtle: 'hsl(var(--border-subtle) / <alpha-value>)',
          DEFAULT: 'hsl(var(--border-default) / <alpha-value>)',
        },
        text: {
          primary: 'hsl(var(--text-primary) / <alpha-value>)',
          secondary: 'hsl(var(--text-secondary) / <alpha-value>)',
          tertiary: 'hsl(var(--text-tertiary) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          fg: 'hsl(var(--accent-fg) / <alpha-value>)',
        },
      },
      borderRadius: {
        'sm': '8px',
        'DEFAULT': '12px',
        'md': '14px',
        'lg': '18px',
        'xl': '22px',
        '2xl': '28px',
        '3xl': '36px',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
