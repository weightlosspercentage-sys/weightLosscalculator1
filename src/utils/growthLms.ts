/**
 * Weight-for-age LMS parameters (WHO + CDC) for the baby weight percentile
 * calculator.
 *
 * Sources (values reproduced exactly as published, no rounding or smoothing):
 * - Birth to 24 months: WHO Child Growth Standards (2006), weight-for-age.
 *   The CDC and the American Academy of Pediatrics recommend the WHO
 *   standards for infants from birth to 24 months in the United States.
 * - 24 to 60 months: CDC 2000 Growth Charts, weight-for-age, 2 to 20 years.
 *   Values read from the CDC data file
 *   https://www.cdc.gov/growthcharts/data/zscore/wtage.csv
 *   (columns Sex, Agemos, L, M, S). The CDC and AAP recommend the CDC
 *   charts for children aged 2 years and older.
 *
 * Method: the LMS method. For a weight X at a given age and sex, the
 * z-score is z = ((X / M)^L - 1) / (L * S) when L != 0, and
 * z = ln(X / M) / S when L == 0. The percentile is the standard normal
 * cumulative distribution of z. Between tabulated ages the L, M and S
 * values are linearly interpolated. At 24 months the reference switches
 * from WHO to CDC, following the CDC/AAP age recommendation.
 */

export type BabySex = 'female' | 'male';

export type LmsTriple = { l: number; m: number; s: number; source: 'WHO' | 'CDC' };

// WHO weight-for-age LMS, 0-24 months. Each row: [ageMonths, L, M, S].
const WHO_GIRLS: Array<[number, number, number, number]> = [
  [0, 0.3809, 3.2322, 0.14171],
  [1, 0.1714, 4.1873, 0.13724],
  [2, 0.0962, 5.1282, 0.13],
  [3, 0.0402, 5.8458, 0.12619],
  [4, -0.005, 6.4237, 0.12402],
  [5, -0.043, 6.8985, 0.12274],
  [6, -0.0756, 7.297, 0.12204],
  [7, -0.1039, 7.6422, 0.12178],
  [8, -0.1288, 7.9487, 0.12181],
  [9, -0.1507, 8.2254, 0.12199],
  [10, -0.17, 8.48, 0.12223],
  [11, -0.1872, 8.7192, 0.12247],
  [12, -0.2024, 8.9481, 0.12268],
  [13, -0.2158, 9.1699, 0.12283],
  [14, -0.2278, 9.387, 0.12294],
  [15, -0.2384, 9.6008, 0.12299],
  [16, -0.2478, 9.8124, 0.12303],
  [17, -0.2562, 10.0226, 0.12306],
  [18, -0.2637, 10.2315, 0.12309],
  [19, -0.2703, 10.4393, 0.12315],
  [20, -0.2762, 10.6464, 0.12323],
  [21, -0.2815, 10.8534, 0.12335],
  [22, -0.2862, 11.0608, 0.1235],
  [23, -0.2903, 11.2688, 0.12369],
  [24, -0.2941, 11.4775, 0.1239]
];

// WHO weight-for-age LMS, 0-24 months. Each row: [ageMonths, L, M, S].
const WHO_BOYS: Array<[number, number, number, number]> = [
  [0, 0.3487, 3.3464, 0.14602],
  [1, 0.2297, 4.4709, 0.13395],
  [2, 0.197, 5.5675, 0.12385],
  [3, 0.1738, 6.3762, 0.11727],
  [4, 0.1553, 7.0023, 0.11316],
  [5, 0.1395, 7.5105, 0.1108],
  [6, 0.1257, 7.934, 0.10958],
  [7, 0.1134, 8.297, 0.10902],
  [8, 0.1021, 8.6151, 0.10882],
  [9, 0.0917, 8.9014, 0.10881],
  [10, 0.082, 9.1649, 0.10891],
  [11, 0.073, 9.4122, 0.10906],
  [12, 0.0644, 9.6479, 0.10925],
  [13, 0.0563, 9.8749, 0.10949],
  [14, 0.0487, 10.0953, 0.10976],
  [15, 0.0413, 10.3108, 0.11007],
  [16, 0.0343, 10.5228, 0.11041],
  [17, 0.0275, 10.7319, 0.11079],
  [18, 0.0211, 10.9385, 0.11119],
  [19, 0.0148, 11.143, 0.11164],
  [20, 0.0087, 11.3462, 0.11211],
  [21, 0.0029, 11.5486, 0.11261],
  [22, -0.0028, 11.7504, 0.11314],
  [23, -0.0083, 11.9514, 0.11369],
  [24, -0.0137, 12.1515, 0.11426]
];

