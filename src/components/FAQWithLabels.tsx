import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { LOCALE_TRANSLATIONS } from '../data/localeStrings';

export interface FAQItem {
  question: string;
  topic: string;
  answer: string;
}

export const FAQ_DATA: FAQItem[] = [
  // Homepage (03-homepage.md) FAQs
  {
    question: 'How do I calculate weight loss percentage?',
    topic: 'The Formula',
    answer:
      'Weight loss percentage = ((Starting Weight - Current Weight) ÷ Starting Weight) × 100. Example: starting at 200 lbs and now at 180 lbs gives ((200 - 180) ÷ 200) × 100 = 10%. The calculator above returns the same result instantly, plus your calorie target and timeline.'
  },
  {
    question: 'How much weight can I lose in a month safely?',
    topic: 'Healthy Pace',
    answer:
      'Clinical guidelines set a safe and sustainable rate of 1 to 2 pounds per week, so a safe monthly loss is typically 4 to 8 pounds, roughly 1% to 2% of total body weight per month.'
  },
  {
    question: 'What is a good weight loss percentage per week?',
    topic: 'Weekly Rate',
    answer:
      'The CDC recommends 0.5 to 2 pounds per week. That equals approximately 0.25% to 1% of body weight weekly for a person of average weight. Losing more than 1% of body weight per week increases the risk of muscle loss and nutrient deficiencies.'
  },
  {
    question: 'What is the 5% weight loss milestone?',
    topic: 'Health Milestones',
    answer:
      'Losing 5% of starting body weight is a clinically recognized health milestone. Studies show a 5% loss produces measurable improvements in blood pressure, blood sugar and cholesterol, even before reaching a goal weight.'
  },
  {
    question: 'What is a healthy total weight loss percentage?',
    topic: 'Health Milestones',
    answer:
      'A healthy total loss is typically 5% to 10% of starting body weight. A 5% loss triggers health benefits. A 10% loss produces significant improvements in diabetes risk, sleep apnea and cardiovascular health.'
  },
  {
    question: 'Why does weight loss percentage matter more than pounds lost?',
    topic: 'Percentage vs Pounds',
    answer:
      'Losing 10 pounds represents a vastly different physiological change for a 150 lb person versus a 250 lb person. Tracking percentage ensures goals are scaled safely to your body frame.'
  },

  // Newborn Weight Loss (01-newborn-weight-loss.md) FAQs
  {
    question: 'How do I calculate weight loss percentage in a newborn at home?',
    topic: 'Newborn Care',
    answer:
      'Convert birth weight and current weight to the same unit. Subtract current weight from birth weight. Divide the difference by birth weight. Multiply by 100.'
  },
  {
    question: 'What is a normal weight loss percentage for a newborn?',
    topic: 'Newborn Care',
    answer:
      'A reading between 5% and 7% is normal for most breastfed newborns, and 3% to 5% is typical for formula-fed newborns. A drop between 7% and 10% requires close monitoring of latch and feeding. A loss above 10% warrants immediate clinical evaluation by a pediatrician.'
  },
  {
    question: 'When do newborns regain their birth weight?',
    topic: 'Neonatal Weight Timeline',
    answer:
      'Most healthy newborns regain birth weight within 10 to 14 days after delivery once maternal milk supply increases.'
  },
  {
    question: "How do I know if my baby's weight loss is dangerous?",
    topic: 'Pediatric Safety',
    answer:
      'The loss is dangerous when it exceeds 10% or when the baby shows signs of dehydration. Fewer wet diapers, dry mouth, and weakness are the signs to watch. A pediatrician should examine the baby immediately in either case.'
  },

  // Baby Weight Loss (02-baby-weight-loss.md) FAQs
  {
    question: 'How do you calculate baby weight loss percentage?',
    topic: 'Baby Weight Tracking',
    answer:
      'Subtract current weight from birth weight, divide by birth weight, and multiply by 100. The calculator above does this instantly in pounds, ounces or grams.'
  },
  {
    question: 'Is baby weight loss normal?',
    topic: 'Baby Weight Tracking',
    answer:
      'Only in the first 3 to 4 days of life. Later loss, or a failure to gain, requires clinical evaluation.'
  },
  {
    question: 'Does the calculator replace the pediatrician?',
    topic: 'Pediatric Safety',
    answer:
      'No. The tool informs tracking. A clinician decides care.'
  },

  // BMR Calculator (05-bmr.md) FAQs
  {
    question: 'How does a BMR calculator differ from a resting metabolic rate calculator?',
    topic: 'BMR & Metabolism',
    answer:
      'A basal metabolic rate calculator measures expenditure under strict fasting, post-sleep resting conditions. A resting metabolic rate calculator measures under slightly less restrictive conditions and typically reads 5 to 10 percent higher than BMR.'
  },
  {
    question: 'How do BMR and TDEE work together for weight loss?',
    topic: 'BMR & Metabolism',
    answer:
      'BMR is the baseline for vital organ function at rest. TDEE multiplies BMR by physical activity level. Safe weight loss consumes fewer calories than TDEE while staying above BMR.'
  },
  {
    question: 'Does eating below BMR damage metabolism?',
    topic: 'BMR & Metabolism',
    answer:
      'Sustained intake below BMR can trigger adaptive thermogenesis. The body conserves energy, burns muscle for fuel and lowers expenditure. Recovery requires a gradual return to maintenance intake.'
  },
  {
    question: 'Will more muscle raise my BMR?',
    topic: 'BMR & Metabolism',
    answer:
      'Yes. Muscle tissue requires more resting energy than fat tissue. Increasing lean mass raises BMR over time, which is why resistance training compounds with nutrition.'
  },

  // Subway Nutrition Calculator (06-subway.md) FAQs
  {
    question: 'What is the lowest calorie bread at Subway?',
    topic: 'Subway Nutrition',
    answer:
      'The 9-Grain Wheat bread and Sourdough bread are typically the lowest calorie bread options at Subway. Each 6-inch sub carries about 190 to 210 calories from the bread alone.'
  },
  {
    question: 'How many calories are in Subway sauces?',
    topic: 'Subway Nutrition',
    answer:
      'Mayonnaise or Chipotle Southwest adds 100 to 150 calories per serving. Mustard, vinegar and sweet onion sauce add 0 to 40 calories per serving. The sauce is the cheapest place to cut calories in any build.'
  },
  {
    question: 'How does the Subway nutrition calculator work?',
    topic: 'Subway Nutrition',
    answer:
      'Firstly, select the bread size: 6-inch or Footlong. Secondly, choose the bread, the protein and the cheese. Finally, add vegetables and sauce. The calculator sums total calories, protein, carbohydrates, fat and sodium from the official 2026 menu values for each selection.'
  },
  {
    question: 'Does the calculator cover Subway New Zealand?',
    topic: 'Subway Nutrition',
    answer:
      'The builder accepts the same bread, protein, cheese, vegetable and sauce options from the official 2026 menu. Subway publishes different nutrition values per region. Diners in New Zealand, the UK, Canada and Australia should read the totals against their local published menu.'
  },

  // Biggest Loser Calculator (04-biggest-loser.md) FAQs
  {
    question: 'How do I use the Biggest Loser weight loss calculator?',
    topic: 'Biggest Loser Method',
    answer:
      'Firstly, enter your starting weight. Secondly, enter your current weight. Finally, read the percentage the tool returns. The result updates with every entry.'
  },
  {
    question: "Do the Biggest Loser show's results prove that rapid loss works?",
    topic: 'Biggest Loser Method',
    answer:
      "No. Research on contestants documented adaptive thermogenesis and lasting metabolic changes. The formula is safe to reuse. The show's calorie deficits are not."
  },
  {
    question: 'Where does the Biggest Loser percentage method come from?',
    topic: 'Biggest Loser Method',
    answer:
      'The method derives from the standard weight loss percentage formula used across clinical weight programs. Plot each weekly result on the weight loss percentage chart to watch the trend.'
  },

  // Retained General Site FAQs (non-overlapping)
  {
    question: 'How do I interpret my weight loss percentage results?',
    topic: 'Health Milestones',
    answer:
      'Focus on 5% and 10% milestones rather than daily scale ups and downs. Doctors and endocrinologists use a 5% to 10% drop from your starting weight as a key benchmark because that is where most people see real improvements in blood pressure, blood sugar (HbA1c), cholesterol, and joint comfort.'
  },
  {
    question: 'What is typical weight loss after gastric sleeve or bypass surgery?',
    topic: 'Bariatric Care',
    answer:
      'After bariatric surgery, doctors usually track both total body weight loss and excess weight loss. Most patients lose about 60% to 70% of their excess body weight over the first 12 to 18 months, with the fastest drop happening in the first 3 months while your appetite and metabolism adjust.'
  },
  {
    question: "How do I calculate a baby's weight loss with pounds and ounces?",
    topic: 'Unit Conversion',
    answer:
      'Since there are 16 ounces in a pound, convert both weights into total ounces first: (pounds × 16) + ounces. Then subtract current ounces from birth ounces, divide by birth ounces, and multiply by 100. You can also enter pounds and ounces directly into our Newborn tab above and we will do the ounce and gram math for you.'
  },
  {
    question: "Is my weight or my baby's weight saved on your servers?",
    topic: 'Privacy',
    answer:
      'No. Every calculation happens right inside your web browser on your phone or computer. None of the numbers you type are ever sent to a server, stored in a database, or shared with anyone.'
  },
  {
    question: "Can I save or print my results for a doctor's appointment?",
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
  const localizedFaqs = locale === 'en' ? FAQ_DATA : t.faqs && t.faqs.length > 0 ? t.faqs : FAQ_DATA;

  return (
    <section id="faq-section" className="w-full bg-white dark:bg-[#1c1917] rounded-2xl p-4 sm:p-8 border border-[#e5e1d8] dark:border-[#332f2b] space-y-6 scroll-mt-20 transition-colors duration-200">
      <div className="flex items-start gap-3 border-b border-[#edeae3] dark:border-[#2a2623] pb-4">
        <HelpCircle className="w-4 h-4 mt-1.5 text-[#57534e] dark:text-[#b5afa6] shrink-0" strokeWidth={1.75} />
        <div>
          <h2 className="text-lg sm:text-2xl font-semibold text-[#1c1917] dark:text-[#f5f3ef] tracking-tight">
            {t.faqTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#57534e] dark:text-[#b5afa6] mt-1">
            {t.faqSubtitle}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {localizedFaqs.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={index}
              className="border border-[#e5e1d8] dark:border-[#332f2b] rounded-xl overflow-hidden transition-colors duration-150 bg-white dark:bg-[#1c1917]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full min-h-[56px] p-4 text-left flex items-start justify-between gap-4 hover:bg-[#faf9f7] dark:hover:bg-[#25221f] transition-colors duration-150 cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="space-y-1">
                  <span className="text-xs font-normal text-[#78716c] dark:text-[#8c857d] block">
                    {item.topic}
                  </span>
                  <h3 className="text-sm sm:text-base font-medium text-[#1c1917] dark:text-[#f5f3ef] leading-snug">
                    {item.question}
                  </h3>
                </div>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#78716c] dark:text-[#8c857d] shrink-0">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#1c1917] dark:text-[#f5f3ef]" strokeWidth={1.75} />
                  ) : (
                    <ChevronDown className="w-4 h-4" strokeWidth={1.75} />
                  )}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-0 text-xs sm:text-sm text-[#57534e] dark:text-[#b5afa6] leading-relaxed border-t border-[#edeae3] dark:border-[#2a2623] bg-[#faf9f7] dark:bg-[#141210]">
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
