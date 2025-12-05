/** Tailwind config bridging CSS variables to utilities */
module.exports = {
  theme: {
    extend: {
      colors: {
        'home-surface': 'var(--home-surface-base)',
        'home-panel': 'var(--home-surface-panel)',
        'home-text': 'var(--home-text-primary)',
        'home-text-muted': 'var(--home-text-muted)',
        'home-text-inverse': 'var(--home-text-inverse)',
      },
      spacing: {
        section: 'var(--section-v-spacing)',
        gutter: 'var(--gutter)',
      },
      borderRadius: {
        home: 'var(--radius-card)',
        'home-hard': 'var(--radius-hard)',
      },
    },
  },
};