// CDC weight-for-age LMS, 24-60.5 months. Each row: [ageMonths, L, M, S].
// Age is the CDC half-month point (24.5 covers 24.0-24.99 months); the row
// at 24 is the value at exactly 24 months.
const CDC_GIRLS: Array<[number, number, number, number]> = [
  [24, -0.73533951, 12.05503983, 0.107399495],
  [24.5, -0.75220657, 12.13455523, 0.107740345],
  [25.5, -0.78423366, 12.2910249, 0.10847701],
  [26.5, -0.81409582, 12.44469258, 0.109280828],
  [27.5, -0.841935504, 12.59622335, 0.110144488],
  [28.5, -0.867889398, 12.74620911, 0.111060815],
  [29.5, -0.892102647, 12.89517218, 0.112022759],
  [30.5, -0.914718817, 13.04357164, 0.113023467],
  [31.5, -0.935876584, 13.19180874, 0.114056328],
  [32.5, -0.955723447, 13.34022934, 0.115114953],
  [33.5, -0.974383363, 13.48913319, 0.116193327],
  [34.5, -0.991980756, 13.63877446, 0.11728575],
  [35.5, -1.008640742, 13.78936547, 0.118386848],
  [36.5, -1.024471278, 13.94108332, 0.119491669],
  [37.5, -1.039573604, 14.09407175, 0.120595658],
  [38.5, -1.054039479, 14.24844498, 0.121694676],
  [39.5, -1.067946784, 14.40429169, 0.12278503],
  [40.5, -1.081374153, 14.56167529, 0.1238634],
  [41.5, -1.094381409, 14.72064045, 0.124926943],
  [42.5, -1.107021613, 14.88121352, 0.125973221],
  [43.5, -1.119338692, 15.04340553, 0.127000212],
  [44.5, -1.131367831, 15.20721443, 0.128006292],
  [45.5, -1.143135936, 15.37262729, 0.128990225],
  [46.5, -1.15466215, 15.53962221, 0.129951143],
  [47.5, -1.165958392, 15.70817017, 0.130888527],
  [48.5, -1.177029925, 15.87823668, 0.131802186],
  [49.5, -1.187871001, 16.04978452, 0.132692269],
  [50.5, -1.198484073, 16.2227706, 0.133559108],
  [51.5, -1.208853947, 16.39715363, 0.134403386],
  [52.5, -1.218965087, 16.57289122, 0.13522599],
  [53.5, -1.228798212, 16.74994187, 0.136028014],
  [54.5, -1.238330855, 16.92826587, 0.136810739],
  [55.5, -1.247537914, 17.10782615, 0.137575606],
  [56.5, -1.256392179, 17.28858894, 0.138324193],
  [57.5, -1.264864846, 17.47052444, 0.139058192],
  [58.5, -1.272926011, 17.65360733, 0.139779387],
  [59.5, -1.28054514, 17.83781722, 0.140489635],
  [60.5, -1.287691525, 18.02313904, 0.141190842]
];

// CDC weight-for-age LMS, 24-60.5 months. Each row: [ageMonths, L, M, S].
const CDC_BOYS: Array<[number, number, number, number]> = [
  [24, -0.20615245, 12.6707633, 0.108125811],
  [24.5, -0.216501213, 12.74154396, 0.108166006],
  [25.5, -0.239790488, 12.88102276, 0.108274706],
  [26.5, -0.266315853, 13.01842382, 0.108421025],
  [27.5, -0.295754969, 13.1544966, 0.10860477],
  [28.5, -0.327729368, 13.28989667, 0.108825681],
  [29.5, -0.361817468, 13.42519408, 0.109083424],
  [30.5, -0.397568087, 13.56088113, 0.109377581],
  [31.5, -0.434520252, 13.69737858, 0.109707646],
  [32.5, -0.472188756, 13.83504622, 0.110073084],
  [33.5, -0.510116627, 13.97418299, 0.110473254],
  [34.5, -0.547885579, 14.1150324, 0.1109074],
  [35.5, -0.58507011, 14.25779618, 0.111374787],
  [36.5, -0.621319726, 14.40262749, 0.111874514],
  [37.5, -0.656295986, 14.54964614, 0.112405687],
  [38.5, -0.689735029, 14.69893326, 0.112967254],
  [39.5, -0.721410388, 14.85054151, 0.11355811],
  [40.5, -0.751175223, 15.00449143, 0.114176956],
  [41.5, -0.778904279, 15.16078454, 0.114822482],
  [42.5, -0.804515498, 15.31940246, 0.115493292],
  [43.5, -0.828003255, 15.48030313, 0.116187777],
  [44.5, -0.849380372, 15.64343309, 0.116904306],
  [45.5, -0.86869965, 15.80872535, 0.117641148],
  [46.5, -0.886033992, 15.97610456, 0.118396541],
  [47.5, -0.901507878, 16.14548194, 0.119168555],
  [48.5, -0.915241589, 16.31676727, 0.11995532],
  [49.5, -0.927377772, 16.4898646, 0.120754916],
  [50.5, -0.938069819, 16.66467529, 0.121565421],
  [51.5, -0.94747794, 16.84109948, 0.122384927],
  [52.5, -0.955765694, 17.01903746, 0.123211562],
  [53.5, -0.963096972, 17.1983908, 0.124043503],
  [54.5, -0.969633434, 17.37906341, 0.124878992],
  [55.5, -0.975532355, 17.56096245, 0.125716348],
  [56.5, -0.980937915, 17.74400082, 0.126554022],
  [57.5, -0.986006518, 17.92809121, 0.127390453],
  [58.5, -0.99086694, 18.11315625, 0.128224294],
  [59.5, -0.995644402, 18.29912286, 0.129054277],
  [60.5, -1.000453886, 18.48592413, 0.129879257]
];

