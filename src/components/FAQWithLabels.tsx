import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { LOCALE_TRANSLATIONS } from '../data/localeStrings';

export interface FAQItem {
  question: string;
  topic: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  {
    question: 'How do I calculate weight loss percentage accurately?',
    topic: 'The Formula',
    answer:
      'Subtract your current weight from your starting weight, divide that number by your starting weight, and multiply by 100. For example, if you started at 200 lbs and now weigh 180 lbs, you lost 20 lbs: (20 ÷ 200) × 100 = 10%. The exact same math works whether you weigh yourself in pounds, kilograms, or grams.'
  },
  {
    question: 'How do I interpret my weight loss percentage results?',
    topic: 'Health Milestones',
    answer:
      'Focus on 5% and 10% milestones rather than daily scale ups and downs. Doctors and endocrinologists use a 5% to 10% drop from your starting weight as a key benchmark because that is where most people see real improvements in blood pressure, blood sugar (HbA1c), cholesterol, and joint comfort.'
  },
  {
    question: 'How do you calculate newborn weight loss percentage after birth?',
    topic: 'Newborn Care',
    answer:
      'Subtract your baby’s current weight from their birth weight, divide by the birth weight, and multiply by 100. It is completely normal for healthy newborns to lose 5% to 7% of their birth weight in the first 2 to 3 days as they shed extra fluid. If a baby loses 10% or more, your pediatrician or lactation consultant will want to check their latch and feeding closely.'
  },
  {
    question: 'How much weight can you safely lose in a month?',
    topic: 'Healthy Pace',
    answer:
      'For most adults, a steady pace of 1 to 2 pounds per week, or about 4 to 8 pounds a month, is the safest way to lose fat while keeping your muscle and energy levels up. Losing weight much faster than 1% of your body weight per week can leave you exhausted and increase the risk of gallstones or muscle loss.'
  },
  {
    question: 'What is typical weight loss after gastric sleeve or bypass surgery?',
    topic: 'Bariatric Care',
    answer:
      'After bariatric surgery, doctors usually track both total body weight loss and "excess weight loss." Most patients lose about 60% to 70% of their excess body weight over the first 12 to 18 months, with the fastest drop happening in the first 3 months while your appetite and metabolism adjust.'
  },
  {
    question: 'How do I calculate a baby’s weight loss with pounds and ounces?',
    topic: 'Unit Conversion',
    answer:
      'Since there are 16 ounces in a pound, convert both weights into total ounces first: (pounds × 16) + ounces. Then subtract current ounces from birth ounces, divide by birth ounces, and multiply by 100. You can also enter pounds and ounces directly into our Newborn tab above and we will do the ounce and gram math for you.'
  },
  {
    question: 'Is my weight or my baby’s weight saved on your servers?',
    topic: 'Privacy',
    answer:
      'No. Every calculation happens right inside your web browser on your phone or computer. None of the numbers you type are ever sent to a server, stored in a database, or shared with anyone.'
  },
  {
    question: 'Can I save or print my results for a doctor’s appointment?',
    topic: 'Saving Your Report',
    answer:
      'Yes. Click or tap the "Download Report" button in the results box to save a clean, one-page PDF summary. It includes your starting weight, current change, percentage lost, and key health milestones that you can keep for your records or bring to your next appointment.'
  },
  {
    question: 'How much weight do you typically lose right after giving birth?',
    topic: 'Postpartum Recovery',
    answer:
      'Most mothers lose about 12 to 15 pounds right after delivery from the combined weight of the baby, placenta, and amniotic fluid. Over the next 4 to 6 weeks, it is common to lose another 5 to 10 pounds gradually as your body releases extra fluid retained during pregnancy.'
  },
  {
    question: 'What is the difference between weight loss percentage and body fat percentage?',
    topic: 'Body Composition',
    answer:
      'Weight loss percentage measures how much your total scale weight has changed compared to where you started. Body fat percentage estimates how much of your body is fat tissue versus muscle, bone, and water. Eating enough protein and doing strength training helps ensure that the weight you lose comes mostly from fat rather than muscle.'
  }
];

interface FAQWithLabelsProps {
  locale?: string;
}

export const FAQWithLabels: React.FC<FAQWithLabelsProps> = ({ locale = 'en' }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const t = LOCALE_TRANSLATIONS[locale] || LOCALE_TRANSLATIONS.en;
  const localizedFaqs = t.faqs && t.faqs.length > 0 ? t.faqs : FAQ_DATA;

  return (
    <section id="faq-section" className="w-full bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 scroll-mt-20 transition-colors">
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#7334fd] to-[#ca3500] text-white flex items-center justify-center font-bold shrink-0">
          <HelpCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.faqSubtitle}
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        {localizedFaqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-slate-200/90 dark:border-slate-800 rounded-2xl overflow-hidden transition-all bg-white dark:bg-slate-800/50"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full min-h-[56px] p-4 sm:p-5 text-left flex items-start justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800 active:bg-slate-100/70 transition-colors"
                aria-expanded={isOpen}
              >
                <div className="space-y-0.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#7334fd] dark:text-indigo-400 block">
                    {item.topic}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {item.question}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 shrink-0 mt-0.5">
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#7334fd] dark:text-indigo-400" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/80 bg-slate-50/40 dark:bg-slate-900/50">
                  <p className="pt-3">{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

