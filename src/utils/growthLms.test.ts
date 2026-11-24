import test from 'node:test';
import assert from 'node:assert/strict';
import {
  weightForAgePercentile,
  getWeightForAgeLms,
  lmsZScore,
  normalCdf,
  weightAtZ,
  REFERENCE_Z
} from './growthLms';

// Reference points are published percentile weights. Feeding a published
// P3 / P50 / P97 weight back into the calculator must return ~3 / ~50 / ~97.
// WHO points come from the WHO Child Growth Standards weight-for-age tables
// (3rd/50th/97th values as published); CDC points come from the CDC 2000
// weight-for-age data file itself (its P3/P50/P97 columns).

test('WHO boys 12 months: median weight is the 50th percentile', () => {
  const r = weightForAgePercentile('male', 12, 9.6479);
  assert.ok(Math.abs(r.percentile - 50) < 0.5, `got ${r.percentile}`);
  assert.equal(r.lms.source, 'WHO');
});

test('WHO boys 12 months: published 3rd and 97th weights reproduce', () => {
  const p3 = weightForAgePercentile('male', 12, 7.85);
  const p97 = weightForAgePercentile('male', 12, 11.83);
  assert.ok(Math.abs(p3.percentile - 3) < 0.6, `P3 got ${p3.percentile}`);
  assert.ok(Math.abs(p97.percentile - 97) < 0.6, `P97 got ${p97.percentile}`);
});

test('WHO girls 6 months: median weight is the 50th percentile', () => {
  const r = weightForAgePercentile('female', 6, 7.297);
  assert.ok(Math.abs(r.percentile - 50) < 0.5, `got ${r.percentile}`);
  assert.equal(r.lms.source, 'WHO');
});

test('WHO girls 6 months: published 3rd and 97th weights reproduce', () => {
  const p3 = weightForAgePercentile('female', 6, 5.81);
  const p97 = weightForAgePercentile('female', 6, 9.2);
  assert.ok(Math.abs(p3.percentile - 3) < 0.6, `P3 got ${p3.percentile}`);
  assert.ok(Math.abs(p97.percentile - 97) < 0.6, `P97 got ${p97.percentile}`);
});

test('CDC boys 24 months: median weight is the 50th percentile', () => {
  const r = weightForAgePercentile('male', 24, 12.6707633);
  assert.ok(Math.abs(r.percentile - 50) < 0.5, `got ${r.percentile}`);
  assert.equal(r.lms.source, 'CDC');
});

test('CDC boys 24 months: published 3rd and 97th weights reproduce', () => {
  const p3 = weightForAgePercentile('male', 24, 10.38209025);
  const p97 = weightForAgePercentile('male', 24, 15.59648294);
  assert.ok(Math.abs(p3.percentile - 3) < 0.6, `P3 got ${p3.percentile}`);
  assert.ok(Math.abs(p97.percentile - 97) < 0.6, `P97 got ${p97.percentile}`);
});

test('CDC girls 60 months: published 3rd and 97th weights reproduce', () => {
  const p3 = weightForAgePercentile('female', 60, 14.34277271);
  const p97 = weightForAgePercentile('female', 60, 24.94401317);
  assert.ok(Math.abs(p3.percentile - 3) < 0.6, `P3 got ${p3.percentile}`);
  assert.ok(Math.abs(p97.percentile - 97) < 0.6, `P97 got ${p97.percentile}`);
});

test('inverse: weightAtZ at the 3rd/50th/97th z-scores returns the published weights', () => {
  const lms = getWeightForAgeLms('male', 12);
  assert.ok(Math.abs(weightAtZ(lms.l, lms.m, lms.s, REFERENCE_Z.p3) - 7.85) < 0.05);
  assert.ok(Math.abs(weightAtZ(lms.l, lms.m, lms.s, REFERENCE_Z.p50) - 9.6479) < 0.01);
  assert.ok(Math.abs(weightAtZ(lms.l, lms.m, lms.s, REFERENCE_Z.p97) - 11.83) < 0.05);
});

test('normal CDF sanity: 0 -> 50, 1.645 -> ~95, -1.645 -> ~5', () => {
  assert.ok(Math.abs(normalCdf(0) * 100 - 50) < 0.01);
  assert.ok(Math.abs(normalCdf(1.644853627) * 100 - 95) < 0.05);
  assert.ok(Math.abs(normalCdf(-1.644853627) * 100 - 5) < 0.05);
});

test('z-score is 0 at the median weight', () => {
  const lms = getWeightForAgeLms('female', 12);
  assert.ok(Math.abs(lmsZScore(lms.l, lms.m, lms.s, lms.m)) < 1e-9);
});

test('reference switches from WHO to CDC at 24 months', () => {
  assert.equal(getWeightForAgeLms('male', 23.9).source, 'WHO');
  assert.equal(getWeightForAgeLms('male', 24).source, 'CDC');
  assert.equal(getWeightForAgeLms('female', 60).source, 'CDC');
});