export const MAX_PERCENTILE_AGE_MONTHS = 60;

function interpolate(
  table: Array<[number, number, number, number]>,
  ageMonths: number
): { l: number; m: number; s: number } {
  const first = table[0];
  const last = table[table.length - 1];
  if (ageMonths <= first[0]) return { l: first[1], m: first[2], s: first[3] };
  if (ageMonths >= last[0]) return { l: last[1], m: last[2], s: last[3] };
  for (let i = 0; i < table.length - 1; i++) {
    const a = table[i];
    const b = table[i + 1];
    if (ageMonths >= a[0] && ageMonths <= b[0]) {
      const t = (ageMonths - a[0]) / (b[0] - a[0]);
      return {
        l: a[1] + (b[1] - a[1]) * t,
        m: a[2] + (b[2] - a[2]) * t,
        s: a[3] + (b[3] - a[3]) * t
      };
    }
  }
  return { l: last[1], m: last[2], s: last[3] };
}

/** LMS triple for a sex and age in months (0-60). WHO below 24 months, CDC at 24 and above. */
export function getWeightForAgeLms(sex: BabySex, ageMonths: number): LmsTriple {
  const age = Math.max(0, Math.min(MAX_PERCENTILE_AGE_MONTHS, ageMonths));
  if (age < 24) {
    const v = interpolate(sex === 'male' ? WHO_BOYS : WHO_GIRLS, age);
    return { ...v, source: 'WHO' };
  }
  const v = interpolate(sex === 'male' ? CDC_BOYS : CDC_GIRLS, age);
  return { ...v, source: 'CDC' };
}

/** z-score for a weight in kg from an LMS triple. */
export function lmsZScore(l: number, m: number, s: number, weightKg: number): number {
  if (weightKg <= 0 || m <= 0 || s <= 0) return NaN;
  if (l === 0) return Math.log(weightKg / m) / s;
  return (Math.pow(weightKg / m, l) - 1) / (l * s);
}

/** Standard normal cumulative distribution function. */
export function normalCdf(z: number): number {
  if (!Number.isFinite(z)) return NaN;
  // Abramowitz and Stegun 7.1.26 (error-function approximation).
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z) / Math.SQRT2;
  const t = 1 / (1 + 0.3275911 * x);
  const erf =
    1 -
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-x * x);
  return 0.5 * (1 + sign * erf);
}

/** Weight in kg at a given z-score from an LMS triple (inverse of lmsZScore). */
export function weightAtZ(l: number, m: number, s: number, z: number): number {
  if (l === 0) return m * Math.exp(s * z);
  return m * Math.pow(1 + l * s * z, 1 / l);
}

/** z-scores for the standard reference percentiles. */
export const REFERENCE_Z = {
  p3: -1.880793608,
  p5: -1.644853627,
  p50: 0,
  p95: 1.644853627,
  p97: 1.880793608
} as const;

export type PercentileBand = 'below' | 'typical' | 'above';

/**
 * Plain-language band for a weight percentile. The typical range is the
 * 5th to 95th percentile; below the 5th is below the typical range and
 * above the 95th is above the typical range.
 */
export function percentileBand(percentile: number): PercentileBand {
  if (percentile < 5) return 'below';
  if (percentile > 95) return 'above';
  return 'typical';
}

export function percentileBandLabel(band: PercentileBand): string {
  if (band === 'below') return 'below the typical range';
  if (band === 'above') return 'above the typical range';
  return 'within the typical range';
}

/** Full percentile result for a baby's weight at an age and sex. */
export function weightForAgePercentile(
  sex: BabySex,
  ageMonths: number,
  weightKg: number
): {
  percentile: number;
  zScore: number;
  lms: LmsTriple;
  band: PercentileBand;
  medianKg: number;
  p3Kg: number;
  p5Kg: number;
  p95Kg: number;
  p97Kg: number;
} {
  const lms = getWeightForAgeLms(sex, ageMonths);
  const z = lmsZScore(lms.l, lms.m, lms.s, weightKg);
  const percentile = normalCdf(z) * 100;
  return {
    percentile,
    zScore: z,
    lms,
    band: percentileBand(percentile),
    medianKg: lms.m,
    p3Kg: weightAtZ(lms.l, lms.m, lms.s, REFERENCE_Z.p3),
    p5Kg: weightAtZ(lms.l, lms.m, lms.s, REFERENCE_Z.p5),
    p95Kg: weightAtZ(lms.l, lms.m, lms.s, REFERENCE_Z.p95),
    p97Kg: weightAtZ(lms.l, lms.m, lms.s, REFERENCE_Z.p97)
  };
}
