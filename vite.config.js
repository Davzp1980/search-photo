import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  return {
    define: {
      [command === 'serve' ? 'global' : '_global']: {},
    },
    base: '/search-photo/',
  };
});
