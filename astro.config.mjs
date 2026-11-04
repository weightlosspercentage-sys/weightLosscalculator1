import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.weightlosspercentage.com',
  integrations: [
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          ca: 'en-CA',
          uk: 'en-GB',
          ru: 'ru-RU',
          zh: 'zh-CN',
          de: 'de-DE',
          it: 'it-IT',
        },
      },
    }),
  ],
});
