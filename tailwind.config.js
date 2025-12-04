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
        'home-border': 'var(--home-border-strong)',
      },
      spacing: {
        section: 'var(--section-v-spacing)',
        gutter: 'var(--gutter)',
      },
      borderRadius: {
        home: 'var(--home-card-radius)',
        'home-hard': 'var(--home-radius-hard)',
      },
      boxShadow: {
        'home-strong': 'var(--home-card-shadow)',
      },
    },
  },
};
