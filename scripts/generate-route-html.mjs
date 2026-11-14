import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Build-time static HTML generator for Ahrefs SEO & search engine crawlers.
 * Generates dist/<path>/index.html for every canonical URL in public/sitemap.xml.
 * Rewrites <title>, meta description, canonical, OG/Twitter tags, hreflang, and schema per route.
 */

const SITEMAP_PATH = path.resolve('public/sitemap.xml');
const REDIRECTS_PATH = path.resolve('public/_redirects');
const DIST_INDEX_PATH = path.resolve('dist/index.html');
const DIST_DIR = path.resolve('dist');
const ROUTE_META_JSON = path.resolve('scripts/route-metadata.json');

if (!fs.existsSync(DIST_INDEX_PATH)) {
  console.error('Error: dist/index.html does not exist. Run "vite build" first.');
  process.exit(1);
}

// 1. Read built template shell
const templateHtml = fs.readFileSync(DIST_INDEX_PATH, 'utf8');

// 2. Read public/sitemap.xml and extract all <loc> entries
const sitemapXml = fs.readFileSync(SITEMAP_PATH, 'utf8');
const locMatches = Array.from(sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
console.log(`[generate-route-html] Found ${locMatches.length} <loc> entries in public/sitemap.xml`);

// 3. Read public/_redirects to detect redirect sources that must NEVER have static HTML generated
const redirectsContent = fs.existsSync(REDIRECTS_PATH) ? fs.readFileSync(REDIRECTS_PATH, 'utf8') : '';
const redirectSources = new Map(); // source -> target

for (const line of redirectsContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const parts = trimmed.split(/\s+/);
  if (parts.length >= 3) {
    const [source, target, status] = parts;
    if (['301', '302', '307', '308'].includes(status)) {
      if (source !== '/*' && !source.startsWith('/*')) {
        const cleanSource = source.replace(/\*$/, '');
        redirectSources.set(cleanSource, target);
      }
    }
  }
}

// 4. Resolve metadata for all URLs via tsx execution of scripts/resolve-route-metadata.ts
console.log('[generate-route-html] Resolving metadata for all sitemap routes...');
execSync('tsx scripts/resolve-route-metadata.ts', { stdio: 'inherit' });
const metadataByPath = JSON.parse(fs.readFileSync(ROUTE_META_JSON, 'utf8'));
if (fs.existsSync(ROUTE_META_JSON)) {
  fs.unlinkSync(ROUTE_META_JSON);
}

// 5. Define Hreflang alternates for Homepage and Regional Homepages ONLY (Fix 4)
const HREFLANG_HOMEPAGES = new Set(['/', '/ca/', '/uk/', '/au/', '/de/', '/it/', '/ru/', '/zh/']);

const HREFLANG_TAGS = [
  '    <link rel="alternate" hreflang="en" href="https://www.weightlosspercentage.com/" />',
  '    <link rel="alternate" hreflang="en-ca" href="https://www.weightlosspercentage.com/ca/" />',
  '    <link rel="alternate" hreflang="en-gb" href="https://www.weightlosspercentage.com/uk/" />',
  '    <link rel="alternate" hreflang="en-au" href="https://www.weightlosspercentage.com/au/" />',
  '    <link rel="alternate" hreflang="ru" href="https://www.weightlosspercentage.com/ru/" />',
  '    <link rel="alternate" hreflang="zh" href="https://www.weightlosspercentage.com/zh/" />',
  '    <link rel="alternate" hreflang="de" href="https://www.weightlosspercentage.com/de/" />',
  '    <link rel="alternate" hreflang="it" href="https://www.weightlosspercentage.com/it/" />',
  '    <link rel="alternate" hreflang="x-default" href="https://www.weightlosspercentage.com/" />'
].join('\n');

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let generatedCount = 0;
const skippedRedirects = [];

for (const loc of locMatches) {
  const urlObj = new URL(loc);
  const routePath = urlObj.pathname;

  // Check if routePath is a redirect source in public/_redirects
  if (redirectSources.has(routePath) || redirectSources.has(routePath.replace(/\/$/, ''))) {
    const target = redirectSources.get(routePath) || redirectSources.get(routePath.replace(/\/$/, ''));
    skippedRedirects.push({ routePath, reason: `Redirect source 301 to ${target}` });
    continue;
  }

  const meta = metadataByPath[routePath] || {};
  const isRootHome = routePath === '/';
  const isHreflangHome = HREFLANG_HOMEPAGES.has(routePath);

  // Title: For homepage '/', preserve the exact hardcoded title in index.html (Google SERP rewrite constraint)
  // For other routes: use customMetaTitle or fallbackTitle
  let pageTitle = 'Weight Loss Percentage Calculator (lbs, kg & Newborn Formula)';
  if (!isRootHome) {
    pageTitle = meta.customMetaTitle || meta.fallbackTitle || 'Weight Loss Percentage Calculator';
  }

  // Description: Fix 5 sets explicit homepage meta description; other routes use route metadata
  let pageDesc = isRootHome
    ? 'Free weight loss percentage calculators for adults, newborns and babies — plus BMR, TDEE, BMI and calorie tools. Private in your browser, with a free PDF report.'
    : meta.customMetaDescription || meta.fallbackDescription || 'Calculate weight loss percentage instantly.';

  // Fix 2: For every non-homepage route whose locale is not English, append region label when not already present
  const REGION_LABELS = {
    ca: 'Canada',
    uk: 'UK',
    au: 'Australia',
    de: 'Germany',
    it: 'Italy',
    ru: 'Russia',
    zh: 'China'
  };
  if (!isRootHome && meta.locale && meta.locale !== 'en') {
    const regionLabel = REGION_LABELS[meta.locale];
    if (regionLabel) {
      if (!pageTitle.toLowerCase().includes(regionLabel.toLowerCase())) {
        pageTitle = `${pageTitle} | ${regionLabel}`;
      }
      if (!pageDesc.toLowerCase().includes(regionLabel.toLowerCase())) {
        pageDesc = `${pageDesc} | ${regionLabel}`;
      }
    }
  }

  // Canonical full URL
  const canonicalUrl = `https://www.weightlosspercentage.com${routePath}`;

  let routeHtml = templateHtml;

  // A. Replace <html lang="...">
  const htmlLang = meta.htmlLang || 'en';
  routeHtml = routeHtml.replace(/<html\s+lang="[^"]*"/, `<html lang="${htmlLang}"`);

  // B. Replace <title>...</title>
  routeHtml = routeHtml.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(pageTitle)}</title>`);

  // C. Replace <meta name="description" content="..." />
  routeHtml = routeHtml.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(pageDesc)}" />`
  );

  // D. Replace <link rel="canonical" ... />
  routeHtml = routeHtml.replace(
    /<link\s+rel="canonical"[^>]*\/?>/,
    `<link rel="canonical" id="canonical-link" href="${canonicalUrl}" />`
  );

  // E. Replace OpenGraph Tags
  routeHtml = routeHtml.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:title" content="${escapeHtml(pageTitle)}" />`
  );
  routeHtml = routeHtml.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(pageDesc)}" />`
  );
  routeHtml = routeHtml.replace(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );
  const ogType = routePath.startsWith('/blog/') ? 'article' : 'website';
  routeHtml = routeHtml.replace(
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/,
    `<meta property="og:type" content="${ogType}" />`
  );

  // Ensure og:image, og:image:width, og:image:height, og:image:alt are present
  if (!routeHtml.includes('og-image.png')) {
    const ogImgBlock = `    <meta property="og:image" content="https://www.weightlosspercentage.com/og-image.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Weight Loss Percentage Calculator &amp; Clinical Health Tools" />`;
    routeHtml = routeHtml.replace(/<meta\s+property="og:url"[^>]*\/?>/, `$& \n${ogImgBlock}`);
  }

  // F. Replace Twitter Tags
  routeHtml = routeHtml.replace(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:title" content="${escapeHtml(pageTitle)}" />`
  );
  routeHtml = routeHtml.replace(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeHtml(pageDesc)}" />`
  );
  if (!routeHtml.includes('name="twitter:image"')) {
    routeHtml = routeHtml.replace(
      /<meta\s+name="twitter:description"[^>]*\/?>/,
      `$&\n    <meta name="twitter:image" content="https://www.weightlosspercentage.com/og-image.png" />`
    );
  }

  // G. Fix 4: Hreflang alternates: ONLY on homepage and regional homepages; strip on all sub-routes
  // Remove any existing hreflang tags first
  routeHtml = routeHtml.replace(/\s*<link\s+rel="alternate"\s+hreflang="[^"]*"\s+href="[^"]*"\s*\/?>/g, '');

  if (isHreflangHome) {
    // Inject hreflang right after canonical
    routeHtml = routeHtml.replace(
      /<link\s+rel="canonical"[^>]*\/?>/,
      `$&\n${HREFLANG_TAGS}`
    );
  }

  // H. Fix 7: Organization JSON-LD on homepage ONLY; strip from sub-routes
  if (!isRootHome) {
    routeHtml = routeHtml.replace(/\s*<script\s+id="schema-org"[^>]*>[\s\S]*?<\/script>/, '');
  }

  // Target output file
  let destFile;
  if (isRootHome) {
    destFile = path.join(DIST_DIR, 'index.html');
  } else {
    // Strip leading and trailing slashes for directory path
    const relDir = routePath.replace(/^\/+/, '').replace(/\/+$/, '');
    const targetDir = path.join(DIST_DIR, relDir);
    fs.mkdirSync(targetDir, { recursive: true });
    destFile = path.join(targetDir, 'index.html');
  }

  fs.writeFileSync(destFile, routeHtml, 'utf8');
  generatedCount++;
}

console.log(`[generate-route-html] SUCCESS: Generated static pre-rendered HTML for ${generatedCount} / ${locMatches.length} routes in dist/`);
if (skippedRedirects.length > 0) {
  console.log('[generate-route-html] Skipped redirect sources:', skippedRedirects);
}
