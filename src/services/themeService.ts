export type ThemeMode = 'dark';

export const themeService = {
  getTheme(): ThemeMode {
    return 'dark';
  },

  setTheme(_theme: ThemeMode): void {
    this.applyTheme();
  },

  applyTheme(): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    }
  },

  init(): void {
    this.applyTheme();
  }
};
