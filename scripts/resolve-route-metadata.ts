import fs from 'fs';
import path from 'path';
import { resolveSearchIntentFromPath } from '../src/utils/seoIntentRouter';
import { LOCALE_TRANSLATIONS } from '../src/data/localeStrings';

const SITEMAP_PATH = path.resolve('public/sitemap.xml');
const xml = fs.readFileSync(SITEMAP_PATH, 'utf8');
const locs = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);

const results: Record<string, any> = {};

for (const loc of locs) {
  const routePath = new URL(loc).pathname;
  const res = resolveSearchIntentFromPath(routePath);
  const t = LOCALE_TRANSLATIONS[res.locale] || LOCALE_TRANSLATIONS.en;

  results[routePath] = {
    locale: res.locale,
    htmlLang: t.htmlLang || (res.locale === 'en' ? 'en' : res.locale),
    canonicalPath: res.canonicalPath,
    customMetaTitle: res.customMetaTitle || null,
    fallbackTitle: t.metaTitle,
    customMetaDescription: res.customMetaDescription || null,
    fallbackDescription: t.metaDescription,
    customHeroTitle: res.customHeroTitle || t.heroTitle || null
  };
}

// Write to a temporary JSON file or stdout
const outJson = path.resolve('scripts/route-metadata.json');
fs.writeFileSync(outJson, JSON.stringify(results, null, 2), 'utf8');
console.log(`[resolve-route-metadata] Dumped metadata for ${Object.keys(results).length} routes to ${outJson}`);
