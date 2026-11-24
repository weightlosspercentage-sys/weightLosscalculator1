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
  const h1Title = isRootHome ? 'Weight Loss Percentage Calculator' : pageTitle;

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

  // I. Replace static H1 with route-specific page title (homepage keeps "Weight Loss Percentage Calculator"; locale routes exclude " | Region" suffix)
  routeHtml = routeHtml.replace(
    /<h1 class="cp-h1">[^<]*<\/h1>/,
    `<h1 class="cp-h1">${escapeHtml(h1Title)}</h1>`
  );

  // J. Inject distinct static pre-rendered content for blog articles and the 6 Koray-rewritten calculator/restaurant pages
  let preRenderedSectionHtml = '';

  if (routePath.endsWith('/blog/fat-loss-vs-weight-loss/')) {
    preRenderedSectionHtml = `
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
  } else if (routePath.endsWith('/blog/weight-tracking-guide/')) {
    preRenderedSectionHtml = `
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
  } else if (isRootHome || routePath.endsWith('/calculators/weight-loss/')) {
    preRenderedSectionHtml = `
        <section id="percentage" style="margin-top: 1.5rem; padding: 1.5rem; background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: 1.25rem;">
          <h2>Weight Loss Percentage Calculator</h2>
          <p>Weight loss percentage is a metric that expresses weight lost as a proportion of starting weight. The formula divides weight lost by starting weight and multiplies by 100. A 200-pound person who loses 15 pounds has lost 7.5 percent. Doctors and clinical researchers use this metric because it normalises progress across body sizes.</p>
          <h3>How the calculation works</h3>
          <p>The formula is one subtraction, one division and one multiplication.</p>
          <p><code>Weight Loss % = ((Starting Weight − Current Weight) ÷ Starting Weight) × 100</code></p>
          <p>The calculator takes two inputs: starting weight and current weight. It returns one number: the percentage. Firstly, it subtracts current weight from starting weight to find total pounds lost. Secondly, it divides that loss by the starting weight. Finally, it multiplies by 100 to express the result as a percentage.</p>
          <p>A worked example makes the arithmetic concrete. Starting weight is 200 lbs and current weight is 185 lbs. Weight lost equals 200 − 185 = 15 lbs. Then (15 ÷ 200) × 100 = 7.5% total weight loss, which crosses the 5% clinical health milestone.</p>
          <h3>Quick reference table</h3>
          <p>The table shows what 5%, 10%, 15% and 20% weight loss equals for common starting weights.</p>
          <table>
            <thead>
              <tr><th>Starting Weight</th><th>5% Weight Loss</th><th>10% Weight Loss</th><th>15% Weight Loss</th><th>20% Weight Loss</th></tr>
            </thead>
            <tbody>
              <tr><td>150 lbs</td><td>7.5 lbs (142.5 lbs)</td><td>15 lbs (135 lbs)</td><td>22.5 lbs (127.5 lbs)</td><td>30 lbs (120 lbs)</td></tr>
              <tr><td>180 lbs</td><td>9 lbs (171 lbs)</td><td>18 lbs (162 lbs)</td><td>27 lbs (153 lbs)</td><td>36 lbs (144 lbs)</td></tr>
              <tr><td>200 lbs</td><td>10 lbs (190 lbs)</td><td>20 lbs (180 lbs)</td><td>30 lbs (170 lbs)</td><td>40 lbs (160 lbs)</td></tr>
              <tr><td>250 lbs</td><td>12.5 lbs (237.5 lbs)</td><td>25 lbs (225 lbs)</td><td>37.5 lbs (212.5 lbs)</td><td>50 lbs (200 lbs)</td></tr>
              <tr><td>300 lbs</td><td>15 lbs (285 lbs)</td><td>30 lbs (270 lbs)</td><td>45 lbs (255 lbs)</td><td>60 lbs (240 lbs)</td></tr>
            </tbody>
          </table>
          <h3>The calculator suite</h3>
          <p>One metric anchors the suite. Each tool below measures a different variable of the same process: energy balance.</p>
          <p>Newborn tracking starts at birth. Parents tracking the first week of life use the <a href="/calculators/newborn-weight-loss/">newborn weight loss calculator</a>, which compares each day's weight against the normal early-loss range of the first week of life. Tracking continues after week one. For weeks two to four, the <a href="/calculators/baby-weight-loss/">baby weight loss percentage calculator</a> continues the same percentage tracking week by week against expected regain patterns.</p>
          <p>Metabolism tools set the calorie context. Before setting a target, the <a href="/calculators/bmr/">BMR calculator</a> estimates the calorie floor the body needs at complete rest. The <a href="/calculators/tdee/">TDEE calculator</a> extends that resting estimate with activity level, giving the full daily budget the deficit works against. The <a href="/calculators/calorie-deficit/">calorie deficit calculator</a> then sizes the gap between intake and budget that produces fat loss.</p>
          <p>Food and composition tools fill in the details. The <a href="/restaurants/subway/">Subway calorie calculator</a> shows how a restaurant meal fits inside the daily budget. The <a href="/calculators/bmi/">BMI calculator</a> classifies body mass against WHO categories. The <a href="/calculators/body-fat-percentage/">body fat percentage calculator</a> estimates composition with the US Navy method. The protein calculator sets daily protein targets that preserve muscle during a deficit. The <a href="/calculators/water-intake/">water intake calculator</a> personalises hydration. The macro calculator splits calories into protein, fat and carbohydrate targets.</p>
          <p>Stage-specific tools cover special cases. The <a href="/calculators/postpartum-weight-loss/">postpartum weight loss calculator</a> plans safe breastfeeding weight loss. The <a href="/calculators/bariatric-surgery-weight-loss/">bariatric surgery calculator</a> tracks excess weight loss percentage after VSG or bypass procedures. The <a href="/calculators/weight-loss/">weight loss calculator</a> projects the timeline to reach a goal weight. The <a href="/calculators/biggest-loser/">Biggest Loser weight loss calculator</a> applies the same percentage formula to the competition format, where ranking depends on percentage rather than pounds.</p>
          <p>Regional versions adapt the same calculator to local guidelines. The <a href="/au/calculators/weight-loss/">Australian weight loss percentage calculator</a> and the <a href="/uk/calculators/weight-loss/">UK weight loss percentage calculator</a> apply the same formula with regional defaults.</p>
          <p>Medication-based weight loss has its own tool. The <a href="/calculators/glp1-weight-loss/">GLP-1 weight loss calculator</a> tracks results for semaglutide, tirzepatide and Mounjaro, including the FDA titration schedule.</p>
          <h3>Percentage versus pounds: which to trust</h3>
          <table>
            <thead>
              <tr><th>Criterion</th><th>Percentage</th><th>Raw pounds</th></tr>
            </thead>
            <tbody>
              <tr><td>Comparability across body sizes</td><td>High. One scale for every frame</td><td>Low. Ten pounds means different things at 150 and 300</td></tr>
              <tr><td>Clinical thresholds</td><td>Built in. The 5% and 10% milestones are percentage-based</td><td>None. Pounds carry no threshold</td></tr>
              <tr><td>Goal setting</td><td>Scales to the individual frame automatically</td><td>Needs manual adjustment per person</td></tr>
              <tr><td>Limitation</td><td>Does not separate fat loss from muscle or water loss</td><td>Same limitation, plus no comparability</td></tr>
            </tbody>
          </table>
          <p>An editorial note on method. Percentage is the better headline metric for almost every purpose. Pounds still matter in the kitchen, where portions are weighed in ounces and grams. Track the percentage for decisions. Track the pounds for cooking. The percentage tells you whether you are succeeding. The scale tells you what to eat.</p>
          <h3>Evidence and references</h3>
          <ul>
            <li>MedlinePlus (NIH): Health topics</li>
            <li>NIH NIDDK: Weight management</li>
            <li><a href="/methodology/">Editorial and Methodology Policy</a>: our accuracy standards</li>
          </ul>
          <h3>Medical disclaimer</h3>
          <p>This tool is for educational and informational purposes only and does not replace professional medical advice. Consult a registered dietitian or healthcare professional before starting restrictive dieting or intensive training.</p>
          <p>Clinical evidence suggests a safe and sustainable rate of fat loss is 1 to 2 pounds per week (0.5% to 1.0% of total body weight). Rapid weight reduction can cause metabolic adaptation, lean muscle loss and nutritional deficiencies.</p>
          <p>BMR, TDEE and calorie deficit models estimate energy expenditure from baseline physiological variables. Actual metabolic rates vary with lean body mass distribution, hormonal health, activity levels and individual adaptation. Adjust caloric targets gradually and prioritise nutrient-dense whole foods.</p>
        </section>`;
  } else if (routePath.endsWith('/blog/how-much-weight-have-i-lost/')) {
    routeHtml = routeHtml.replace(
      /<h1 class="cp-h1">[^<]*<\/h1>/,
      '<h1 class="cp-h1">How Much Weight Have I Lost?</h1>'
    );
    preRenderedSectionHtml = `
        <article id="blog-article-how-much-weight-have-i-lost" style="margin-top: 1.5rem; padding: 1.5rem; background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: 1.25rem;">
          <h2>How Much Weight Have I Lost?</h2>
          <p>How much weight you have lost is one number: the percentage of your starting weight that is gone. Enter your starting weight and current weight in <a href="/">the weight loss percentage calculator</a> to see your total weight loss as both a percentage and a pound or kilogram total.</p>
          <p>When you ask how much weight have I lost, how much weight did I lose, or how much have I lost in weight, two numbers answer the question together. First, total pounds or kilograms lost measures the raw mass removed from the scale. Second, weight loss percentage expresses that loss as a share of your starting body weight. Whether you need a free how much weight have I lost calculator or a how many lbs have I lost calculator, the formula below computes both figures.</p>
          <h3>1. How to Calculate Your Weight Loss Percentage (The Formula)</h3>
          <p>To calculate weight loss percentage, subtract your current weight from your starting weight, divide the difference by your starting weight, and multiply the result by 100. This equation answers how to calculate weight loss percentage, how to calculate percentage of weight loss, and how do you calculate percentage of weight loss across pounds and kilograms.</p>
          <p><code>Weight Loss Percentage = ((Starting Weight − Current Weight) ÷ Starting Weight) × 100</code></p>
          <p><strong>The denominator rule: always divide by starting weight, never current weight.</strong> The most common mistake when people ask how to figure out your percentage of weight loss or how to figure percent of weight loss is dividing by the new, lighter weight. Dividing by current weight inflates the result. Dropping from 200 lb to 180 lb is a 20 lb loss: dividing 20 by the starting weight of 200 gives the true 10.0% loss, whereas dividing 20 by the current weight of 180 gives a false 11.1%.</p>
          <h4>Do It in 30 Seconds: Three-Step Calculation</h4>
          <p>To answer how to figure out percentage of weight loss, how to find percentage of weight loss, or how to measure weight loss percentage on any calculator, follow three steps:</p>
          <ol>
            <li><strong>First, subtract current weight from starting weight</strong> to get total pounds or kilograms lost.</li>
            <li><strong>Second, divide weight lost by starting weight</strong> to get the decimal fraction of starting mass lost.</li>
            <li><strong>Third, multiply by 100</strong> to state the result as a percentage, rounded to one decimal place.</li>
          </ol>
          <h4>Worked Examples in Pounds and Kilograms</h4>
          <p>Whether you search how to calculate percentage weight loss, how do you calculate your weight loss percentage, or how to calculate percent weight loss, the math is identical in pounds (lb) and kilograms (kg):</p>
          <table>
            <thead>
              <tr><th>Example</th><th>Starting Weight</th><th>Current Weight</th><th>Weight Lost</th><th>Calculation</th><th>Percentage Lost</th></tr>
            </thead>
            <tbody>
              <tr><td>Example 1 (Pounds)</td><td>200 lb</td><td>180 lb</td><td>20 lb</td><td>(200 − 180) ÷ 200 × 100</td><td>10.0%</td></tr>
              <tr><td>Example 2 (Kilograms)</td><td>90 kg</td><td>81 kg</td><td>9 kg</td><td>(90 − 81) ÷ 90 × 100</td><td>10.0%</td></tr>
              <tr><td>Example 3 (Decimal Pounds)</td><td>185 lb</td><td>172.5 lb</td><td>12.5 lb</td><td>(185 − 172.5) ÷ 185 × 100</td><td>6.8%</td></tr>
            </tbody>
          </table>
          <p>Going from 200 lb to 180 lb removes 20 lb, and (20 ÷ 200) × 100 = 10%. Going from 90 kg to 81 kg removes 9 kg, and (9 ÷ 90) × 100 = 10%. Going from 185 lb to 172.5 lb removes 12.5 lb, and (12.5 ÷ 185) × 100 = 6.8%. For spreadsheet formulas, see <a href="/blog/how-to-calculate-weight-loss-percentage/">the guide to calculating weight loss percentage</a>.</p>
          <h3>2. What Your Weight Loss Percentage Means (Reference Table)</h3>
          <p>Weight loss percentage normalizes progress across body sizes. Raw pounds hide that context: losing 10 lb at 180 lb is 5.6% of starting weight (10 ÷ 180 × 100 = 5.6%), whereas losing 10 lb at 300 lb is 3.3% (10 ÷ 300 × 100 = 3.3%). Both people lost 10 lb, but the 180 lb person crossed the 5% clinical milestone while the 300 lb person is two-thirds of the way there.</p>
          <table>
            <thead>
              <tr><th>Percentage Lost</th><th>At 180 lb Start</th><th>At 300 lb Start</th><th>What It Means</th></tr>
            </thead>
            <tbody>
              <tr><td>1% to 3%</td><td>1.8 to 5.4 lb</td><td>3 to 9 lb</td><td>Initial downward trend beyond day-to-day water fluctuations.</td></tr>
              <tr><td>5%</td><td>9 lb</td><td>15 lb</td><td>First clinical milestone: blood pressure, blood sugar, and cholesterol improve (Look AHEAD 2011, Diabetes Care; CDC).</td></tr>
              <tr><td>10%</td><td>18 lb</td><td>30 lb</td><td>Larger health gains across glycemic control, triglycerides, and joint load.</td></tr>
              <tr><td>15% to 20%</td><td>27 to 36 lb</td><td>45 to 60 lb</td><td>The total weight loss range that clinical GLP-1 trials report.</td></tr>
            </tbody>
          </table>
          <p>In the Look AHEAD study (<em>Diabetes Care</em>, 2011) and CDC guidance, a 5% loss is the first clinical milestone where blood pressure, blood sugar, and cholesterol improve measurably. Read more on <a href="/blog/5-percent-weight-loss/">what a 5% weight loss means</a> or check your starting weight on <a href="/blog/weight-loss-percentage-chart/">the weight loss percentage chart</a>.</p>
          <h3>3. How Much Weight Can You Lose in a Month? (Safe Pace)</h3>
          <p>A safe monthly weight loss pace for adults is <strong>4 to 8 pounds per month</strong>, matching the CDC guideline of <strong>1 to 2 pounds per week</strong>. Whether you ask how much weight can I lose in a month, how much weight can you lose in a month, or how many pounds can you lose in a month, 4 to 8 pounds is the benchmark that protects lean muscle. Because <strong>1 pound of fat equals approximately 3,500 kcal</strong>, your daily calorie deficit sets your monthly loss:</p>
          <table>
            <thead>
              <tr><th>Daily Deficit</th><th>Weekly Deficit</th><th>Weekly Loss</th><th>Monthly Loss (4 Weeks)</th></tr>
            </thead>
            <tbody>
              <tr><td>500 kcal / day</td><td>3,500 kcal / week</td><td>~1.0 lb / week</td><td>~4 lb / month</td></tr>
              <tr><td>750 kcal / day</td><td>5,250 kcal / week</td><td>~1.5 lb / week</td><td>~6 lb / month</td></tr>
              <tr><td>1,000 kcal / day</td><td>7,000 kcal / week</td><td>~2.0 lb / week</td><td>~8 lb / month</td></tr>
            </tbody>
          </table>
          <p>First, the first month is often higher because glycogen depletion releases bound water, which is why people using a how to lose 15 pounds in a month calculator, a how much weight can you lose in a month calculator, or a how much weight can i lose in a month calculator often see a larger drop in month one that includes water weight. Second, the pace slows as you get lighter because a smaller body burns fewer calories. Third, a bigger starting weight loses more pounds at the same deficit. See <a href="/blog/healthy-weight-loss-per-month/">the healthy monthly pace guide</a> and find your resting baseline with <a href="/calculators/bmr/">the BMR calculator</a>.</p>
          <h3>4. How to Track It Without Fooling Yourself</h3>
          <ol>
            <li><strong>First, weigh at the same time of day:</strong> Step on the scale each morning after using the restroom and before eating or drinking.</li>
            <li><strong>Second, use the weekly average:</strong> Daily scale weight swings 1 to 2 kg with water, salt, and glycogen. Compare 7-day weekly averages rather than single days.</li>
            <li><strong>Third, remember percentage is scale weight, not fat:</strong> The formula cannot tell fat from muscle or water on a single reading.</li>
          </ol>
          <p>Read our protocol on <a href="/blog/weight-tracking-guide/">how to track your weight</a> and our comparison of <a href="/blog/fat-loss-vs-weight-loss/">fat loss vs weight loss</a>. All figures on this page are general information, not medical advice.</p>
          <h3>5. Frequently Asked Questions</h3>
          <h4>How much weight have I lost?</h4>
          <p>To find how much weight you have lost, subtract your current weight from your starting weight to get your total pounds or kilograms lost, divide that number by your starting weight, and multiply by 100 to get your weight loss percentage. You can also enter your starting weight and current weight in the calculator at the top of this page to see both numbers at once.</p>
          <h4>How do you calculate percentage of weight loss?</h4>
          <p>Use the formula (Starting Weight − Current Weight) ÷ Starting Weight × 100. Always divide by your starting weight and never by your current weight. For example, starting at 200 lb and weighing 180 lb today equals 20 lb lost, and (20 ÷ 200) × 100 = 10% weight loss. In kilograms, dropping from 90 kg to 81 kg equals 9 kg lost, and (9 ÷ 90) × 100 = 10%.</p>
          <h4>How much weight can I lose in a month?</h4>
          <p>A safe and sustainable monthly loss for adults is 4 to 8 pounds per month, based on the CDC recommendation of 1 to 2 pounds per week. Your first month can show a larger drop on the scale when stored glycogen and water release, and the pace gradually slows as your body weight gets lighter. This range is general information, not medical advice.</p>
          <h4>How much weight can you lose in a month with a 500-calorie deficit?</h4>
          <p>Because 1 pound of body fat stores approximately 3,500 kcal, a consistent 500-calorie daily deficit creates a 3,500-calorie weekly deficit. That equals about 1 pound of weight loss per week, or roughly 4 pounds lost across a 4-week month.</p>
          <h4>How do I figure out my percentage of weight loss?</h4>
          <p>Follow three steps in order: first, subtract your current weight from your starting weight to find total weight lost; second, divide that difference by your starting weight; third, multiply the decimal by 100. For example, going from 185 lb to 172.5 lb removes 12.5 lb, and (12.5 ÷ 185) × 100 = 6.8%.</p>
          <h4>Is 5% weight loss good?</h4>
          <p>Yes. Losing 5% of your starting body weight is the first clinical milestone recognized by the CDC and the Look AHEAD study (2011, Diabetes Care), where blood pressure, blood sugar, and cholesterol improve measurably.</p>
        </article>`;
  } else if (isRootHome || routePath.endsWith('/calculators/weight-loss/')) {
    preRenderedSectionHtml = `
        <section id="percentage" style="margin-top: 1.5rem; padding: 1.5rem; background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: 1.25rem;">
          <h2>Weight Loss Percentage Calculator</h2>
          <p>Weight loss percentage is a metric that expresses weight lost as a proportion of starting weight. The formula divides weight lost by starting weight and multiplies by 100. A 200-pound person who loses 15 pounds has lost 7.5 percent. Doctors and clinical researchers use this metric because it normalises progress across body sizes.</p>
          <h3>How the calculation works</h3>
          <p>The formula is one subtraction, one division and one multiplication.</p>
          <p><code>Weight Loss % = ((Starting Weight − Current Weight) ÷ Starting Weight) × 100</code></p>
          <p>The calculator takes two inputs: starting weight and current weight. It returns one number: the percentage. Firstly, it subtracts current weight from starting weight to find total pounds lost. Secondly, it divides that loss by the starting weight. Finally, it multiplies by 100 to express the result as a percentage.</p>
          <p>A worked example makes the arithmetic concrete. Starting weight is 200 lbs and current weight is 185 lbs. Weight lost equals 200 − 185 = 15 lbs. Then (15 ÷ 200) × 100 = 7.5% total weight loss, which crosses the 5% clinical health milestone.</p>
          <h3>Quick reference table</h3>
          <p>The table shows what 5%, 10%, 15% and 20% weight loss equals for common starting weights.</p>
          <table>
            <thead>
              <tr><th>Starting Weight</th><th>5% Weight Loss</th><th>10% Weight Loss</th><th>15% Weight Loss</th><th>20% Weight Loss</th></tr>
            </thead>
            <tbody>
              <tr><td>150 lbs</td><td>7.5 lbs (142.5 lbs)</td><td>15 lbs (135 lbs)</td><td>22.5 lbs (127.5 lbs)</td><td>30 lbs (120 lbs)</td></tr>
              <tr><td>180 lbs</td><td>9 lbs (171 lbs)</td><td>18 lbs (162 lbs)</td><td>27 lbs (153 lbs)</td><td>36 lbs (144 lbs)</td></tr>
              <tr><td>200 lbs</td><td>10 lbs (190 lbs)</td><td>20 lbs (180 lbs)</td><td>30 lbs (170 lbs)</td><td>40 lbs (160 lbs)</td></tr>
              <tr><td>250 lbs</td><td>12.5 lbs (237.5 lbs)</td><td>25 lbs (225 lbs)</td><td>37.5 lbs (212.5 lbs)</td><td>50 lbs (200 lbs)</td></tr>
              <tr><td>300 lbs</td><td>15 lbs (285 lbs)</td><td>30 lbs (270 lbs)</td><td>45 lbs (255 lbs)</td><td>60 lbs (240 lbs)</td></tr>
            </tbody>
          </table>
          <h3>The calculator suite</h3>
          <p>One metric anchors the suite. Each tool below measures a different variable of the same process: energy balance.</p>
          <p>Newborn tracking starts at birth. Parents tracking the first week of life use the <a href="/calculators/newborn-weight-loss/">newborn weight loss calculator</a>, which compares each day's weight against the normal early-loss range of the first week of life. Tracking continues after week one. For weeks two to four, the <a href="/calculators/baby-weight-loss/">baby weight loss percentage calculator</a> continues the same percentage tracking week by week against expected regain patterns.</p>
          <p>Metabolism tools set the calorie context. Before setting a target, the <a href="/calculators/bmr/">BMR calculator</a> estimates the calorie floor the body needs at complete rest. The <a href="/calculators/tdee/">TDEE calculator</a> extends that resting estimate with activity level, giving the full daily budget the deficit works against. The <a href="/calculators/calorie-deficit/">calorie deficit calculator</a> then sizes the gap between intake and budget that produces fat loss.</p>
          <p>Food and composition tools fill in the details. The <a href="/restaurants/subway/">Subway calorie calculator</a> shows how a restaurant meal fits inside the daily budget. The <a href="/calculators/bmi/">BMI calculator</a> classifies body mass against WHO categories. The <a href="/calculators/body-fat-percentage/">body fat percentage calculator</a> estimates composition with the US Navy method. The protein calculator sets daily protein targets that preserve muscle during a deficit. The <a href="/calculators/water-intake/">water intake calculator</a> personalises hydration. The macro calculator splits calories into protein, fat and carbohydrate targets.</p>
          <p>Stage-specific tools cover special cases. The <a href="/calculators/postpartum-weight-loss/">postpartum weight loss calculator</a> plans safe breastfeeding weight loss. The <a href="/calculators/bariatric-surgery-weight-loss/">bariatric surgery calculator</a> tracks excess weight loss percentage after VSG or bypass procedures. The <a href="/calculators/weight-loss/">weight loss calculator</a> projects the timeline to reach a goal weight. The <a href="/calculators/biggest-loser/">Biggest Loser weight loss calculator</a> applies the same percentage formula to the competition format, where ranking depends on percentage rather than pounds.</p>
          <h3>Percentage versus pounds: which to trust</h3>
          <table>
            <thead>
              <tr><th>Criterion</th><th>Percentage</th><th>Raw pounds</th></tr>
            </thead>
            <tbody>
              <tr><td>Comparability across body sizes</td><td>High. One scale for every frame</td><td>Low. Ten pounds means different things at 150 and 300</td></tr>
              <tr><td>Clinical thresholds</td><td>Built in. The 5% and 10% milestones are percentage-based</td><td>None. Pounds carry no threshold</td></tr>
              <tr><td>Goal setting</td><td>Scales to the individual frame automatically</td><td>Needs manual adjustment per person</td></tr>
              <tr><td>Limitation</td><td>Does not separate fat loss from muscle or water loss</td><td>Same limitation, plus no comparability</td></tr>
            </tbody>
          </table>
          <p>An editorial note on method. Percentage is the better headline metric for almost every purpose. Pounds still matter in the kitchen, where portions are weighed in ounces and grams. Track the percentage for decisions. Track the pounds for cooking. The percentage tells you whether you are succeeding. The scale tells you what to eat.</p>
          <h3>Evidence and references</h3>
          <ul>
            <li>MedlinePlus (NIH): Health topics</li>
            <li>NIH NIDDK: Weight management</li>
            <li><a href="/methodology/">Editorial and Methodology Policy</a>: our accuracy standards</li>
          </ul>
          <h3>Medical disclaimer</h3>
          <p>This tool is for educational and informational purposes only and does not replace professional medical advice. Consult a registered dietitian or healthcare professional before starting restrictive dieting or intensive training.</p>
          <p>Clinical evidence suggests a safe and sustainable rate of fat loss is 1 to 2 pounds per week (0.5% to 1.0% of total body weight). Rapid weight reduction can cause metabolic adaptation, lean muscle loss and nutritional deficiencies.</p>
          <p>BMR, TDEE and calorie deficit models estimate energy expenditure from baseline physiological variables. Actual metabolic rates vary with lean body mass distribution, hormonal health, activity levels and individual adaptation. Adjust caloric targets gradually and prioritise nutrient-dense whole foods.</p>
        </section>`;
  } else if (routePath.endsWith('/calculators/newborn-weight-loss/') || routePath.endsWith('/calculators/infant-weight-loss/')) {
    preRenderedSectionHtml = `
        <section id="newborn" style="margin-top: 1.5rem; padding: 1.5rem; background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: 1.25rem;">
          <h2>Newborn Weight Loss Calculator</h2>
          <p>A newborn weight loss calculator is a functional tool that measures an infant's weight change as a percentage of birth weight in the first days of life. It accepts two inputs: birth weight and current weight. It returns one value: the percentage lost.</p>
          <p>Reviewed by Dr. Rekha Kumar, M.D., M.S. Verified against AAP and WHO guidelines. Last updated August 2026.</p>
          <h3>Newborn Weight Loss Percentage Formula</h3>
          <p><code>The formula is weight loss percentage = (birth weight − current weight) ÷ birth weight × 100.</code></p>
          <p>The formula has three variables. The input variables are birth weight and current weight. The output variable is weight loss percentage.</p>
          <p>Worked example. Firstly, subtract current weight from birth weight: 3,500g − 3,300g = 200g. Secondly, divide the difference by birth weight: 200 ÷ 3,500 = 0.0571. Finally, multiply by 100 to state the result as a percentage: 5.71%.</p>
          <p>A 5.71% reading sits inside the normal physiological range for a breastfed newborn on day 3.</p>
          <h3>Safe Ranges vs. Warning Signs</h3>
          <table>
            <thead>
              <tr><th>Reading</th><th>Status</th><th>What it means</th><th>What to do</th></tr>
            </thead>
            <tbody>
              <tr><td>Below 7%</td><td>Normal physiological drop</td><td>Expected post-birth fluid excretion</td><td>Continue on-demand nursing or formula feedings 8 to 12 times per 24 hours</td></tr>
              <tr><td>7% to 10%</td><td>Borderline, monitor closely</td><td>Common around the day-3 peak loss</td><td>Assess latch, count wet diapers (minimum 4 to 6 per day), and consider a lactation consultation</td></tr>
              <tr><td>Above 10%</td><td>Clinical action required</td><td>Exceeds the AAP guideline threshold</td><td>Contact a pediatrician immediately to assess hydration status and the feeding plan</td></tr>
            </tbody>
          </table>
          <h3>Why Newborns Lose Weight (Physiological Weight Loss)</h3>
          <p>Newborn weight loss in the first days of life is a normal biological process. Most healthy newborns lose between 5% and 7% of their birth weight within 3 to 5 days after delivery. Babies shed excess extracellular fluid accumulated in the womb. They pass meconium, the first dark stool. They adjust to oral feeding outside the uterus while maternal milk supply is still arriving.</p>
          <p>Clinical guidelines state the following facts. Weight loss up to 7% is typical for exclusively breastfed babies. Formula-fed babies typically lose 3% to 5% or less. A loss between 7% and 10% calls for close feeding and latch monitoring, and a loss above 10% triggers clinical evaluation to rule out inadequate milk transfer, dehydration, hypernatremia, or latching difficulties.</p>
          <h3>Hour-by-Hour Clinical Thresholds (Nomogram)</h3>
          <table>
            <thead>
              <tr><th>Age (Hours / Days)</th><th>Normal Loss (Breastfed)</th><th>Normal Loss (Formula)</th><th>Clinical Action Level</th></tr>
            </thead>
            <tbody>
              <tr><td>0 to 24 Hours (Day 1)</td><td>3% to 5%</td><td>2% to 4%</td><td>Above 7% loss (assess latch and feedings)</td></tr>
              <tr><td>24 to 48 Hours (Day 2)</td><td>5% to 7%</td><td>3% to 5%</td><td>Above 8% loss (consult lactation or pediatrician)</td></tr>
              <tr><td>48 to 72 Hours (Day 3, peak loss)</td><td>7% to 8%</td><td>4% to 5%</td><td>Above 10% loss (immediate medical assessment)</td></tr>
              <tr><td>Days 4 to 5 (milk arrival)</td><td>Stabilizing, initial gain</td><td>Weight gain begins</td><td>Continued loss after day 5</td></tr>
              <tr><td>Days 10 to 14 (milestone)</td><td>Regained birth weight</td><td>Regained birth weight</td><td>Failure to regain birth weight by day 14</td></tr>
            </tbody>
          </table>
          <h3>Impact of Delivery Method (Vaginal vs. C-Section IV Fluids)</h3>
          <p>Mothers who undergo Cesarean delivery or receive high volumes of intrapartum IV fluids during labor often pass extra fluid to the newborn prior to birth. This temporary fluid expansion can raise initial weight loss readings by 2 to 4 percentage points during the first 48 hours as the infant excretes the excess fluid through diuresis. Pediatricians factor intrapartum IV fluid volume into their assessment of C-section newborn weight trajectories.</p>
          <h3>When to Call Your Pediatrician</h3>
          <p>Contact your baby's doctor immediately in any of these cases.</p>
          <ul>
            <li>Weight loss exceeds 10% of birth weight at any point.</li>
            <li>The baby has not regained birth weight by 14 days of age.</li>
            <li>The baby shows signs of dehydration: fewer wet diapers, dry mouth, or weakness.</li>
            <li>The baby appears lethargic or jaundiced, or is difficult to wake for feedings.</li>
          </ul>
          <h3>Monitoring at Home vs. at the Clinic (Comparison Checklist)</h3>
          <ul>
            <li>A home scale suits daily trend checks in the first week. A clinic scale suits the 48 to 72 hour threshold visit and the two-week regain check.</li>
            <li>One consistent scale used at the same time of day produces comparable numbers. Switching scales between readings breaks the trend line.</li>
            <li>One consistent unit (grams) removes conversion error. Mixing ounces and grams introduces it.</li>
            <li>Home readings answer "is today within range." Clinic readings answer "is the trajectory within the guideline." Both serve the same decision: whether feeding is adequate.</li>
          </ul>
          <h3>Unit Conversion Guide</h3>
          <table>
            <thead>
              <tr><th>Unit</th><th>Equals</th></tr>
            </thead>
            <tbody>
              <tr><td>1 pound (lb)</td><td>16 ounces (oz), or 453.592 grams (g)</td></tr>
              <tr><td>1 ounce (oz)</td><td>28.3495 grams (g)</td></tr>
              <tr><td>7 lb 8 oz</td><td>120 oz, or 3,402 grams</td></tr>
              <tr><td>Average newborn birth weight</td><td>5.5 to 8.8 lb (2,500 to 4,000 g)</td></tr>
              <tr><td>Normal infant weight percentile range</td><td>10th to 90th percentile</td></tr>
            </tbody>
          </table>
          <p>For highest accuracy, measure in grams and use the same unit for both weights.</p>
          <h3>Why Clinicians Chart Percentage, Not Grams (Expert Perspective)</h3>
          <p>A 200-gram loss means little without the denominator. On a 3,500-gram infant it equals 5.71%. On a 2,500-gram infant it equals 8.0%. The percentage states both results on one scale, which is why pediatric nomograms and AAP guidance use percentage thresholds instead of gram thresholds. Grams measure the baby. Percentages measure the baby against the guideline. For parents, the percentage also answers the only question that matters at 3 a.m.: is this number within the normal range.</p>
          <h3>Related Pediatric and Postpartum Calculators</h3>
          <ul>
            <li><a href="/calculators/postpartum-weight-loss/">Postpartum Weight Loss Calculator</a>. Track maternal weight recovery while breastfeeding safely.</li>
            <li><a href="/calculators/baby-weight-loss/">Infant Weight Loss Tracker</a>. Monitor weekly weight percentiles beyond the 14-day newborn window.</li>
            <li><a href="/category/pregnancy/">Pregnancy Weight Gain Calculator</a>. Trimester-by-trimester gestational weight gain targets.</li>
            <li><a href="/">Master Weight Loss Percentage Calculator</a>. Standard body weight loss percentage tool for adults.</li>
          </ul>
          <h3>Scientific References and Clinical Guidelines</h3>
          <ol>
            <li>American Academy of Pediatrics (AAP). "Management of Hyperbilirubinemia and Physiological Weight Loss in the Newborn Infant." Pediatric Clinical Practice Guidelines. PubMed ID: 35925414.</li>
            <li>World Health Organization (WHO). "Infant and Young Child Feeding: Standardized Newborn Weight Loss Curves." WHO guidelines, approved by the Guidelines Review Committee.</li>
            <li>Flaherman, V. J., et al. "Early Weight Loss Nomogram for Exclusively Breastfed Newborns." Pediatrics, 135(1), 16 to 23.</li>
            <li>Centers for Disease Control and Prevention (CDC). Healthy Weight Guidelines.</li>
            <li>National Heart, Lung, and Blood Institute (NHLBI). Obesity Guidelines.</li>
          </ol>
          <h3>Medical Disclaimer</h3>
          <p>This calculator and guide are for educational purposes only and do not replace professional medical advice. Always consult a board-certified pediatrician or healthcare provider regarding infant weight loss, feeding concerns, or health evaluation.</p>
        </section>`;
  } else if (routePath.endsWith('/calculators/baby-weight-loss/')) {
    preRenderedSectionHtml = `
        <section id="baby" style="margin-top: 1.5rem; padding: 1.5rem; background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: 1.25rem;">
          <h2>Baby Weight Loss Percentage Calculator</h2>
          <p>A baby weight loss percentage calculator is a functional tool that converts weight change into a percentage of birth weight. The metric is ((birth weight minus current weight) divided by birth weight) times 100. It standardizes tracking from birth through the first month.</p>
          <h3>What the tool computes</h3>
          <p>A baby weight loss percentage is ((starting weight minus current weight) divided by starting weight) times 100. The tool's input is birth weight plus the baby's current weight. The tool's output is one percentage. The tool accepts pounds, ounces and grams. The reference weight is birth weight or peak weight.</p>
          <h3>How to use it</h3>
          <p>Firstly, weigh the baby on the same scale at the same time of day. Secondly, enter the birth weight and the new weight in the calculator above. Finally, read the percentage against the normal-range table below.</p>
          <h3>Worked examples</h3>
          <p>The calculator applies one formula to every entry. Two worked examples show the arithmetic.</p>
          <table>
            <thead>
              <tr><th>Birth weight</th><th>Current weight</th><th>Calculation</th><th>Result</th></tr>
            </thead>
            <tbody>
              <tr><td>10 lb</td><td>9.5 lb</td><td>((10 − 9.5) ÷ 10) × 100</td><td>5 percent</td></tr>
              <tr><td>8 lb</td><td>7.5 lb</td><td>((8 − 7.5) ÷ 8) × 100</td><td>6.25 percent</td></tr>
            </tbody>
          </table>
          <h3>Normal ranges for the first month</h3>
          <p>The table below states the expected change by stage and the line where a pediatrician takes over.</p>
          <table>
            <thead>
              <tr><th>Period</th><th>Expected change</th><th>Red-flag line</th></tr>
            </thead>
            <tbody>
              <tr><td>First 72 hours</td><td>5 to 7 percent of birth weight lost</td><td>Above 10 percent</td></tr>
              <tr><td>First 3 to 5 days, breastfed</td><td>Up to 7 percent of birth weight lost</td><td>Above 10 percent</td></tr>
              <tr><td>First 3 to 5 days, formula-fed</td><td>3 to 5 percent of birth weight lost</td><td>Above 10 percent</td></tr>
              <tr><td>Day 10 to day 14</td><td>Birth weight regained</td><td>Birth weight not regained by day 14</td></tr>
            </tbody>
          </table>
          <p>Weight loss after the first 3 to 4 days is not normal. Later loss, or a failure to gain after that window, requires clinical evaluation. This tracker covers birth through the first month, including the regain curve by day 10 to 14. For day-by-day first-week physiology, see the <a href="/calculators/newborn-weight-loss/">newborn weight loss calculator</a>, which examines the earliest feeding checks in finer detail.</p>
          <p>After the first month, the percentage from birth weight stops being the right measure. The <a href="/calculators/baby-weight-percentile/">baby weight percentile calculator</a> places the same weight on the WHO and CDC growth chart for the baby&apos;s age and sex, so parents can track growth month by month instead of against birth weight.</p>
          <h3>Continue tracking or call the pediatrician</h3>
          <p>The checklist below separates routine home tracking from situations the guidelines assign to a clinician.</p>
          <p><strong>Continue tracking at home.</strong> The loss sits inside the expected range in the table above. The baby wets at least 6 diapers daily from day 4 onward. Feeds are regular and the baby wakes easily.</p>
          <p><strong>Call the pediatrician.</strong> The loss exceeds 10 percent of birth weight. Birth weight is not regained by day 14. The baby wets fewer than 6 diapers daily from day 4 onward. The baby appears jaundiced or lethargic. The baby is hard to wake for feeds.</p>
          <h3>Why percentage beats ounces</h3>
          <p>An ounce figure hides severity because birth weights differ. Seven lost ounces on a 6 pound baby is 7.3 percent. The same seven ounces on a 9 pound baby is 4.9 percent. The percentage puts both babies on one scale, so parents and clinicians compare like with like. Raw ounces never standardize across body sizes.</p>
          <h3>Responsive feeding and logging</h3>
          <p>Responsive feeding supports healthy growth, whether breastfeeding or formula. A simple log of weight changes, wet diapers and sleep patterns reveals the baby's trend faster than memory alone.</p>
          <h3>Method, review and sources</h3>
          <p>The tool's method is standard physiological formulas with evidence-based guidelines. The medical reviewer is Dr. Rekha Kumar, M.D., M.S., Lead Medical Reviewer. The page's last update is August 2026. The source guidelines are NIH and CDC. The references are CDC Healthy Weight Guidelines, the NIH National Heart, Lung, and Blood Institute Obesity Guidelines, and PubMed studies on fat mass versus lean mass loss. The tool's price is 0 USD. The tool's description is a free baby weight loss calculator, dietitian-reviewed.</p>
          <h3>Medical disclaimer</h3>
          <p>This tool is for informational purposes only and does not constitute medical advice. Always consult a healthcare provider. Any concerns about your baby's weight, feeding, or development belong in a conversation with a medical professional.</p>
          <h3>Related pages</h3>
          <p>The <a href="/blog/how-to-calculate-weight-loss-percentage/">guide to calculating weight loss percentage</a> works through the reasoning behind the arithmetic step by step. A printable reference of these ranges lives on the <a href="/blog/weight-loss-percentage-chart/">weight loss percentage chart page</a>. Adults tracking their own progress use the <a href="/">general weight loss percentage calculator</a>, which applies the same percentage method to any starting weight.</p>
        </section>`;
  } else if (routePath.endsWith('/calculators/bmr/')) {
    preRenderedSectionHtml = `
        <section id="bmr" style="margin-top: 1.5rem; padding: 1.5rem; background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: 1.25rem;">
          <h2>BMR Calculator: Basal Metabolic Rate &amp; Resting Calories</h2>
          <p>A basal metabolic rate calculator estimates the minimum calories your body needs at complete rest. BMR is the energy cost of breathing, circulation, cellular maintenance and temperature regulation. This tool computes it with the Mifflin-St Jeor equation, the most widely validated published formula.</p>
          <h3>What this calculator computes</h3>
          <table>
            <thead>
              <tr><th>Input</th><th>Unit</th><th>Role in the equation</th></tr>
            </thead>
            <tbody>
              <tr><td>Weight</td><td>Kilograms or pounds</td><td>Primary driver of the estimate</td></tr>
              <tr><td>Height</td><td>Centimetres or inches</td><td>Secondary scaling factor</td></tr>
              <tr><td>Age</td><td>Years</td><td>Reduces the estimate as age rises</td></tr>
              <tr><td>Sex</td><td>Male or female</td><td>Selects the equation variant</td></tr>
              <tr><td>Body fat percentage</td><td>Optional, for the Katch-McArdle option</td><td>Derives lean body mass</td></tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr><th>Output</th><th>Unit</th><th>Meaning</th></tr>
            </thead>
            <tbody>
              <tr><td>BMR</td><td>Calories per day</td><td>Minimum energy at complete rest</td></tr>
              <tr><td>BMR share</td><td>Percentage</td><td>Roughly 60 to 75 percent of total daily burn</td></tr>
            </tbody>
          </table>
          <p>BMR accounts for roughly 60 to 75 percent of total daily calorie burn. The remainder comes from movement, digestion and exercise. A BMR value sets the floor. No sustainable plan sits below it for long.</p>
          <h3>The Mifflin-St Jeor equation</h3>
          <p>The Mifflin-St Jeor equation is the calculation this tool runs by default. Researchers published it in 1990 after validating it against measured resting expenditure. Its standard published forms are below.</p>
          <table>
            <thead>
              <tr><th>Variant</th><th>Equation (weight in kg, height in cm, age in years)</th></tr>
            </thead>
            <tbody>
              <tr><td>Men</td><td>BMR = 10 × weight + 6.25 × height − 5 × age + 5</td></tr>
              <tr><td>Women</td><td>BMR = 10 × weight + 6.25 × height − 5 × age − 161</td></tr>
            </tbody>
          </table>
          <p>The equation's subject is basal metabolic rate. Its inputs are weight, height, age and sex. Its output is calories per day at rest. Its key property is that muscle tissue costs more energy than fat tissue at rest, so two people at the same weight can hold different BMR values.</p>
          <h3>How to use the calculator</h3>
          <p>Firstly, enter your weight, height, age and sex. Secondly, add your body fat percentage if you know it, because that unlocks the Katch-McArdle option. Finally, read your BMR and compare it against your current intake to see your true baseline.</p>
          <p>Once you know your baseline, <a href="/">the main weight loss percentage tool</a> turns any two weigh-ins into a single comparable number. For the arithmetic behind converting start and current weight into a percentage, see <a href="/blog/how-to-calculate-weight-loss-percentage/">the page that walks through the weight loss percentage formula step by step</a>.</p>
          <p>The same calorie calculation is available for Australia. The <a href="/au/calculators/calorie/">Australian daily calorie calculator</a> applies the same BMR method for Australian users.</p>
          <h3>The Katch-McArdle option</h3>
          <p>The Katch-McArdle formula is the alternative this tool offers. Its defining input is lean body mass, which the tool derives from your body fat percentage. It suits athletes and people with measured body composition, because measured lean mass reflects reality better than height-weight proxies. It suits general users less, because few people know their lean mass with precision.</p>
          <p><code>BMR = 370 + (21.6 × Lean Body Mass in kg)</code></p>
          <h3>Which equation should you use</h3>
          <ul>
            <li><strong>Choose Mifflin-St Jeor</strong> when you know weight, height, age and sex but not body fat percentage. It is the default for general populations and the most widely validated option in published comparisons.</li>
            <li><strong>Choose Katch-McArdle</strong> when you have a measured body fat percentage. It replaces height-weight proxies with actual lean body mass, which raises accuracy for lean and athletic builds.</li>
            <li><strong>Avoid the original Harris-Benedict equation</strong> for new estimates. Published in 1918, it overestimates resting expenditure for modern populations in most comparison studies. Its 1984 revised coefficients narrowed the gap but did not displace Mifflin-St Jeor as the clinical default.</li>
            <li><strong>Match the equation to the data you trust.</strong> An equation is only as accurate as its inputs. A precise body fat measurement beats a proxy-based formula. A guessed body fat percentage does not.</li>
          </ul>
          <p>If your goal is structured weekly loss, <a href="/calculators/biggest-loser/">the Biggest Loser framework</a> sets the deficit against this same resting baseline.</p>
          <h3>The most common mistake: BMR is not TDEE</h3>
          <p>People read their BMR and treat it as their daily calorie target. It is not. BMR is the floor. Total daily energy expenditure is BMR multiplied by an activity multiplier, so <a href="/calculators/tdee/">the TDEE calculator page</a> extends this resting baseline with your movement level, and that product is the number a weight loss plan works from. Eating below BMR for extended periods invites adaptive thermogenesis, the slowdown where the body conserves energy and burns muscle for fuel. The safe deficit sits between BMR and TDEE, never below the floor for long without medical supervision.</p>
          <h3>About this calculator</h3>
          <p>This calculator uses standard physiological formulas and evidence-based guidelines. The National Institutes of Health and the Centers for Disease Control and Prevention guidelines were consulted in its creation. Medical review by Dr. Rekha Kumar, M.D., M.S., Lead Medical Reviewer. Last updated August 2026.</p>
          <p><strong>Disclaimer.</strong> This tool is for informational purposes only and does not constitute medical advice. Always consult a healthcare provider before changing your diet or activity.</p>
          <p><strong>Scientific references.</strong> CDC Healthy Weight Guidelines. NIH National Heart, Lung, and Blood Institute Obesity Guidelines. PubMed studies on the rate of fat mass versus lean mass loss.</p>
        </section>`;
  } else if (routePath.endsWith('/restaurants/subway/')) {
    preRenderedSectionHtml = `
        <section id="subway" style="margin-top: 1.5rem; padding: 1.5rem; background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: 1.25rem;">
          <h2>Subway Nutrition Calculator &amp; Calorie Counter (2026 Menu)</h2>
          <p>A Subway calorie calculator is a sandwich-builder tool that sums the calories, protein, carbohydrates, fat and sodium of one custom Subway sandwich. It takes the 6-inch or Footlong base, the bread, the protein, the cheese, the vegetables and the sauce, and returns the meal totals.</p>
          <h3>Build the sandwich, read the totals</h3>
          <p>The builder above follows one sequence. Firstly, choose the size: 6-inch or Footlong. Secondly, choose the bread. Thirdly, choose the protein. Finally, add cheese, vegetables and sauce. Each selection adds its official 2026 menu values to the totals card. The calculator sums calories, protein, carbohydrates, fat and sodium for the complete sandwich.</p>
          <p>Subway publishes one nutrition table per ingredient. The tool reads that table directly. It does not estimate. It does not average.</p>
          <h3>Fixed reference values</h3>
          <table>
            <thead>
              <tr><th>Ingredient choice</th><th>Energy it adds</th></tr>
            </thead>
            <tbody>
              <tr><td>6-inch 9-Grain Wheat or Sourdough bread</td><td>190 to 210 calories</td></tr>
              <tr><td>Mayonnaise or Chipotle Southwest sauce</td><td>100 to 150 calories per serving</td></tr>
              <tr><td>Mustard, vinegar or sweet onion sauce</td><td>0 to 40 calories per serving</td></tr>
              <tr><td>Standard 6-inch turkey breast on wheat</td><td>280 to 315 calories for the complete sandwich</td></tr>
            </tbody>
          </table>
          <h3>Why the range matters</h3>
          <p>Subway is popular for offering healthier fast-food choices. The health claim collapses or holds on four decisions: bread, protein, cheese and sauce. The table above makes the mechanism visible. A 6-inch turkey breast on wheat reads roughly 280 to 315 calories. Add cheese, mayonnaise and Italian herbs and cheese bread and the same sandwich easily doubles its caloric density. The driver is never the turkey. The drivers are the cheese, the sauce and the bread.</p>
          <p>New Zealand diners use the same builder. The tool covers the official 2026 menu. Subway publishes different nutrition values per region, so the calculator displays the values from the menu data it loads.</p>
          <h3>Lowest-calorie build order</h3>
          <p>Opinion: the cheapest calories come from the base, not the extras. Build in this order when calories are the constraint.</p>
          <table>
            <thead>
              <tr><th>Priority</th><th>Choice</th><th>Reason</th></tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>9-Grain Wheat or Sourdough bread</td><td>The two lowest-calorie 6-inch breads at 190 to 210 calories</td></tr>
              <tr><td>2</td><td>Turkey breast protein</td><td>The baseline sandwich reads 280 to 315 calories before extras</td></tr>
              <tr><td>3</td><td>Mustard, vinegar or sweet onion sauce</td><td>Each adds 0 to 40 calories, against 100 to 150 for mayonnaise or Chipotle Southwest</td></tr>
              <tr><td>4</td><td>Skip or halve the cheese</td><td>Cheese is a stated density driver alongside sauce and bread</td></tr>
            </tbody>
          </table>
          <h3>Related calculators</h3>
          <p>To place one Subway meal inside your daily budget, the <a href="/calculators/bmr/">BMR calculator sets the resting calorie floor</a> the meal must fit under, and the <a href="/calculators/calorie-deficit/">Calorie Deficit Calculator</a> fits a Subway meal into your daily calorie deficit.</p>
          <p>For the burger-chain version of this exercise, the <a href="/restaurants/five-guys/">Five Guys calorie calculator</a> breaks a custom burger into the same ingredient-by-ingredient totals, while the <a href="/restaurants/mcdonalds/">McDonald's Nutrition Calculator</a> covers fast-food burgers, fries and meals.</p>
          <p>The McDonald's calculator is also available for China. The <a href="/zh/restaurants/mcdonalds/">Chinese McDonald's calorie calculator</a> covers the same meal builder with the Chinese menu.</p>
          <p>To record the meal as part of a plan, the <a href="/blog/how-to-calculate-weight-loss-percentage/">guide on how to calculate weight loss percentage</a> shows the exact formula the percentage view applies to it. The <a href="/">homepage calculator suite</a> extends this builder with BMI, TDEE, deficit and macro tools that carry one meal into a full day.</p>
          <h3>Evidence and references</h3>
          <ul>
            <li>HHS: Dietary Guidelines for Americans (health.gov)</li>
            <li>Dietary Guidelines for Americans (dietaryguidelines.gov)</li>
          </ul>
          <p>This tool is for informational purposes only and is not a substitute for professional medical advice.</p>
        </section>`;
  } else if (routePath.endsWith('/calculators/biggest-loser/')) {
    preRenderedSectionHtml = `
        <section id="biggest-loser" style="margin-top: 1.5rem; padding: 1.5rem; background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: 1.25rem;">
          <h2>Biggest Loser Weight Loss Calculator</h2>
          <p>The Biggest Loser weight loss calculator computes your loss as a percentage of starting weight with the same ranking formula the show used. Enter starting weight and current weight. The tool returns one percentage. A 300-lb contestant who loses 30 lbs ties a 150-lb contestant who loses 15 lbs at 10.0%.</p>
          <h3>How the Biggest Loser formula works</h3>
          <p>The show ranked contestants on percentage of starting weight lost. That single rule defines this calculator. Its input is two numbers: your starting weight and your current weight. Its output is one number: your weight loss percentage. The equation is the following.</p>
          <p><code>Weight Loss % = ((Starting Weight − Current Weight) ÷ Starting Weight) × 100</code></p>
          <table>
            <thead>
              <tr><th>Contestant</th><th>Starting weight</th><th>Weight lost</th><th>Result</th></tr>
            </thead>
            <tbody>
              <tr><td>Contestant A</td><td>300 lbs</td><td>30 lbs</td><td>10.0%</td></tr>
              <tr><td>Contestant B</td><td>150 lbs</td><td>15 lbs</td><td>10.0%</td></tr>
            </tbody>
          </table>
          <p>The two rows tie. The percentage states one fact about both bodies. Raw pounds would have declared the 300-lb contestant the winner. The method derives from the <a href="/blog/how-to-calculate-weight-loss-percentage/">standard weight loss percentage formula</a> used across clinical weight programs. Plot each weekly result on the <a href="/blog/weight-loss-percentage-chart/">weight loss percentage chart</a> to watch the trend.</p>
          <h3>Why the show ranked by percentage</h3>
          <p>Pounds reward size. A heavier body burns more at rest because its basal metabolic rate runs higher, and the same calorie deficit removes more pounds per week from a larger frame. Percentage divides the loss by the frame. The result measures effort, not mass.</p>
          <p>The show's ranking rule was explicit. The contestant with the highest percentage won the weigh-in. Ties stood as ties. Nobody earned points for pounds.</p>
          <h3>Percentage ranking versus pounds ranking</h3>
          <table>
            <thead>
              <tr><th>Criterion</th><th>Percentage ranking</th><th>Pounds ranking</th></tr>
            </thead>
            <tbody>
              <tr><td>What it measures</td><td>Share of starting weight lost</td><td>Absolute mass lost</td></tr>
              <tr><td>Fairness across body sizes</td><td>High: one scale fits all sizes</td><td>Low: size determines the result</td></tr>
              <tr><td>What a tie means</td><td>Both bodies changed by the same share</td><td>Impossible to compare across sizes</td></tr>
              <tr><td>Who it favors</td><td>Consistent deficit keepers</td><td>Larger contestants</td></tr>
            </tbody>
          </table>
          <p>The comparison resolves one question. Percentage answers how much of yourself you lost. Pounds answers how much mass moved. Only the first question compares two people.</p>
          <h3>Expert perspective: copy the formula, not the pace</h3>
          <p>The formula is sound. The pace is not. Contestants on the show lost 5 to 10 pounds per week under dangerous calorie deficits and dehydration. Medical research ties that speed to severe muscle wasting and long-term metabolic slowdown. Follow-up studies on contestants revealed the mechanics of adaptive thermogenesis. Their results appear in the reference list below.</p>
          <p>A sustainable target is 0.5% to 1.0% of body weight per week. That range sits far below show pace. It keeps the loss inside what the body can repeat. Use this calculator to track the share. Set the weekly goal from the medical range, not from television. A safe workflow runs in three steps. Firstly, estimate your baseline burn with the <a href="/calculators/bmr/">site's resting-metabolism tool</a>. Secondly, fix the weekly target inside the 0.5% to 1.0% band. Finally, record the share here each week and compare it with the stated range.</p>
          <h3>About this calculator</h3>
          <p>This calculator applies standard physiological formulas under evidence-based guidelines. Dr. Rekha Kumar, M.D., M.S., reviewed it as Lead Medical Reviewer. The page last updated in August 2026.</p>
          <p>The tool serves information only. It does not replace medical advice. Consult a healthcare provider before you change your diet or training. Every calculator in the suite lives on the <a href="/">Weight Loss Percentage home page</a>.</p>
          <h3>Scientific references</h3>
          <ul>
            <li>CDC Healthy Weight Guidelines</li>
            <li>NIH National Heart, Lung, and Blood Institute obesity guidelines</li>
            <li>PubMed studies on fat mass versus lean mass loss rates</li>
            <li>Metabolic adaptation research on weight loss competition cohorts</li>
          </ul>
        </section>`;
  } else if (routePath.endsWith('/calculators/baby-weight-percentile/')) {
    preRenderedSectionHtml = `
        <section id="baby-weight-percentile" style="margin-top: 1.5rem; padding: 1.5rem; background: var(--cp-surface); border: 1px solid var(--cp-border); border-radius: 1.25rem;">
          <h2>Baby Weight Percentile Calculator: WHO &amp; CDC Growth Chart (0-60 Months)</h2>
          <p>A baby weight percentile calculator is a growth chart tool that converts a baby&apos;s weight and age into a percentile for that age and sex. It uses the WHO Child Growth Standards from birth to 24 months and the CDC 2000 Growth Charts from 24 to 60 months. Enter the baby&apos;s sex, age in months, and weight to see the percentile, the z-score, and the 3rd, 50th, and 97th percentile weights for that age and sex.</p>
          <h3>What a baby weight percentile means</h3>
          <p>A baby weight percentile is a ranking that places one baby&apos;s weight against the weights of babies the same age and sex on a standard growth chart. A percentile of 50 means the baby weighs the same as the median baby of that age and sex. A percentile of 25 means the baby weighs more than about 25 out of 100 babies the same age and sex. A percentile of 75 means the baby weighs more than about 75 out of 100.</p>
          <p>The percentile answers one question: where does this baby&apos;s weight sit on the growth chart for this age and sex. It does not grade the baby. It does not diagnose a problem. It gives parents and pediatricians a common reference point for tracking growth over time.</p>
          <p>Pediatricians track the percentile across visits. A baby who stays near the same percentile line grows steadily. A baby who crosses two percentile lines in either direction earns a closer look at feeding, illness, and growth.</p>
          <p>In the first days after birth, weight moves fast. The <a href="/calculators/newborn-weight-loss/">newborn weight loss calculator</a> checks the first-days drop against the normal range. After the first month, the <a href="/calculators/baby-weight-loss/">baby weight loss calculator</a> tracks the percentage change from birth weight. The <a href="/calculators/infant-weight-loss/">infant weight loss calculator</a> covers the same check for older infants.</p>
          <h3>How the percentile is calculated</h3>
          <p>The calculator uses the LMS method. WHO and the CDC publish three numbers for every month of age and each sex: L for skew, M for the median weight, and S for spread. The calculator looks up the three numbers for the baby&apos;s age and sex, converts the weight into a z-score, and converts the z-score into a percentile.</p>
          <p>Firstly, enter the baby&apos;s sex, age in months, and weight. Secondly, the calculator finds the L, M, and S values for that age and sex. Finally, it computes the z-score and reads the percentile from the standard normal distribution.</p>
          <p><code>z = ((weight / M)^L - 1) / (L x S)</code>, and the percentile equals the standard normal cumulative distribution of z, times 100. When L equals zero, the formula becomes <code>z = ln(weight / M) / S</code>.</p>
          <p>WHO supplies the values from birth to 24 months. The CDC supplies the values from 24 months to 60 months. The CDC and the American Academy of Pediatrics recommend the WHO standards for infants under 24 months and the CDC charts for children aged 2 years and older.</p>
          <h3>Weight at the 3rd, 50th, and 97th percentiles (kg)</h3>
          <p>The table below shows the reference weights for girls and boys at common ages, computed from the same WHO and CDC values the calculator uses. The 50th percentile is the median weight. The 3rd and 97th percentiles mark the outer edges of the reference range.</p>
          <table>
            <thead>
              <tr><th>Age</th><th>Girls 3rd</th><th>Girls 50th</th><th>Girls 97th</th><th>Boys 3rd</th><th>Boys 50th</th><th>Boys 97th</th></tr>
            </thead>
            <tbody>
              <tr><td>Birth (WHO)</td><td>2.44</td><td>3.23</td><td>4.17</td><td>2.51</td><td>3.35</td><td>4.35</td></tr>
              <tr><td>2 mo (WHO)</td><td>4.00</td><td>5.13</td><td>6.53</td><td>4.39</td><td>5.57</td><td>6.99</td></tr>
              <tr><td>4 mo (WHO)</td><td>5.09</td><td>6.42</td><td>8.11</td><td>5.64</td><td>7.00</td><td>8.63</td></tr>
              <tr><td>6 mo (WHO)</td><td>5.81</td><td>7.30</td><td>9.20</td><td>6.44</td><td>7.93</td><td>9.72</td></tr>
              <tr><td>9 mo (WHO)</td><td>6.56</td><td>8.23</td><td>10.39</td><td>7.24</td><td>8.90</td><td>10.90</td></tr>
              <tr><td>12 mo (WHO)</td><td>7.14</td><td>8.95</td><td>11.33</td><td>7.85</td><td>9.65</td><td>11.83</td></tr>
              <tr><td>18 mo (WHO)</td><td>8.17</td><td>10.23</td><td>12.99</td><td>8.87</td><td>10.94</td><td>13.48</td></tr>
              <tr><td>24 mo (CDC)</td><td>9.99</td><td>12.06</td><td>15.00</td><td>10.38</td><td>12.67</td><td>15.60</td></tr>
              <tr><td>36 mo (CDC)</td><td>11.33</td><td>13.87</td><td>17.87</td><td>11.76</td><td>14.33</td><td>17.94</td></tr>
              <tr><td>48 mo (CDC)</td><td>12.71</td><td>15.79</td><td>21.14</td><td>13.23</td><td>16.23</td><td>20.87</td></tr>
              <tr><td>60 mo (CDC)</td><td>14.27</td><td>17.93</td><td>24.79</td><td>14.79</td><td>18.39</td><td>24.31</td></tr>
            </tbody>
          </table>
          <p>A worked example makes the ranking concrete. A 12-month-old boy who weighs 8.00 kg sits at about the 4th percentile, below the typical range. A 12-month-old girl who weighs 8.00 kg sits at about the 18th percentile, within the typical range. The same weight means different things for each sex, which is why the calculator asks for sex first.</p>
          <h3>When to talk to your baby&apos;s doctor</h3>
          <p>Call the pediatrician when the percentile falls below the 5th or above the 95th, when the percentile crosses two lines between visits, or when weight gain stalls for more than a month. A single low or high reading rarely signals a problem on its own. The trend across visits matters more than any one number.</p>
          <p>Bring the growth chart to every visit. The pediatrician reads the percentile together with length, head circumference, feeding, and development. Weight alone never tells the whole story.</p>
          <h3>Source</h3>
          <p>This calculator uses the WHO Child Growth Standards (2006), weight-for-age, for birth to 24 months, and the CDC 2000 Growth Charts, weight-for-age, for 24 to 60 months. The <a href="https://www.cdc.gov/growthcharts/">CDC growth charts</a> publish the reference tables and the LMS data files the calculator reads.</p>
          <p><strong>Disclaimer.</strong> This tool is for informational purposes only and does not constitute medical advice. Always consult a healthcare provider about your baby&apos;s growth.</p>
        </section>`;
  }

  if (preRenderedSectionHtml) {
    routeHtml = routeHtml.replace(
      /(<\/div>\s*<\/div>\s*<\/div>\s*<noscript>)/,
      `</div>${preRenderedSectionHtml}\n      </div>\n    </div>\n\n    <noscript>`
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
