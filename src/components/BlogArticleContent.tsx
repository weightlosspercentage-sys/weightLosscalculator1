import React from 'react';
import { Scale, Activity, Calendar, TrendingDown, CheckCircle2, Ruler } from 'lucide-react';

export type DistinctBlogSlug = 'fat-loss-vs-weight-loss' | 'weight-tracking-guide';

interface BlogArticleContentProps {
  slug: DistinctBlogSlug;
}

export const BlogArticleContent: React.FC<BlogArticleContentProps> = ({ slug }) => {
  if (slug === 'fat-loss-vs-weight-loss') {
    return (
      <article
        id="blog-article-fat-loss-vs-weight-loss"
        className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed"
      >
        <header className="border-b border-slate-100 dark:border-slate-800 pb-5 space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#7334fd] dark:text-indigo-400">
            <Scale className="w-4 h-4" />
            <span>Body Composition &amp; Measurement Guide</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Fat Loss vs Weight Loss: Why Scale Weight and Body Fat Percentage Are Two Different Numbers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Weight loss is a reduction in total body mass measured on a scale, whereas fat loss is a specific reduction in adipose fat tissue relative to lean mass.
          </p>
        </header>

        <section className="space-y-3 text-xs sm:text-sm">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            1. What Scale Weight Includes: Water, Glycogen, Muscle, and Fat
          </h3>
          <p>
            Scale weight measures the combined mass of every tissue and fluid inside your body at the moment you step on the platform. That single reading sums adipose fat tissue, skeletal muscle mass, bone mineral content, organs, extracellular and intracellular water, stored carbohydrate glycogen, and undigested food or fluid in the digestive tract.
          </p>
          <p>
            Because skeletal muscle and liver tissue store carbohydrate glycogen alongside bound water, total scale weight can drop or rise noticeably over a short period purely from carbohydrate and water shifts. Losing scale weight rapidly when starting a calorie deficit reflects glycogen and water release alongside early fat loss, not pure adipose tissue loss.
          </p>
        </section>

        <section className="space-y-3 text-xs sm:text-sm">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            2. What Body Fat Percentage Measures and How a Fat Loss Percentage Calculator Works
          </h3>
          <p>
            Body fat percentage is the proportion of your total body weight that consists of adipose fat mass, calculated as (Fat Mass divided by Total Body Weight) multiplied by 100. The remaining percentage is fat-free mass (lean body mass), which includes skeletal muscle, bone, connective tissue, and body water.
          </p>
          <p>
            A fat loss percentage calculator tracks two distinct metrics depending on the inputs you record:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Total Weight Loss Percentage Formula
              </h4>
              <p className="font-mono text-xs text-[#7334fd] dark:text-indigo-300">
                ((Starting Weight - Current Weight) ÷ Starting Weight) × 100
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Measures the percentage reduction in overall scale weight from your starting weight to your current weight.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Fat Mass &amp; Body Fat Percentage Tracking
              </h4>
              <p className="font-mono text-xs text-[#ca3500] dark:text-orange-300">
                Fat Mass = Total Weight × (Body Fat % ÷ 100)
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Separates adipose fat mass from lean body mass so you can see how much of your total weight change comes from fat tissue versus lean muscle and water.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 text-xs sm:text-sm">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
            3. Direct Comparison: Fat Loss vs Weight Loss
          </h3>
          <p>
            Distinguishing fat loss from weight loss prevents misinterpreting plateaus when you strength train or adjust carbohydrate intake. The table below compares both numbers across composition, daily changes, and measurement tools.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold">
                <tr>
                  <th className="p-3">Measurement Dimension</th>
                  <th className="p-3">Weight Loss (Scale Mass)</th>
                  <th className="p-3">Fat Loss (Adipose Reduction)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Tissues Included</td>
                  <td className="p-3">Adipose fat, skeletal muscle, water, glycogen, and digestive contents.</td>
                  <td className="p-3">Subcutaneous and visceral adipose fat tissue only.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Daily Volatility</td>
                  <td className="p-3">Moves up or down noticeably from day to day due to hydration, sodium, and meal volume.</td>
                  <td className="p-3">Changes gradually over time in proportion to your sustained calorie deficit.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Effect on Resting Metabolism</td>
                  <td className="p-3">Losing lean muscle mass lowers Basal Metabolic Rate (BMR).</td>
                  <td className="p-3">Preserving lean muscle while losing fat maintains higher resting energy expenditure.</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">Primary Verification Tool</td>
                  <td className="p-3">Calibrated digital floor scale and weight loss percentage calculator.</td>
                  <td className="p-3">Waist circumference tape, skinfold calipers, DEXA, or circumference body fat methods.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3 text-xs sm:text-sm">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#ca3500] dark:text-orange-400 shrink-0" />
            <span>4. How to Track Both Numbers: Scale Weight, Waist Measurement, and Body Fat</span>
          </h3>
          <p>
            Tracking scale weight alone cannot tell you how much of your weight loss came from adipose fat tissue versus water or skeletal muscle. Pairing your scale weight percentage with body composition checks solves that ambiguity:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-slate-900 dark:text-white">Waist Circumference at the Navel:</strong> Visceral and abdominal subcutaneous fat shrink directly as adipose tissue is lost. If your scale weight stays flat while you start resistance training, but your waist measurement decreases, you are losing body fat while retaining muscle glycogen and lean tissue.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Circumference or Caliper Body Fat Estimates:</strong> Recording neck, waist, and hip measurements on a consistent schedule under identical morning conditions tracks the downward trend in body fat percentage alongside your total weight loss percentage.
            </li>
            <li>
              <strong className="text-slate-900 dark:text-white">Strength and Resistance Performance:</strong> Maintaining or increasing the weight and repetitions you lift in compound exercises confirms that skeletal muscle mass is being retained during your calorie deficit.
            </li>
          </ul>
        </section>

        <section className="space-y-3 text-xs sm:text-sm">
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>5. When Each Number Matters Most and How to Keep Loss Mostly Fat</span>
          </h3>
          <p>
            Total weight loss percentage is the primary clinical benchmark in medical studies because a 5% to 10% reduction in total body weight reliably supports healthier blood pressure, blood glucose, and joint load. Body fat percentage matters most when you are strength training, approaching a healthy weight range, or working to preserve athletic performance and resting metabolic rate.
          </p>
          <p>
            To ensure that the percentage you lose on the calculator above comes predominantly from fat mass rather than lean muscle, keep your daily calorie deficit moderate and sustainable, consume adequate dietary protein at each meal, and perform regular resistance training.
          </p>
        </section>
      </article>
    );
  }

  return (
    <article
      id="blog-article-weight-tracking-guide"
      className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed"
    >
      <header className="border-b border-slate-100 dark:border-slate-800 pb-5 space-y-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#7334fd] dark:text-indigo-400">
          <Calendar className="w-4 h-4" />
          <span>Evidence-Based Measurement Protocol</span>
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Weight Tracking Guide: How to Weigh Yourself Correctly and Read the Weekly Trend
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Accurate weight tracking requires weighing yourself under identical morning conditions, logging the daily reading, and comparing 7-day weekly averages rather than single-day numbers.
        </p>
      </header>

      <section className="space-y-3 text-xs sm:text-sm">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>1. Standardized Morning Weigh-In Protocol: Same Time, Same Conditions</span>
        </h3>
        <p>
          A scale reading is only comparable to previous days when you eliminate variable weight from clothing, meals, beverages, and bladder contents. Follow this standardized morning routine every time you step on the scale:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong className="text-slate-900 dark:text-white">Weigh first thing after waking:</strong> Step on the scale immediately after waking up and using the restroom, before drinking water, coffee, or eating breakfast.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Wear minimal or identical clothing:</strong> Weigh unclothed or in lightweight sleepwear so heavy shoes, jeans, or sweaters never add artificial variance to the reading.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Place the scale on a hard, level floor:</strong> Keep your digital scale on flat tile, hardwood, or linoleum. Carpet or uneven bath mats absorb force and cause inconsistent sensor readings.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Stand centered and still:</strong> Distribute your weight evenly across both feet and wait for the digital display to lock before stepping off.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Record the number immediately:</strong> Log the reading in your weight tracker or calculator and treat it as one data point in your 7-day weekly average.
          </li>
        </ol>
      </section>

      <section className="space-y-3 text-xs sm:text-sm">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-[#7334fd] dark:text-indigo-400 shrink-0" />
          <span>2. Why You Must Read the 7-Day Weekly Average, Not a Single Day</span>
        </h3>
        <p>
          Comparing a single morning weight to another isolated day often hides real fat loss behind temporary water retention. Even when you maintain a consistent daily calorie deficit, a higher-sodium dinner or a higher-carbohydrate meal the night before can temporarily add noticeable water weight overnight.
        </p>
        <p>
          To calculate your 7-day weekly average, use the formula <span className="font-mono font-bold text-slate-900 dark:text-white">Sum of 7 Morning Weights / 7</span>: add all seven morning weigh-ins from Monday through Sunday and divide the total by 7. Compare your current 7-day weekly average against the previous week&apos;s 7-day weekly average. Smoothing out daily spikes reveals the true underlying rate of fat loss.
        </p>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold">
              <tr>
                <th className="p-3">Tracking Method</th>
                <th className="p-3">Calculation</th>
                <th className="p-3">Sensitivity to Overnight Water Shifts</th>
                <th className="p-3">How to Interpret the Reading</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="p-3 font-semibold text-slate-900 dark:text-white">Single-Day Morning Weigh-In</td>
                <td className="p-3">One isolated daily scale reading</td>
                <td className="p-3 text-amber-700 dark:text-amber-400">High sensitivity to sodium, carbohydrate glycogen water, and digestive volume</td>
                <td className="p-3">Log the number without reacting to single-day jumps or drops</td>
              </tr>
              <tr className="bg-emerald-50/70 dark:bg-emerald-950/40 font-semibold text-slate-900 dark:text-white">
                <td className="p-3">7-Day Weekly Average</td>
                <td className="p-3 font-mono">Sum of 7 Morning Weights / 7</td>
                <td className="p-3 text-emerald-700 dark:text-emerald-400">Low sensitivity because day-to-day fluid fluctuations average out across the week</td>
                <td className="p-3">Compare Week 2 average to Week 1 average to read your true weight trend</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3 text-xs sm:text-sm">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
          3. What Daily Scale Fluctuations Actually Mean
        </h3>
        <p>
          Daily weight can move up or down by a noticeable amount from day to day due to fluid balance and digestive volume rather than changes in body fat:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-slate-900 dark:text-white">Sodium Intake and Extracellular Water:</strong> Eating a restaurant meal or processed food higher in sodium causes the kidneys to retain extra water temporarily to maintain normal blood sodium balance. That extra fluid clears naturally once you return to your normal hydration and sodium intake.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Carbohydrate Refills and Muscle Glycogen:</strong> Stored muscle glycogen binds water alongside carbohydrate. A higher-carbohydrate meal replenishes muscle glycogen stores and increases scale weight without adding body fat.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Sore Muscles After Exercise:</strong> New or intense resistance workouts create microscopic muscle fiber repair accompanied by localized fluid retention, temporarily raising scale weight while the muscle recovers.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Hormonal Cycle Shifts:</strong> Hormonal shifts prior to menstruation commonly cause temporary extracellular water retention that resolves once the cycle begins.
          </li>
        </ul>
      </section>

      <section className="space-y-3 text-xs sm:text-sm">
        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
          4. When to Act and Adjust Your Plan vs When to Stay the Course
        </h3>
        <p>
          Never cut calories or add extra cardio in reaction to a single high morning weigh-in or a few flat days. Compare your 7-day weekly averages across consecutive weeks to decide when to stay the course and when to act:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-slate-900 dark:text-white">Stay the course during a short-term flat trend:</strong> If your 7-day weekly average stays briefly flat while your nutrition and activity are consistent, keep your plan steady. Temporary water retention from stress, sleep changes, muscle soreness, or hormonal cycles frequently masks ongoing fat loss.
          </li>
          <li>
            <strong className="text-slate-900 dark:text-white">Act and make a small adjustment when the trend stays flat:</strong> If your 7-day weekly average weight and waist measurement remain unchanged across several consecutive weeks, review your food logging accuracy and make a small adjustment to your daily calorie intake or daily walking activity to restart steady progress.
          </li>
        </ul>
      </section>
    </article>
  );
};
