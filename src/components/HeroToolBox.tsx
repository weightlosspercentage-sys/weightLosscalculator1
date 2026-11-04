import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import {
  Download,
  FileText,
  Sparkles,
  Baby,
  Scale,
  Flame,
  Utensils,
  Award,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Minus,
  Plus,
  Printer
} from 'lucide-react';

import { LOCALE_TRANSLATIONS } from '../data/localeStrings';

export type ToolMode = 'adult' | 'newborn' | 'bmr' | 'subway';

interface HeroToolBoxProps {
  externalMode?: ToolMode;
  onModeChange?: (m: ToolMode) => void;
  locale?: string;
}

export const HeroToolBox: React.FC<HeroToolBoxProps> = ({
  externalMode,
  onModeChange,
  locale = 'en'
}) => {
  const t = LOCALE_TRANSLATIONS[locale] || LOCALE_TRANSLATIONS.en;
  const [internalMode, setInternalMode] = useState<ToolMode>('adult');
  const mode = externalMode ?? internalMode;

  const setMode = (m: ToolMode) => {
    setInternalMode(m);
    if (onModeChange) onModeChange(m);
  };

  const [unit, setUnit] = useState<'lbs' | 'kg'>('lbs');

  // Adult inputs
  const [adultStart, setAdultStart] = useState<string>('215');
  const [adultCurrent, setAdultCurrent] = useState<string>('193.5');
  const [adultGoal, setAdultGoal] = useState<string>('175');

  // Newborn inputs
  const [babyUnit, setBabyUnit] = useState<'lbs_oz' | 'grams'>('lbs_oz');
  const [birthLbs, setBirthLbs] = useState<string>('8');
  const [birthOz, setBirthOz] = useState<string>('4');
  const [currentLbs, setCurrentLbs] = useState<string>('7');
  const [currentOz, setCurrentOz] = useState<string>('10');
  const [birthGrams, setBirthGrams] = useState<string>('3750');
  const [currentGrams, setCurrentGrams] = useState<string>('3450');
  const [babyHoursOld, setBabyHoursOld] = useState<string>('48');

  // BMR & Calorie inputs
  const [age, setAge] = useState<string>('34');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [heightInches, setHeightInches] = useState<string>('66');
  const [activityFactor, setActivityFactor] = useState<string>('1.375');

  // Fast food / Subway macro quick inputs
  const [subwaySize, setSubwaySize] = useState<'six_inch' | 'footlong'>('six_inch');
  const [subwayBread, setSubwayBread] = useState<number>(200);
  const [subwayMeat, setSubwayMeat] = useState<number>(180);
  const [subwayCheese, setSubwayCheese] = useState<number>(50);
  const [subwaySauce, setSubwaySauce] = useState<number>(100);

  const [copied, setCopied] = useState<boolean>(false);
  const [pdfDownloaded, setPdfDownloaded] = useState<boolean>(false);

  // Stepper helper for mobile touch convenience
  const stepValue = (
    currentStr: string,
    setter: React.Dispatch<React.SetStateAction<string>>,
    delta: number,
    min = 1
  ) => {
    const val = parseFloat(currentStr) || 0;
    const next = Math.max(min, +(val + delta).toFixed(1));
    setter(String(next));
  };

  // Adult calculation
  const sWeight = parseFloat(adultStart) || 0;
  const cWeight = parseFloat(adultCurrent) || 0;
  const gWeight = parseFloat(adultGoal) || 0;
  const adultLost = sWeight > 0 ? sWeight - cWeight : 0;
  const adultPct = sWeight > 0 ? +((adultLost / sWeight) * 100).toFixed(2) : 0;
  const isLoss = adultLost > 0;

  // Newborn calculation
  let newbornLossPct = 0;
  let newbornGramsLost = 0;
  let birthGramsTotal = 0;
  let currentGramsTotal = 0;

  if (babyUnit === 'lbs_oz') {
    const bTotalOz = (parseFloat(birthLbs) || 0) * 16 + (parseFloat(birthOz) || 0);
    const cTotalOz = (parseFloat(currentLbs) || 0) * 16 + (parseFloat(currentOz) || 0);
    birthGramsTotal = Math.round(bTotalOz * 28.3495);
    currentGramsTotal = Math.round(cTotalOz * 28.3495);
    if (bTotalOz > 0) {
      newbornLossPct = +(((bTotalOz - cTotalOz) / bTotalOz) * 100).toFixed(2);
      newbornGramsLost = birthGramsTotal - currentGramsTotal;
    }
  } else {
    birthGramsTotal = parseFloat(birthGrams) || 0;
    currentGramsTotal = parseFloat(currentGrams) || 0;
    if (birthGramsTotal > 0) {
      newbornLossPct = +(((birthGramsTotal - currentGramsTotal) / birthGramsTotal) * 100).toFixed(2);
      newbornGramsLost = birthGramsTotal - currentGramsTotal;
    }
  }

  // BMR calculation (Mifflin-St Jeor)
  const weightKg = unit === 'kg' ? cWeight : cWeight * 0.453592;
  const heightCm = (parseFloat(heightInches) || 66) * 2.54;
  const ageVal = parseFloat(age) || 30;
  let calculatedBmr = 0;
  if (gender === 'male') {
    calculatedBmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageVal + 5);
  } else {
    calculatedBmr = Math.round(10 * weightKg + 6.25 * heightCm - 5 * ageVal - 161);
  }
  const calculatedTdee = Math.round(calculatedBmr * (parseFloat(activityFactor) || 1.2));

  // Subway calculation
  const multiplier = subwaySize === 'footlong' ? 2 : 1;
  const subwayTotalCalories = (subwayBread + subwayMeat + subwayCheese + subwaySauce) * multiplier;

  const triggerCelebration = () => {
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#ca3500', '#7334fd', '#4950fc', '#10b981', '#f59e0b']
    });
  };

  const downloadResult = () => {
    const dateStr = new Date().toISOString().split('T')[0];
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Top Brand Header Banner
    doc.setFillColor(25, 33, 52);
    doc.rect(0, 0, 210, 34, 'F');

    // Brand Badge [%]
    doc.setFillColor(115, 52, 253);
    doc.roundedRect(14, 8, 12, 12, 2.5, 2.5, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('%', 20, 16, { align: 'center' });

    // Brand Name & Subtitle
    doc.setFontSize(15);
    doc.setTextColor(255, 255, 255);
    doc.text('Weight Loss Percentage', 30, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text('Official Clinical & Metabolic Calculation Summary  |  https://www.weightlosspercentage.com/', 30, 20);

    // Date & Privacy Stamp
    doc.setFontSize(8.5);
    doc.setTextColor(167, 243, 208);
    doc.text(`Report Date: ${dateStr}   •   100% Client-Side Browser Calculation (Zero Server Data Storage)`, 14, 29);

    // Medical Review Governance Bar
    doc.setFillColor(245, 243, 255);
    doc.setDrawColor(221, 214, 254);
    doc.roundedRect(14, 40, 182, 18, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(76, 29, 149);
    doc.text('Medically Reviewed Protocol: Dr. Rekha Kumar, M.D., M.S.', 19, 47);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text(
      'Board-Certified Endocrinologist & ABOM Diplomate  |  Associate Professor of Clinical Medicine, Weill Cornell Medicine',
      19,
      53
    );

    let y = 68;

    if (mode === 'adult') {
      const goalPct =
        gWeight > 0 && sWeight !== gWeight
          ? Math.max(0, Math.min(100, +(((sWeight - cWeight) / (sWeight - gWeight)) * 100).toFixed(0)))
          : 0;
      const kcalEquivalent = Math.round(Math.abs(adultLost) * (unit === 'kg' ? 7700 : 3500));

      // Section Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text('1. Patient Weight Loss Percentage Summary', 14, y);
      y += 6;

      // Primary Hero Highlight Card
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(14, y, 182, 28, 2.5, 2.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('TOTAL BODY WEIGHT PERCENTAGE CHANGE', 20, y + 8);

      doc.setFontSize(22);
      doc.setTextColor(115, 52, 253);
      doc.text(`${isLoss ? `-${adultPct}%` : `+${adultPct}%`}`, 20, y + 20);

      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59);
      doc.text(
        `Net Weight Change: ${isLoss ? `-${adultLost.toFixed(1)}` : `+${Math.abs(adultLost).toFixed(1)}`} ${unit}`,
        78,
        y + 13
      );
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Formula: ((Starting Weight - Current Weight) / Starting Weight) × 100`,
        78,
        y + 21
      );
      y += 36;

      // Detailed Biometric Table
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('2. Recorded Anthropometric & Goal Metrics', 14, y);
      y += 5;

      const rows: [string, string][] = [
        ['Initial Starting Weight', `${sWeight.toFixed(1)} ${unit}`],
        ['Current Scale Weight', `${cWeight.toFixed(1)} ${unit}`],
        ['Net Weight Difference', `${isLoss ? `-${adultLost.toFixed(1)}` : `+${Math.abs(adultLost).toFixed(1)}`} ${unit}`],
        ['Percentage of Baseline Body Weight', `${isLoss ? `-${adultPct}%` : `+${adultPct}%`}`],
        ['Target Goal Weight', gWeight > 0 ? `${gWeight.toFixed(1)} ${unit}` : 'Not specified'],
        [
          'Remaining Weight to Goal',
          gWeight > 0 ? `${Math.max(0, cWeight - gWeight).toFixed(1)} ${unit} (${goalPct}% of goal achieved)` : 'N/A'
        ],
        ['Estimated Cumulative Energy Deficit', `${kcalEquivalent.toLocaleString()} kcal`]
      ];

      rows.forEach(([label, val], idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, y, 182, 8.5, 'F');
        }
        doc.setDrawColor(226, 232, 240);
        doc.line(14, y + 8.5, 196, y + 8.5);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        doc.text(label, 18, y + 5.8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(val, 192, y + 5.8, { align: 'right' });
        y += 8.5;
      });

      y += 10;

      // Clinical Milestones Evaluation
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text('3. Clinical Health Milestones Evaluation (AHA / ADA / NIH Look AHEAD)', 14, y);
      y += 6;

      const milestones = [
        {
          title: `5% Metabolic Landmark (${(sWeight * 0.95).toFixed(1)} ${unit})`,
          status: adultPct >= 5 ? 'ACHIEVED' : 'IN PROGRESS',
          desc: 'Clinically meaningful improvements in HbA1c, insulin sensitivity, and systolic blood pressure (~5 mmHg).'
        },
        {
          title: `10% Cardiovascular Landmark (${(sWeight * 0.90).toFixed(1)} ${unit})`,
          status: adultPct >= 10 ? 'ACHIEVED' : 'IN PROGRESS',
          desc: 'Significant visceral adipose reduction, lipid profile improvement, and sleep apnea symptom relief.'
        },
        {
          title: `15% Systemic Reset Landmark (${(sWeight * 0.85).toFixed(1)} ${unit})`,
          status: adultPct >= 15 ? 'ACHIEVED' : 'IN PROGRESS',
          desc: 'Major cardiovascular risk reduction and clinical remission markers in Type 2 Diabetes.'
        }
      ];

      milestones.forEach((m) => {
        doc.setFillColor(m.status === 'ACHIEVED' ? 236 : 248, m.status === 'ACHIEVED' ? 253 : 250, m.status === 'ACHIEVED' ? 245 : 252);
        doc.setDrawColor(m.status === 'ACHIEVED' ? 167 : 226, m.status === 'ACHIEVED' ? 243 : 232, m.status === 'ACHIEVED' ? 208 : 240);
        doc.roundedRect(14, y, 182, 15, 2, 2, 'FD');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(m.title, 18, y + 6);

        doc.setFontSize(8.5);
        doc.setTextColor(m.status === 'ACHIEVED' ? 5 : 100, m.status === 'ACHIEVED' ? 150 : 116, m.status === 'ACHIEVED' ? 105 : 139);
        doc.text(`[${m.status}]`, 192, y + 6, { align: 'right' });

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(m.desc, 18, y + 11.8);
        y += 18;
      });
    } else if (mode === 'newborn') {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text('1. Newborn Postnatal Weight Loss Summary (AAP Protocol)', 14, y);
      y += 6;

      doc.setFillColor(255, 247, 237);
      doc.setDrawColor(253, 186, 116);
      doc.roundedRect(14, y, 182, 26, 2.5, 2.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.setTextColor(202, 53, 0);
      doc.text(`-${newbornLossPct}%  (-${newbornGramsLost} g)`, 20, y + 14);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Birth Weight: ${birthGramsTotal} g   |   Current Weight: ${currentGramsTotal} g   |   Postnatal Age: ${babyHoursOld} hours`,
        20,
        y + 21
      );
      y += 34;

      const statusText =
        newbornLossPct < 7
          ? 'NORMAL (<7%): Within expected physiological neonatal fluid diuresis.'
          : newbornLossPct <= 10
          ? 'OBSERVATION (7% to 10%): Monitor feeding frequency, wet diapers, and lactation latch.'
          : 'PEDIATRIC ALERT (>10%): Exceeds 10% threshold. Immediate clinical & lactation evaluation recommended.';

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Clinical AAP Assessment:', 14, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.text(statusText, 14, y);
      y += 14;
    } else if (mode === 'bmr') {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text('1. Resting & Total Daily Energy Expenditure (Mifflin-St Jeor)', 14, y);
      y += 8;

      const bmrRows: [string, string][] = [
        ['Biological Profile', `Age: ${age} yrs  |  Sex: ${gender.toUpperCase()}  |  Height: ${heightInches} in`],
        ['Basal Metabolic Rate (BMR)', `${calculatedBmr} kcal / day`],
        ['Maintenance Total Daily Energy Expenditure (TDEE)', `${calculatedTdee} kcal / day`],
        ['Safe Weight Loss Target (-500 kcal/day ~ 1 lb/wk)', `${Math.max(1200, calculatedTdee - 500)} kcal / day`]
      ];

      bmrRows.forEach(([label, val], idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, y, 182, 9, 'F');
        }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.5);
        doc.setTextColor(51, 65, 85);
        doc.text(label, 18, y + 6);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(val, 192, y + 6, { align: 'right' });
        y += 9;
      });
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.setTextColor(15, 23, 42);
      doc.text('1. Subway Meal Nutrition & Calorie Summary', 14, y);
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(
        `Sandwich Portion: ${subwaySize === 'footlong' ? '12-Inch Footlong' : '6-Inch Sub'}   |   Total Meal Energy: ${subwayTotalCalories} kcal`,
        14,
        y
      );
    }

    // Bottom Clinical References & Medical Disclaimer Footer
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(14, 246, 182, 34, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text('Medical & Clinical Disclaimer (For Patient & Healthcare Provider Reference)', 18, 253);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(71, 85, 105);
    const disclaimerLines = doc.splitTextToSize(
      'This report is generated for educational and personal tracking purposes using peer-reviewed equations (Mifflin-St Jeor, AAP Neonatal Guidelines, NIH Look AHEAD). It does not constitute a formal medical diagnosis or clinical prescription. Always consult a board-certified physician, pediatrician, or registered dietitian before making nutritional or clinical decisions.',
      174
    );
    doc.text(disclaimerLines, 18, 258.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Weight Loss Percentage (weightlosspercentage.com)  •  Reviewed by Dr. Rekha Kumar, M.D., M.S.',
      105,
      276,
      { align: 'center' }
    );

    doc.save(`weight-loss-percentage-report-${dateStr}.pdf`);
    setPdfDownloaded(true);
    setTimeout(() => setPdfDownloaded(false), 2500);
  };

  const copySummary = () => {
    let summary = '';
    if (mode === 'adult') {
      summary = `Weight Loss: ${adultLost.toFixed(1)} ${unit} (${adultPct}%) | Start: ${sWeight} ${unit} | Current: ${cWeight} ${unit} via weightlosspercentage.com`;
    } else if (mode === 'newborn') {
      summary = `Newborn Weight Loss: ${newbornLossPct}% (${newbornGramsLost}g loss at ${babyHoursOld}h) via weightlosspercentage.com`;
    } else {
      summary = `BMR: ${calculatedBmr} kcal | TDEE: ${calculatedTdee} kcal via weightlosspercentage.com`;
    }
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="hero-tool-box relative w-full bg-[#fbfbfd] dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden transition-all duration-300">
      {/* Tool Topbar with Responsive Mode Selector Grid (2x2 on mobile, row on desktop) */}
      <div className="bg-gradient-to-r from-[#7334fd] via-[#4950fc] to-[#ca3500] p-1">
        <div className="bg-[#ffffff] dark:bg-slate-900 p-3 sm:px-6 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-t-[18px] sm:rounded-t-[22px] transition-colors">
          {/* Mode Switcher: 2x2 grid on mobile for easy 44px+ touch targets */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setMode('adult')}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center sm:justify-start gap-1.5 whitespace-nowrap ${
                mode === 'adult'
                  ? 'bg-[#7334fd] text-white shadow-md shadow-[#7334fd]/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300'
              }`}
            >
              <Scale className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.tabAdult}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('newborn')}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center sm:justify-start gap-1.5 whitespace-nowrap ${
                mode === 'newborn'
                  ? 'bg-[#ca3500] text-white shadow-md shadow-[#ca3500]/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300'
              }`}
            >
              <Baby className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.tabNewborn}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('bmr')}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center sm:justify-start gap-1.5 whitespace-nowrap ${
                mode === 'bmr'
                  ? 'bg-[#4950fc] text-white shadow-md shadow-[#4950fc]/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300'
              }`}
            >
              <Flame className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.tabBmr}</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('subway')}
              className={`min-h-[44px] px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center sm:justify-start gap-1.5 whitespace-nowrap ${
                mode === 'subway'
                  ? 'bg-[#ca5983] text-white shadow-md shadow-[#ca5983]/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 active:bg-slate-300'
              }`}
            >
              <Utensils className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.tabSubway}</span>
            </button>
          </div>

          {/* Unit Toggle for Adult/BMR */}
          {mode === 'adult' && (
            <div className="grid grid-cols-2 sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setUnit('lbs')}
                className={`min-h-[40px] sm:min-h-[34px] px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  unit === 'lbs' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.unitLbs}
              </button>
              <button
                type="button"
                onClick={() => setUnit('kg')}
                className={`min-h-[40px] sm:min-h-[34px] px-4 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  unit === 'kg' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {t.unitKg}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Tool Interactive Grid */}
      <div className="p-3.5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
        {/* LEFT COLUMN: Reactive Inputs & Mobile Touch Steppers */}
        <div className="lg:col-span-7 space-y-4">
          {/* Mobile Instant Live Result Strip (visible immediately above inputs on phone viewports) */}
          <div className="lg:hidden bg-gradient-to-r from-[#7334fd]/10 via-indigo-50/80 to-orange-50/70 dark:from-indigo-950/80 dark:via-slate-800 dark:to-slate-800 border border-indigo-200/80 dark:border-indigo-500/30 rounded-2xl p-3 flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {mode === 'adult'
                  ? 'Instant Weight Loss %'
                  : mode === 'newborn'
                  ? 'Newborn Loss %'
                  : mode === 'bmr'
                  ? 'Daily BMR / TDEE'
                  : 'Subway Meal Total'}
              </span>
              <div className="flex items-baseline gap-1.5 tabular-nums">
                {mode === 'adult' && (
                  <>
                    <span className="text-2xl font-black text-[#7334fd] dark:text-indigo-400">
                      {isLoss ? `-${adultPct}%` : `${adultPct}%`}
                    </span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      ({isLoss ? `-${adultLost.toFixed(1)}` : `+${Math.abs(adultLost).toFixed(1)}`} {unit})
                    </span>
                  </>
                )}
                {mode === 'newborn' && (
                  <>
                    <span className="text-2xl font-black text-[#ca3500] dark:text-orange-400">{newbornLossPct}%</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">(-{newbornGramsLost}g)</span>
                  </>
                )}
                {mode === 'bmr' && (
                  <>
                    <span className="text-xl font-black text-[#4950fc] dark:text-indigo-400">{calculatedBmr} kcal</span>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">/ {calculatedTdee} TDEE</span>
                  </>
                )}
                {mode === 'subway' && (
                  <span className="text-2xl font-black text-[#ca5983] dark:text-pink-400">{subwayTotalCalories} kcal</span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={downloadResult}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ca3500] to-[#7334fd] text-white font-bold text-xs shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.downloadReport}</span>
            </button>
          </div>

          {/* Quick-Win Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              {t.presetHeading}
            </span>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
              {mode === 'adult' && (
                <>
                  <button
                    type="button"
                    onClick={() => { setAdultStart('215'); setAdultCurrent('193.5'); setAdultGoal('175'); }}
                    className="min-h-[38px] px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#7334fd] dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 active:scale-98 font-bold text-xs border border-indigo-200/60 dark:border-indigo-500/40 transition-all whitespace-nowrap shrink-0"
                  >
                    10% Loss (215 → 193.5)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAdultStart('180'); setAdultCurrent('171'); setAdultGoal('155'); }}
                    className="min-h-[38px] px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:scale-98 font-bold text-xs border border-emerald-200 dark:border-emerald-500/40 transition-all whitespace-nowrap shrink-0"
                  >
                    5% Milestone (180 → 171)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAdultStart('260'); setAdultCurrent('221'); setAdultGoal('190'); }}
                    className="min-h-[38px] px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 active:scale-98 font-bold text-xs border border-amber-200 dark:border-amber-500/40 transition-all whitespace-nowrap shrink-0"
                  >
                    15% Loss (260 → 221)
                  </button>
                </>
              )}

              {mode === 'newborn' && (
                <>
                  <button
                    type="button"
                    onClick={() => { setBirthLbs('8'); setBirthOz('4'); setCurrentLbs('7'); setCurrentOz('10'); setBabyHoursOld('48'); }}
                    className="min-h-[38px] px-3 py-1 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-[#ca3500] dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/60 font-bold text-xs border border-orange-200 dark:border-orange-500/40 transition-colors whitespace-nowrap shrink-0"
                  >
                    Day 2 Example (7.6% drop)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setBirthLbs('7'); setBirthOz('8'); setCurrentLbs('6'); setCurrentOz('11'); setBabyHoursOld('72'); }}
                    className="min-h-[38px] px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-bold text-xs border border-rose-200 dark:border-rose-500/40 transition-colors whitespace-nowrap shrink-0"
                  >
                    Over 10% Check (10.8% drop)
                  </button>
                </>
              )}
            </div>
          </div>

          {/* MODE 1: ADULT WEIGHT LOSS PERCENTAGE */}
          {mode === 'adult' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Starting Weight with Touch Stepper */}
                <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-2xs">
                  <label htmlFor="adult-start-input" className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                    {t.startWeightLabel} ({unit})
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => stepValue(adultStart, setAdultStart, -1)}
                      aria-label="Decrease starting weight"
                      className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 flex items-center justify-center text-slate-700 dark:text-slate-100 shrink-0 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="relative flex-1">
                      <input
                        id="adult-start-input"
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        value={adultStart}
                        onChange={(e) => setAdultStart(e.target.value)}
                        placeholder="215"
                        className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-center text-lg font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7334fd] focus:bg-white dark:focus:bg-slate-950 tabular-nums"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => stepValue(adultStart, setAdultStart, 1)}
                      aria-label="Increase starting weight"
                      className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 flex items-center justify-center text-slate-700 dark:text-slate-100 shrink-0 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Current Weight with Touch Stepper */}
                <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-2xs">
                  <label htmlFor="adult-current-input" className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                    {t.currentWeightLabel} ({unit})
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => stepValue(adultCurrent, setAdultCurrent, -0.5)}
                      aria-label="Decrease current weight"
                      className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 flex items-center justify-center text-slate-700 dark:text-slate-100 shrink-0 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="relative flex-1">
                      <input
                        id="adult-current-input"
                        type="number"
                        inputMode="decimal"
                        step="0.1"
                        value={adultCurrent}
                        onChange={(e) => setAdultCurrent(e.target.value)}
                        placeholder="193.5"
                        className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-center text-lg font-extrabold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#7334fd] focus:bg-white dark:focus:bg-slate-950 tabular-nums"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => stepValue(adultCurrent, setAdultCurrent, 0.5)}
                      aria-label="Increase current weight"
                      className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 flex items-center justify-center text-slate-700 dark:text-slate-100 shrink-0 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Empathetic, Humanized Inline Input Validation & Guidance Banner */}
              {(sWeight <= 0 || cWeight <= 0) ? (
                <div
                  role="status"
                  data-testid="input-feedback-banner"
                  className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/40 text-amber-950 dark:text-amber-100 text-xs flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    Please enter a starting weight and current weight above 0 {unit} so we can calculate your percentage change right away.
                  </span>
                </div>
              ) : (sWeight > 1200 || cWeight > 1200) ? (
                <div
                  role="status"
                  data-testid="input-feedback-banner"
                  className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-500/40 text-amber-950 dark:text-amber-100 text-xs flex items-start gap-2"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    That weight is over 1,200 {unit}. Double-check your digits or make sure you have the right unit ({unit}) selected above!
                  </span>
                </div>
              ) : cWeight > sWeight ? (
                <div
                  role="status"
                  data-testid="input-feedback-banner"
                  className="p-3 rounded-xl bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-500/40 text-indigo-950 dark:text-indigo-100 text-xs flex items-start justify-between gap-3"
                >
                  <span>
                    Your current weight is <strong>{Math.abs(adultLost).toFixed(1)} {unit} higher</strong> than your starting weight (a <strong>+{Math.abs(adultPct)}% weight gain</strong>). If you meant to calculate weight loss, swap the two numbers.
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const prevStart = adultStart;
                      setAdultStart(adultCurrent);
                      setAdultCurrent(prevStart);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#7334fd] text-white font-bold text-[11px] shrink-0 hover:opacity-95 cursor-pointer"
                  >
                    {t.swapWeightsBtn}
                  </button>
                </div>
              ) : null}

              {/* Target Goal Weight with Touch Stepper */}
              <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-2xs">
                <label htmlFor="adult-goal-input" className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2">
                  {t.goalWeightLabel} ({unit}) <span className="text-slate-400 dark:text-slate-400 font-normal">{t.optionalLabel}</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => stepValue(adultGoal, setAdultGoal, -1)}
                    aria-label="Decrease goal weight"
                    className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 flex items-center justify-center text-slate-700 dark:text-slate-100 shrink-0 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    id="adult-goal-input"
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={adultGoal}
                    onChange={(e) => setAdultGoal(e.target.value)}
                    placeholder="175"
                    className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-center text-base font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#7334fd] focus:bg-white dark:focus:bg-slate-950 tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() => stepValue(adultGoal, setAdultGoal, 1)}
                    aria-label="Increase goal weight"
                    className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 active:bg-slate-300 flex items-center justify-center text-slate-700 dark:text-slate-100 shrink-0 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Formula Callout */}
              <div className="p-3 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-900 dark:text-white">{t.formulaLabel}</span>
                <span className="text-slate-500 dark:text-slate-400 text-[11px]">{t.worksInUnits}</span>
              </div>
            </div>
          )}

          {/* MODE 2: NEWBORN WEIGHT LOSS */}
          {mode === 'newborn' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setBabyUnit('lbs_oz')}
                  className={`min-h-[44px] px-3 py-2 rounded-xl font-bold transition-colors ${
                    babyUnit === 'lbs_oz' ? 'bg-[#ca3500] text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {t.lbsOzUnit}
                </button>
                <button
                  type="button"
                  onClick={() => setBabyUnit('grams')}
                  className={`min-h-[44px] px-3 py-2 rounded-xl font-bold transition-colors ${
                    babyUnit === 'grams' ? 'bg-[#ca3500] text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {t.gramsUnit}
                </button>
              </div>

              {babyUnit === 'lbs_oz' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-2">
                      {t.birthWeightLbsOz}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          aria-label="Birth weight pounds"
                          value={birthLbs}
                          onChange={(e) => setBirthLbs(e.target.value)}
                          className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-base font-bold text-slate-900 dark:text-white tabular-nums"
                          placeholder="lbs"
                        />
                        <span className="absolute right-2.5 top-3 text-xs text-slate-400 font-semibold">lbs</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="decimal"
                          aria-label="Birth weight ounces"
                          value={birthOz}
                          onChange={(e) => setBirthOz(e.target.value)}
                          className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-base font-bold text-slate-900 dark:text-white tabular-nums"
                          placeholder="oz"
                        />
                        <span className="absolute right-2.5 top-3 text-xs text-slate-400 font-semibold">oz</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-2">
                      {t.currentWeightLbsOz}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          aria-label="Current weight pounds"
                          value={currentLbs}
                          onChange={(e) => setCurrentLbs(e.target.value)}
                          className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-base font-bold text-slate-900 dark:text-white tabular-nums"
                          placeholder="lbs"
                        />
                        <span className="absolute right-2.5 top-3 text-xs text-slate-400 font-semibold">lbs</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="decimal"
                          aria-label="Current weight ounces"
                          value={currentOz}
                          onChange={(e) => setCurrentOz(e.target.value)}
                          className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-base font-bold text-slate-900 dark:text-white tabular-nums"
                          placeholder="oz"
                        />
                        <span className="absolute right-2.5 top-3 text-xs text-slate-400 font-semibold">oz</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <label htmlFor="birth-grams-input" className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-2">
                      {t.birthWeightGrams}
                    </label>
                    <input
                      id="birth-grams-input"
                      type="number"
                      inputMode="numeric"
                      value={birthGrams}
                      onChange={(e) => setBirthGrams(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-base font-bold text-slate-900 dark:text-white tabular-nums"
                      placeholder="3500"
                    />
                  </div>
                  <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    <label htmlFor="current-grams-input" className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-2">
                      {t.currentWeightGrams}
                    </label>
                    <input
                      id="current-grams-input"
                      type="number"
                      inputMode="numeric"
                      value={currentGrams}
                      onChange={(e) => setCurrentGrams(e.target.value)}
                      className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-base font-bold text-slate-900 dark:text-white tabular-nums"
                      placeholder="3250"
                    />
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label htmlFor="baby-hours-input" className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase mb-2">
                  {t.babyAgeHours}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    id="baby-hours-input"
                    type="number"
                    inputMode="numeric"
                    value={babyHoursOld}
                    onChange={(e) => setBabyHoursOld(e.target.value)}
                    className="w-32 h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-base font-bold text-slate-900 dark:text-white tabular-nums"
                    placeholder="48"
                  />
                  <div className="flex gap-1.5">
                    {['24', '48', '72', '96'].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setBabyHoursOld(h)}
                        className={`min-h-[40px] px-2.5 rounded-lg text-xs font-bold border ${
                          babyHoursOld === h
                            ? 'bg-orange-50 dark:bg-orange-950/70 border-[#ca3500] dark:border-orange-400 text-[#ca3500] dark:text-orange-300'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE 3: BMR & TDEE */}
          {mode === 'bmr' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label htmlFor="bmr-age-input" className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">{t.ageYearsLabel}</label>
                  <input
                    id="bmr-age-input"
                    type="number"
                    inputMode="numeric"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl font-bold text-base text-slate-900 dark:text-white tabular-nums"
                  />
                </div>
                <div className="bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label htmlFor="bmr-sex-select" className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">{t.sexLabel}</label>
                  <select
                    id="bmr-sex-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'female' | 'male')}
                    className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                  >
                    <option value="female">{t.femaleLabel}</option>
                    <option value="male">{t.maleLabel}</option>
                  </select>
                </div>
                <div className="bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label htmlFor="bmr-height-input" className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">{t.heightInchesLabel}</label>
                  <input
                    id="bmr-height-input"
                    type="number"
                    inputMode="numeric"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl font-bold text-base text-slate-900 dark:text-white tabular-nums"
                    placeholder="66"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                <label htmlFor="bmr-activity-select" className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">{t.activityLabel}</label>
                <select
                  id="bmr-activity-select"
                  value={activityFactor}
                  onChange={(e) => setActivityFactor(e.target.value)}
                  className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-900 dark:text-white"
                >
                  <option value="1.2">Sedentary (Desk work, minimal exercise)</option>
                  <option value="1.375">Light Activity (1-3 days/week exercise)</option>
                  <option value="1.55">Moderate Activity (3-5 days/week cycling/gym)</option>
                  <option value="1.725">Very Active (6-7 days intense training)</option>
                </select>
              </div>
            </div>
          )}

          {/* MODE 4: SUBWAY MACRO */}
          {mode === 'subway' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setSubwaySize('six_inch')}
                  className={`min-h-[44px] px-3 py-2 rounded-xl font-bold transition-colors ${
                    subwaySize === 'six_inch' ? 'bg-[#ca5983] text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  6-Inch Sub
                </button>
                <button
                  type="button"
                  onClick={() => setSubwaySize('footlong')}
                  className={`min-h-[44px] px-3 py-2 rounded-xl font-bold transition-colors ${
                    subwaySize === 'footlong' ? 'bg-[#ca5983] text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  Footlong (12-Inch)
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label htmlFor="subway-bread-select" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Bread Choice</label>
                  <select
                    id="subway-bread-select"
                    value={subwayBread}
                    onChange={(e) => setSubwayBread(Number(e.target.value))}
                    className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    <option value={200}>9-Grain Wheat (200 kcal)</option>
                    <option value={190}>Artisan Italian White (190 kcal)</option>
                    <option value={230}>Italian Herbs & Cheese (230 kcal)</option>
                  </select>
                </div>
                <div className="bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label htmlFor="subway-meat-select" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Protein Filling</label>
                  <select
                    id="subway-meat-select"
                    value={subwayMeat}
                    onChange={(e) => setSubwayMeat(Number(e.target.value))}
                    className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    <option value={110}>Oven Roasted Turkey (110 kcal)</option>
                    <option value={160}>Rotisserie Style Chicken (160 kcal)</option>
                    <option value={250}>Philly Steak (250 kcal)</option>
                    <option value={290}>Italian B.M.T. (290 kcal)</option>
                  </select>
                </div>
                <div className="bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label htmlFor="subway-cheese-select" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Cheese Option</label>
                  <select
                    id="subway-cheese-select"
                    value={subwayCheese}
                    onChange={(e) => setSubwayCheese(Number(e.target.value))}
                    className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    <option value={0}>No Cheese (0 kcal)</option>
                    <option value={40}>American Cheese (40 kcal)</option>
                    <option value={50}>Provolone (50 kcal)</option>
                    <option value={60}>Pepper Jack (60 kcal)</option>
                  </select>
                </div>
                <div className="bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <label htmlFor="subway-sauce-select" className="block font-bold text-slate-700 dark:text-slate-200 mb-1.5">Sauce / Dressing</label>
                  <select
                    id="subway-sauce-select"
                    value={subwaySauce}
                    onChange={(e) => setSubwaySauce(Number(e.target.value))}
                    className="w-full h-11 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    <option value={5}>Yellow Mustard (5 kcal)</option>
                    <option value={30}>Sweet Onion Teriyaki (30 kcal)</option>
                    <option value={60}>Honey Mustard (60 kcal)</option>
                    <option value={100}>Regular Mayonnaise (100 kcal)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Live Result Card & Download */}
        <div className="lg:col-span-5 relative bg-gradient-to-br from-white via-slate-50 to-indigo-50/30 dark:from-slate-800/95 dark:via-slate-900 dark:to-indigo-950/40 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/90 shadow-md flex flex-col justify-between space-y-5">
          {/* Floating Print / PDF Summary Action Button */}
          <button
            type="button"
            onClick={downloadResult}
            data-testid="floating-print-pdf-btn"
            aria-label="Print and download PDF summary"
            title="Generate and download a clean PDF summary of your results"
            className="absolute top-3.5 right-3.5 z-10 min-h-[38px] px-3 py-1.5 rounded-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-indigo-200/90 dark:border-indigo-500/40 text-[#7334fd] dark:text-indigo-300 hover:bg-[#7334fd] hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white hover:border-transparent shadow-md shadow-indigo-500/10 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-1.5 text-xs font-extrabold cursor-pointer"
          >
            {pdfDownloaded ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{t.savedPdf}</span>
              </>
            ) : (
              <>
                <Printer className="w-3.5 h-3.5 shrink-0" />
                <span>{t.printPdf}</span>
              </>
            )}
          </button>

          {/* Main Visual Stat */}
          {mode === 'adult' && (
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 block mb-1 pr-28">
                {t.resultHeadingAdult}
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className={`text-4xl sm:text-6xl font-black tracking-tight tabular-nums ${isLoss ? 'text-[#7334fd] dark:text-indigo-400' : 'text-slate-800 dark:text-white'}`}>
                  {isLoss ? `-${adultPct}%` : `${adultPct}%`}
                </span>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 tabular-nums">
                  ({isLoss ? `-${adultLost.toFixed(1)}` : `+${Math.abs(adultLost).toFixed(1)}`} {unit})
                </span>
              </div>

              {/* Progress to Goal */}
              {gWeight > 0 && sWeight !== gWeight && (
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                    <span>{t.goalLabel}: {gWeight} {unit}</span>
                    <span className="text-[#7334fd] dark:text-indigo-400 font-bold">
                      {Math.max(0, Math.min(100, +(((sWeight - cWeight) / (sWeight - gWeight)) * 100).toFixed(0)))}% {t.ofGoalLabel}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#7334fd] to-[#4950fc] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, ((sWeight - cWeight) / (sWeight - gWeight)) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Clinical Milestone Tag */}
              <div className="mt-4 p-3.5 bg-indigo-50/70 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-500/40 rounded-xl text-xs text-indigo-950 dark:text-indigo-100">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <Award className="w-4 h-4 text-[#7334fd] dark:text-indigo-400 shrink-0" />
                  <span>
                    {adultPct >= 15
                      ? t.milestone15
                      : adultPct >= 10
                      ? t.milestone10
                      : adultPct >= 5
                      ? t.milestone5
                      : t.milestoneNext5}
                  </span>
                </div>
                <p className="text-[11px] text-indigo-800 dark:text-indigo-200 leading-relaxed">
                  {t.milestoneDescReached}
                </p>
              </div>
            </div>
          )}

          {mode === 'newborn' && (
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 block mb-1 pr-28">
                {t.resultHeadingNewborn}
              </span>
              <div className="flex flex-wrap items-baseline gap-2">
                <span className={`text-4xl sm:text-5xl font-black tracking-tight tabular-nums ${newbornLossPct > 10 ? 'text-rose-600 dark:text-rose-400' : newbornLossPct >= 7 ? 'text-amber-600 dark:text-amber-400' : 'text-[#ca3500] dark:text-orange-400'}`}>
                  {newbornLossPct}%
                </span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 tabular-nums">
                  (-{newbornGramsLost} g, {babyHoursOld} {t.hoursOldSuffix})
                </span>
              </div>

              {/* AAP Guideline Callout */}
              <div className={`mt-4 p-3.5 rounded-xl border text-xs ${
                newbornLossPct > 10
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-500/40 text-rose-950 dark:text-rose-100'
                  : newbornLossPct >= 7
                  ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-500/40 text-amber-950 dark:text-amber-100'
                  : 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-100'
              }`}>
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {newbornLossPct > 10 ? <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />}
                  <span>
                    {newbornLossPct > 10
                      ? t.aapOver10Title
                      : newbornLossPct >= 7
                      ? t.aap7To10Title
                      : t.aapUnder7Title}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {newbornLossPct > 10
                    ? t.aapOver10Desc
                    : newbornLossPct >= 7
                    ? t.aap7To10Desc
                    : t.aapUnder7Desc}
                </p>
              </div>
            </div>
          )}

          {mode === 'bmr' && (
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 block mb-2 pr-28">
                {t.resultHeadingBmr}
              </span>
              <div className="space-y-3 tabular-nums">
                <div className="flex justify-between items-baseline border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">{t.restingBurnLabel}</span>
                  <span className="text-xl sm:text-2xl font-black text-[#4950fc] dark:text-indigo-400">{calculatedBmr} <span className="text-xs text-slate-500 dark:text-slate-400">kcal/day</span></span>
                </div>
                <div className="flex justify-between items-baseline border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200">{t.maintenanceLabel}</span>
                  <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{calculatedTdee} <span className="text-xs text-slate-500 dark:text-slate-400">kcal/day</span></span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400">{t.steadyLossLabel}</span>
                  <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">{Math.max(1200, calculatedTdee - 500)} <span className="text-xs text-slate-500 dark:text-slate-400">kcal/day</span></span>
                </div>
              </div>
            </div>
          )}

          {mode === 'subway' && (
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400 block mb-1 pr-28">
                {t.resultHeadingSubway}
              </span>
              <div className="text-4xl sm:text-5xl font-black text-[#ca5983] dark:text-pink-400 tabular-nums">
                {subwayTotalCalories} <span className="text-base font-semibold text-slate-500 dark:text-slate-400">kcal</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-2 leading-relaxed">
                Estimated for a {subwaySize === 'footlong' ? '12-Inch Footlong' : '6-Inch Sub'} based on standard menu nutrition guides.
              </p>
            </div>
          )}

          {/* Action Buttons: 48px Touch-Friendly Download PDF Report & Copy */}
          <div className="space-y-2.5 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={downloadResult}
              className="w-full min-h-[48px] py-3 px-4 bg-gradient-to-r from-[#ca3500] via-[#d35a2f] to-[#7334fd] hover:opacity-95 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              {pdfDownloaded ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{t.pdfReportDownloaded}</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>{t.downloadReport}</span>
                  <span className="text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-md">
                    PDF
                  </span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={copySummary}
                className="min-h-[44px] py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                <span>{copied ? t.copied : t.copySummary}</span>
              </button>

              <button
                type="button"
                onClick={triggerCelebration}
                className="min-h-[44px] py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 border border-slate-200 dark:border-slate-700 text-[#7334fd] dark:text-indigo-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>{t.celebrate}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
