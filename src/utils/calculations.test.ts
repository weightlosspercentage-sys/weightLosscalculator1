import test from 'node:test';
import assert from 'node:assert/strict';
import {
  convertToLbs,
  convertFromLbs,
  lbsToStonesAndPounds,
  stonesAndPoundsToLbs,
  calculateBmi,
  getBmiCategory,
  calculateWeightLossResult,
  getMilestoneProgress
} from './calculations';
import { ALL_SEARCHABLE_TOOLS, searchTools } from './toolSearch';

test('unit conversions between lbs, kg, and stones work accurately', () => {
  assert.equal(Math.round(convertToLbs(100, 'kg')), 220);
  assert.equal(convertToLbs(5, 'st', 10), 145);
  assert.equal(convertFromLbs(220.462262185, 'kg'), 100);
  assert.deepEqual(lbsToStonesAndPounds(145), { stones: 10, pounds: 5 });
  assert.equal(stonesAndPoundsToLbs(10, 5), 145);
});

test('BMI calculation and category classification work properly', () => {
  const bmi = calculateBmi(70, 1.75);
  assert.equal(bmi, 22.9);
  assert.equal(getBmiCategory(bmi).label, 'Normal weight');
  assert.equal(getBmiCategory(17.2).label, 'Underweight');
  assert.equal(getBmiCategory(28.4).label, 'Overweight');
  assert.equal(getBmiCategory(32.1).label, 'Obese (Class I)');
});

test('weight loss percentage calculation produces clinical accuracy', () => {
  const res = calculateWeightLossResult(
    215,
    193.5,
    175,
    'lbs',
    '2026-08-01',
    '2026-11-01',
    { unit: 'ft_in', feet: 5, inches: 10 }
  );
  assert.ok(res);
  assert.equal(res.isLoss, true);
  assert.equal(res.weightChange, 21.5);
  assert.equal(res.percentChange, 10);
  assert.equal(res.remainingToGoal, 18.5);
  assert.equal(res.percentGoalAchieved, 53.8);
});

test('clinical milestone progress flags 5% and 10% landmarks accurately', () => {
  const milestones = getMilestoneProgress(200, 180, 'lbs');
  assert.equal(milestones.length, 4);
  assert.equal(milestones[0].percentage, 5);
  assert.equal(milestones[0].isAchieved, true);
  assert.equal(milestones[1].percentage, 10);
  assert.equal(milestones[1].isAchieved, true);
  assert.equal(milestones[2].percentage, 15);
  assert.equal(milestones[2].isAchieved, false);
});

test('toolSearch indexes all 24 calculators and guides and ranks relevant results', () => {
  assert.equal(ALL_SEARCHABLE_TOOLS.length, 24);
  assert.equal(searchTools('').length, 24);

  const newbornMatches = searchTools('newborn');
  assert.ok(newbornMatches.length >= 2);
  assert.equal(newbornMatches[0].id, 'newborn');

  const sleeveMatches = searchTools('gastric sleeve');
  assert.ok(sleeveMatches.some((item) => item.id === 'gastric-bypass'));

  const ketoMatches = searchTools('keto');
  assert.equal(ketoMatches[0].id, 'keto');
});

