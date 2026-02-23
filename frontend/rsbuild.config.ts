import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginSass(),
  ],
  source: {
    alias: {
      '@': './src',
    },
  },
  html: {
    title: 'PitchStarter',
    tags: [
      {
        tag: 'link',
        attrs: { href: 'https://fonts.googleapis.com', rel: 'preconnect' },
      },
      {
        tag: 'link',
        attrs: {
          href: 'https://fonts.gstatic.com',
          rel: 'preconnect',
          crossorigin: true,
        },
      },
      {
        tag: 'link',
        attrs: {
          href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
          rel: 'stylesheet',
        }
      },
    ],
  },
});
