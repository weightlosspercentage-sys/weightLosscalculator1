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
    ? 'Calculate your weight loss percentage instantly and see your progress in seconds. Free tool for lbs and kg, with newborn, BMR and more.'
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

  // I. Inject distinct static pre-rendered article body for /blog/fat-loss-vs-weight-loss/ and /blog/weight-tracking-guide/
  if (routePath.endsWith('/blog/fat-loss-vs-weight-loss/')) {
    routeHtml = routeHtml.replace(
      /<h1 class="cp-h1">[^<]*<\/h1>/,
      '<h1 class="cp-h1">Fat Loss vs Weight Loss: Two Different Numbers</h1>'
    );
    const fatLossArticleHtml = `
        <article id="blog-article-fat-loss-vs-weight-loss" style="margin-top: 1.5rem; padding: 1.5rem; background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: 1.25rem;">
          <h2>Fat Loss vs Weight Loss: Why Scale Weight and Body Fat Percentage Are Two Different Numbers</h2>
          <p>Weight loss is a reduction in total body mass measured on a scale, whereas fat loss is a specific reduction in adipose fat tissue relative to lean mass.</p>
          <h3>1. What Scale Weight Includes: Water, Glycogen, Muscle, and Fat</h3>
          <p>Scale weight measures the combined mass of every tissue and fluid inside your body at the moment you step on the platform, including adipose fat tissue, skeletal muscle mass, bone mineral content, body water, stored carbohydrate glycogen, and digestive contents. Because skeletal muscle and liver tissue store carbohydrate glycogen alongside bound water, total scale weight can drop or rise noticeably over a short period purely from carbohydrate and water shifts. Losing scale weight rapidly when starting a calorie deficit reflects glycogen and water release alongside early fat loss, not pure adipose tissue loss.</p>
          <h3>2. What Body Fat Percentage Measures and How a Fat Loss Percentage Calculator Works</h3>
          <p>Body fat percentage is the proportion of your total body weight that consists of adipose fat mass, calculated as (Fat Mass divided by Total Body Weight) multiplied by 100. A fat loss percentage calculator pairs total weight loss percentage, ((Starting Weight - Current Weight) ÷ Starting Weight) × 100, with fat mass tracking, Fat Mass = Total Weight × (Body Fat % ÷ 100), so you can see how much of your total weight change comes from fat tissue versus lean muscle and water.</p>
          <h3>3. Direct Comparison: Fat Loss vs Weight Loss</h3>
          <p>Weight loss sums fat, muscle, water, and glycogen and moves up or down noticeably from day to day due to hydration, sodium, and meal volume. Fat loss measures subcutaneous and visceral adipose tissue reduction and changes gradually over time in proportion to your sustained calorie deficit.</p>
          <h3>4. How to Track Both Numbers: Scale Weight, Waist Measurement, and Body Fat</h3>
          <p>Pair weekly scale weight averages with waist circumference at the navel, circumference or caliper body fat estimates on a consistent schedule under identical morning conditions, and resistance training strength performance to confirm lean muscle retention.</p>
          <h3>5. When Each Number Matters Most and How to Keep Loss Mostly Fat</h3>
          <p>Total weight loss percentage is the primary clinical benchmark in medical studies because a 5% to 10% reduction in total body weight reliably supports healthier blood pressure, blood glucose, and joint load. Body fat percentage matters most when strength training, approaching a healthy weight range, or preserving resting metabolic rate through a moderate daily calorie deficit and adequate dietary protein.</p>
        </article>`;
    routeHtml = routeHtml.replace(
      /(<\/div>\s*<\/div>\s*<\/div>\s*<noscript>)/,
      `</div>${fatLossArticleHtml}\n      </div>\n    </div>\n\n    <noscript>`
    );
  } else if (routePath.endsWith('/blog/weight-tracking-guide/')) {
    routeHtml = routeHtml.replace(
      /<h1 class="cp-h1">[^<]*<\/h1>/,
      '<h1 class="cp-h1">Weight Tracking Guide: How to Weigh Yourself and Read the Trend</h1>'
    );
    const weightTrackingArticleHtml = `
        <article id="blog-article-weight-tracking-guide" style="margin-top: 1.5rem; padding: 1.5rem; background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: 1.25rem;">
          <h2>Weight Tracking Guide: How to Weigh Yourself Correctly and Read the Weekly Trend</h2>
          <p>Accurate weight tracking requires weighing yourself under identical morning conditions, logging the daily reading, and comparing 7-day weekly averages rather than single-day numbers.</p>
          <h3>1. Standardized Morning Weigh-In Protocol: Same Time, Same Conditions</h3>
          <p>Weigh first thing after waking and using the restroom before eating or drinking, wear minimal or identical clothing so clothing never adds artificial variance, place your digital scale on a hard and level floor, stand centered and still until the display locks, and record the reading immediately as one data point in your 7-day weekly average.</p>
          <h3>2. Why You Must Read the 7-Day Weekly Average, Not a Single Day</h3>
          <p>A single morning weigh-in can be masked by overnight water retention from sodium or carbohydrates even during a consistent daily calorie deficit. To calculate your 7-day weekly average, use the formula Sum of 7 Morning Weights / 7: add all seven morning readings from Monday through Sunday, divide by 7, and compare your current 7-day weekly average against the previous week's 7-day weekly average to see your true fat loss trend.</p>
          <h3>3. What Daily Scale Fluctuations Actually Mean</h3>
          <p>Daily weight can move up or down by a noticeable amount from day to day due to fluid balance and digestive volume rather than changes in body fat, including extracellular water retention from sodium intake, muscle glycogen water binding, temporary post-workout muscle repair fluid, and hormonal cycle shifts.</p>
          <h3>4. When to Act and Adjust Your Plan vs When to Stay the Course</h3>
          <p>Stay the course during a short-term flat scale trend while water balance normalizes. If your 7-day weekly average weight and waist measurement remain unchanged across several consecutive weeks, review your food logging accuracy and make a small adjustment to your daily calorie intake or daily walking activity to restart steady progress.</p>
        </article>`;
    routeHtml = routeHtml.replace(
      /(<\/div>\s*<\/div>\s*<\/div>\s*<noscript>)/,
      `</div>${weightTrackingArticleHtml}\n      </div>\n    </div>\n\n    <noscript>`
    );
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
