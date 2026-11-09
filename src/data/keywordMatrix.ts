export interface SiloMetadata {
  id: string;
  anchor: string;
  hubKeyword: string;
  type: 'tool' | 'informational' | 'question';
  keywordsCount: number;
  impressions: number;
  avgPos: number;
  subtopics: {
    title: string;
    keywords: string[];
  }[];
  linksTo: {
    targetAnchor: string;
    anchorText: string;
  }[];
}

export const LOCALES = [
  { code: 'en', name: 'English (US)', default: true, pathPrefix: '' },
  { code: 'uk', name: 'United Kingdom (EN)', default: false, pathPrefix: '/uk' },
  { code: 'ca', name: 'Canada (EN)', default: false, pathPrefix: '/ca' },
  { code: 'au', name: 'Australia (EN)', default: false, pathPrefix: '/au' },
  { code: 'de', name: 'Deutsch', default: false, pathPrefix: '/de' },
  { code: 'it', name: 'Italiano', default: false, pathPrefix: '/it' },
  { code: 'ru', name: 'Русский', default: false, pathPrefix: '/ru' },
  { code: 'zh', name: '中文', default: false, pathPrefix: '/zh' },
];

export const PRESERVED_ROUTES = [
  '/authors/dr-rekha-kumar/',
  '/about/',
  '/methodology/',
  '/privacy-policy/',
  '/terms-of-service/',
  '/contact/',
  '/calculators/newborn-weight-loss/',
  '/calculators/baby-weight-loss/',
  '/calculators/infant-weight-loss/',
  '/calculators/weight-loss/',
  '/calculators/water-fasting-weight-loss/',
  '/calculators/omad-weight-loss/',
  '/calculators/glp1-weight-loss/',
  '/calculators/bariatric-surgery-weight-loss/',
  '/calculators/postpartum-weight-loss/',
  '/calculators/bmr/',
  '/calculators/tdee/',
  '/calculators/calorie-deficit/',
  '/calculators/body-fat-percentage/',
  '/calculators/keto/',
  '/calculators/biggest-loser/',
  '/calculators/cycling/',
  '/calculators/walking/',
  '/calculators/rowing/',
  '/calculators/running/',
  '/calculators/smoothie/',
  '/uk/calculators/baby-weight-loss/',
  '/uk/calculators/newborn-weight-loss/',
  '/au/calculators/newborn-weight-loss/',
  '/au/calculators/baby-weight-loss/',
  '/ca/calculators/newborn-weight-loss/',
  '/ca/calculators/baby-weight-loss/',
  '/uk/calculators/weight-loss/',
  '/au/calculators/weight-loss/',
  '/ca/calculators/weight-loss/',
  '/de/calculators/weight-loss/',
  '/it/calculators/weight-loss/',
  '/ru/calculators/weight-loss/',
  '/zh/calculators/weight-loss/',
  '/uk/calculators/bmr/',
  '/ca/calculators/bmr/',
  '/au/calculators/bmr/',
  '/it/calculators/bmr/',
  '/uk/calculators/tdee/',
  '/ca/calculators/tdee/',
  '/au/calculators/tdee/',
  '/it/calculators/tdee/',
  '/uk/calculators/calorie-deficit/',
  '/ca/calculators/calorie-deficit/',
  '/au/calculators/calorie-deficit/',
  '/zh/calculators/calorie-deficit/',
  '/au/calculators/calorie/',
  '/ca/calculators/calorie/',
  '/uk/calculators/bariatric-surgery-weight-loss/',
  '/ca/calculators/bariatric-surgery-weight-loss/',
  '/au/calculators/bariatric-surgery-weight-loss/',
  '/uk/calculators/postpartum-weight-loss/',
  '/uk/calculators/keto/',
  '/uk/calculators/biggest-loser/',
  '/ca/calculators/biggest-loser/',
  '/au/calculators/biggest-loser/',
  '/uk/calculators/fat-loss/',
  '/ru/calculators/fat-loss/',
  '/uk/calculators/walking/',
  '/au/calculators/walking/',
  '/ru/calculators/walking/',
  '/zh/calculators/walking/',
  '/restaurants/mcdonalds/',
  '/uk/restaurants/mcdonalds/',
  '/au/restaurants/mcdonalds/',
  '/ca/restaurants/mcdonalds/',
  '/zh/restaurants/mcdonalds/',
  '/restaurants/subway/',
  '/uk/restaurants/subway/',
  '/au/restaurants/subway/',
  '/ca/restaurants/subway/',
  '/blog/newborn-weight-loss/',
  '/uk/blog/newborn-weight-loss/',
  '/ca/blog/newborn-weight-loss/',
  '/blog/weight-loss-percentage-chart/',
  '/uk/blog/weight-loss-percentage-chart/',
  '/ca/blog/weight-loss-percentage-chart/',
  '/blog/how-to-calculate-weight-loss-percentage/',
  '/uk/blog/how-to-calculate-weight-loss-percentage/',
  '/ca/blog/how-to-calculate-weight-loss-percentage/',
  '/blog/healthy-weight-loss-per-month/',
  '/uk/blog/healthy-weight-loss-per-month/',
  '/ca/blog/healthy-weight-loss-per-month/',
  '/au/blog/healthy-weight-loss-per-month/',
  '/blog/weight-loss-percentage-by-starting-weight/',
  '/blog/5-percent-weight-loss/',
  '/blog/weight-loss-formulas-explained/',
  '/ca/blog/weight-loss-formulas-explained/',
  '/blog/calorie-deficit-weight-loss/',
  '/ca/blog/calorie-deficit-weight-loss/',
  '/au/blog/calorie-deficit-weight-loss/',
  '/zh/blog/calorie-deficit-weight-loss/',
  '/blog/signs-body-burning-fat/',
  '/ca/blog/signs-body-burning-fat/',
  '/au/blog/signs-body-burning-fat/',
  '/blog/how-to-calculate-body-fat/',
  '/uk/blog/how-to-calculate-body-fat/',
  '/au/blog/how-to-calculate-body-fat/',
  '/blog/weight-tracking-guide/',
  '/ca/blog/weight-tracking-guide/',
  '/blog/water-fasting-weight-loss/',
  '/ca/blog/water-fasting-weight-loss/',
  '/zh/blog/water-fasting-weight-loss/'
];

export const SILOS_DATA: SiloMetadata[] = [
  {
    id: 'percentage',
    anchor: '#percentage',
    hubKeyword: 'Weight Loss Percentage Calculator',
    type: 'tool',
    keywordsCount: 174,
    impressions: 3300,
    avgPos: 32.4,
    subtopics: [
      {
        title: 'Calculate',
        keywords: [
          'calculate baby weight loss percentage',
          'calculate weight loss percentage newborn',
          'how to calculate weight loss percentage',
          'how to calculate percentage of weight loss'
        ]
      },
      {
        title: 'Newborn',
        keywords: [
          'newborn weight loss percentage calculator',
          'weight loss percentage calculator newborn',
          'percentage Weight Loss Calculator newborn',
          'newborn percentage Weight Loss Calculator'
        ]
      },
      {
        title: 'Baby',
        keywords: [
          'baby weight loss percentage calculator',
          'weight loss percentage calculator baby',
          'percentage Weight Loss Calculator baby',
          'how to work out baby weight loss percentage'
        ]
      },
      {
        title: 'Body',
        keywords: [
          'body weight percentage calculator',
          'how do you get your percentage body fat?',
          'body percentage Weight Loss Calculator',
          'percentage body weight loss'
        ]
      },
      {
        title: 'Figure',
        keywords: [
          'figure weight loss percentage',
          'figure out percentage of weight loss',
          'how to figure out your percentage of weight loss',
          'how to figure out percentage of weight loss'
        ]
      },
      {
        title: 'General',
        keywords: [
          'weight loss percentage calculator',
          'weight loss percentage',
          'infant weight loss percentage calculator',
          'birth weight loss percentage calculator',
          'weight loss percentage calculator kg',
          'weight loss percentage calculator stones'
        ]
      }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#newborn', anchorText: 'Newborn Weight Loss Calculator' },
      { targetAnchor: '#water-fasting', anchorText: 'Water Fasting Weight Loss Calculator' },
      { targetAnchor: '#glp1-calculator', anchorText: 'GLP-1 & Semaglutide Weight Loss Calculator' }
    ]
  },
  {
    id: 'newborn',
    anchor: '#newborn',
    hubKeyword: 'Newborn Weight Loss Calculator',
    type: 'tool',
    keywordsCount: 28,
    impressions: 2950,
    avgPos: 10.1,
    subtopics: [
      {
        title: 'Percent',
        keywords: [
          'percent Weight Loss Calculator newborn',
          'percent weight loss newborn calculator',
          'newborn percent Weight Loss Calculator',
          'calculate percent weight loss newborn',
          'percent weight loss newborn',
          'newborn weight loss percentage calculator',
          'baby weight loss percentage calculator'
        ]
      },
      {
        title: 'Calculate',
        keywords: [
          'calculate newborn weight loss',
          'calculate weight loss newborn',
          'how to calculate newborn weight loss',
          'how to calculate weight loss in newborn',
          'newborn weight loss calculator grams'
        ]
      },
      {
        title: 'General',
        keywords: [
          'newborn Weight Loss Calculator',
          'Weight Loss Calculator newborn',
          'Weight Loss Calculator for newborn',
          'weight loss newborn calculator',
          'newborn Weight Loss Calculator lbs and oz',
          'newborn weight loss calculation',
          'calculating newborn weight loss',
          'newborn weight loss tool',
          'infant weight loss calculator',
          'baby weight loss calculator'
        ]
      }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#percentage', anchorText: 'Weight Loss Percentage Calculator' },
      { targetAnchor: '#baby', anchorText: 'Baby Weight Loss Calculator' }
    ]
  },
  {
    id: 'water-fasting',
    anchor: '#water-fasting',
    hubKeyword: 'Water Fasting & OMAD Weight Loss Calculator',
    type: 'tool',
    keywordsCount: 18,
    impressions: 2620,
    avgPos: 8.4,
    subtopics: [
      {
        title: 'Water Fast Protocols',
        keywords: [
          'water fast weight loss calculator',
          'water fasting weight loss calculator',
          '24 hour water fast weight loss calculator',
          '48 hour water fast weight loss calculator',
          '72 hour water fast weight loss calculator',
          '5 day water fast weight loss calculator',
          '7 day water fast weight loss calculator'
        ]
      },
      {
        title: 'OMAD & Intermittent Fasting',
        keywords: [
          'omad weight loss calculator',
          'one meal a day weight loss calculator',
          'intermittent fasting weight loss calculator',
          '16:8 intermittent fasting weight loss calculator',
          'fasting weight loss calculator'
        ]
      },
      {
        title: 'Glycogen vs True Fat Loss',
        keywords: [
          'water weight vs fat loss fasting',
          'glycogen depletion water weight calculator',
          'post refeed net fat loss calculator'
        ]
      }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#bmr', anchorText: 'BMR & TDEE Deficit Calculator' },
      { targetAnchor: '#keto', anchorText: 'Keto Diet Macro Calculator' }
    ]
  },
  {
    id: 'glp1-calculator',
    anchor: '#glp1-calculator',
    hubKeyword: 'GLP-1, Semaglutide & Tirzepatide Weight Loss Calculator',
    type: 'tool',
    keywordsCount: 22,
    impressions: 1410,
    avgPos: 11.2,
    subtopics: [
      {
        title: 'Semaglutide (Ozempic & Wegovy)',
        keywords: [
          'ozempic weight loss calculator',
          'wegovy weight loss calculator',
          'semaglutide weight loss calculator',
          'step-1 trial 14.9% tbwl calculator'
        ]
      },
      {
        title: 'Tirzepatide (Mounjaro & Zepbound)',
        keywords: [
          'mounjaro weight loss calculator',
          'zepbound weight loss calculator',
          'tirzepatide weight loss calculator',
          'surmount-1 trial 20.9% tbwl calculator'
        ]
      },
      {
        title: 'Clinical Trial & Peptide Benchmarks',
        keywords: [
          'glp 1 weight loss calculator',
          'glp-1 weight loss calculator',
          'retatrutide weight loss calculator',
          'phentermine weight loss calculator',
          'tesamorelin weight loss calculator',
          'peptide weight loss calculator',
          'lipo c weight loss calculator',
          'mots c weight loss calculator',
          'sermorelin weight loss calculator',
          'aod 9604 weight loss calculator'
        ]
      }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#gastric-bypass', anchorText: 'Gastric Bypass & Sleeve Calculator' },
      { targetAnchor: '#per-month', anchorText: 'Healthy Weight Loss Per Month' }
    ]
  },
  {
    id: 'calorie',
    anchor: '#calorie',
    hubKeyword: 'Subway Calorie Calculator',
    type: 'tool',
    keywordsCount: 114,
    impressions: 953,
    avgPos: 43.3,
    subtopics: [
      {
        title: 'Subway',
        keywords: ['subway calorie calculator', 'subway calorie calculator nz', 'subway calorie counter', 'subway sandwich calorie calculator']
      },
      {
        title: 'Bike & Treadmill',
        keywords: ['exercise bike calorie calculator', 'bike calorie calculator', 'stationary bike calorie calculator', 'treadmill weight loss calculator', 'walking weight loss calculator']
      },
      {
        title: 'Cycling',
        keywords: ['cycling calorie calculator', 'calorie calculator cycling', 'cycling calorie burner calculator', 'cycling calorie calc']
      },
      {
        title: 'Breastfeeding & Postpartum',
        keywords: [
          'breastfeeding calorie calculator',
          'calorie calculator breastfeeding',
          'breastfeeding calorie counter',
          'breastfeeding calorie calculator to lose weight',
          'weight loss while breastfeeding calculator',
          'breastfeeding weight loss calculator',
          'postpartum weight loss calculator'
        ]
      },
      {
        title: 'Burn & Sweat Loss',
        keywords: ['resting calorie burn', 'resting calorie burn calculator', 'sauna weight loss calculator', 'what is my resting calorie burn']
      },
      {
        title: 'General',
        keywords: ['five guys calorie calculator', 'bicycle calorie calculator', 'resting calorie calculator', "mcdonald's calorie calculator"]
      }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#percentage', anchorText: 'Weight Loss Percentage Calculator' },
      { targetAnchor: '#newborn', anchorText: 'Newborn Weight Loss Calculator' }
    ]
  },
  {
    id: 'nutrition',
    anchor: '#nutrition',
    hubKeyword: 'Subway Nutrition Calculator',
    type: 'tool',
    keywordsCount: 25,
    impressions: 649,
    avgPos: 37.0,
    subtopics: [
      {
        title: 'Subway',
        keywords: ['subway nutrition calculator', 'subway nutrition calc', 'nutrition calculator subway', 'subway sandwich nutrition calculator', 'calculate subway nutrition', 'subway nutrition calculator uk', 'subway sandwiches nutrition calculator', 'subway nutrition calculator australia']
      },
      {
        title: 'Mcdonald',
        keywords: ["mcdonald's nutrition calculator", 'mcdonald nutrition calculator']
      },
      {
        title: 'General',
        keywords: ['mcdonalds nutrition calculator', 'chipotle nutrition calculator', 'nutrition calculator', 'mcd nutrition calculator', 'fast food nutrition calculator', 'five guys nutrition calculator', 'starbucks nutrition calculator', 'free nutrition calculator']
      }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#percentage', anchorText: 'Weight Loss Percentage Calculator' },
      { targetAnchor: '#newborn', anchorText: 'Newborn Weight Loss Calculator' }
    ]
  },
  {
    id: 'lbs',
    anchor: '#lbs',
    hubKeyword: "5'2\" 105 lbs",
    type: 'informational',
    keywordsCount: 104,
    impressions: 637,
    avgPos: 11.0,
    subtopics: [
      { title: 'Man', keywords: ['6 3 235 lbs man', "5'11 235 lbs man", '5 11 235 lbs man', "6'3 235 lbs man"] },
      { title: 'Bmi', keywords: ["5'2 105 lbs bmi", 'what is the patient’s bmi if the patient weighs 125 lbs and is 5’6” tall? 2.2 20.2 22.3 70', "5'4 115 lbs bmi", "bmi 5'6 125 lbs"] },
      { title: 'Underweight', keywords: ["is 105 lbs underweight for 5'6", "is 105 lbs underweight for 5'2", "is 95 lbs underweight for 5'3", 'is 140 lbs underweight for 6 0'] },
      { title: 'Male', keywords: ["6'2 235 lbs male", '5 7 210 lbs male', "5'11 160 lbs male", '5 11 255 lbs male'] },
      { title: 'Female', keywords: ["5'8 270 lbs female", "5'3 95 lbs female", "5'7 142 lbs female"] },
      { title: 'General', keywords: ["5'2 105 lbs", "5'5 120 lbs", "4'9 300 lbs", "6'3 230 lbs"] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#percent', anchorText: 'Percent Weight Loss Calculator' },
      { targetAnchor: '#baby', anchorText: 'Baby Weight Loss Calculator' }
    ]
  },
  {
    id: 'much',
    anchor: '#much',
    hubKeyword: 'How Much Weight Have I Lost Calculator',
    type: 'question',
    keywordsCount: 43,
    impressions: 590,
    avgPos: 49.8,
    subtopics: [
      { title: 'Lose', keywords: ['how much weight can i lose in a month', 'how much weight can you lose in a month', 'how much weight will i lose with gastric sleeve calculator', 'how much weight can you lose in a month calculator', 'how much weight do you lose after giving birth calculator', 'how much weight can i lose in a month calculator', 'how much weight could i lose in a month', 'how much weight will i lose with gastric bypass calculator'] },
      { title: 'Have Lost', keywords: ['how much weight have i lost calculator', 'how much weight have i lost', 'how much weight have i lost calculator free', 'how much have i lost in weight', 'how.much weight have i lost', 'how much weight have i lost in kg', 'weight calculator how much have i lost', 'calculate how much weight i have lost'] },
      { title: 'Month', keywords: ['how much weight loss in a month is healthy', 'how much is healthy weight loss per month'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#percentage', anchorText: 'Weight Loss Percentage Calculator' }
    ]
  },
  {
    id: 'calories',
    anchor: '#calories',
    hubKeyword: 'Subway Calories Calculator',
    type: 'tool',
    keywordsCount: 106,
    impressions: 574,
    avgPos: 55.2,
    subtopics: [
      { title: 'Burned', keywords: ['calories burned at rest', 'resting calories burned', 'calories burned bike riding calculator', 'calories burned at rest calculator'] },
      { title: 'Subway', keywords: ['subway calories calculator', 'subway calories counter', 'calculate calories subway', 'subway calories calculator uk'] },
      { title: 'Bike', keywords: ['stationary bike calories calculator', 'bike calories calculator', 'calculate bike calories', 'calories bike ride calculator'] },
      { title: 'Cycling', keywords: ['cycling calculator calories', 'burning calories cycling calculator', 'calories burn in cycling calculator', '1 hour cycling calories calculator'] },
      { title: 'Basal', keywords: ['basal metabolic rate calories', 'basal calories', 'basal metabolic calories', 'basal metabolism calories'] },
      { title: 'General', keywords: ['bmr calories', '5 guys calories calculator', 'biking calories calculator', 'resting calories calculator'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#percentage', anchorText: 'Weight Loss Percentage Calculator' },
      { targetAnchor: '#newborn', anchorText: 'Newborn Weight Loss Calculator' }
    ]
  },
  {
    id: 'percent',
    anchor: '#percent',
    hubKeyword: 'Percent Weight Loss Calculator',
    type: 'informational',
    keywordsCount: 33,
    impressions: 475,
    avgPos: 46.4,
    subtopics: [
      { title: 'Calculate', keywords: ['how to calculate percent weight loss', 'how to calculate percent loss of weight', 'how to calculate percent body weight loss', 'calculate percent weight change', 'calculate percent weight loss'] },
      { title: 'Body', keywords: ['percent body Weight Loss Calculator', 'what is 5 percent of my body weight', 'body percent Weight Loss Calculator', 'percent body fat loss calculator', 'percent of body weight loss'] },
      { title: 'Change', keywords: ['percent weight change', 'percent weight change calculator', 'calculating percent weight change'] },
      { title: 'Birth', keywords: ['percent down from birth weight calculator', 'percent birth Weight Loss Calculator'] },
      { title: 'General', keywords: ['percent Weight Loss Calculator', 'percent weight loss', 'how to figure percent of weight loss', 'percent weight loss equation', 'weight loss percent calculator'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#lbs', anchorText: "5'2\" 105 lbs" },
      { targetAnchor: '#baby', anchorText: 'Baby Weight Loss Calculator' }
    ]
  },
  {
    id: 'baby',
    anchor: '#baby',
    hubKeyword: 'Baby Weight Loss Calculator',
    type: 'informational',
    keywordsCount: 12,
    impressions: 971,
    avgPos: 9.3,
    subtopics: [
      { title: 'Baby Growth & Post-birth', keywords: ['baby Weight Loss Calculator', 'Weight Loss Calculator baby', 'weight loss baby calculator', 'baby weight loss after birth calculator', 'calculate baby weight loss', 'calculating baby weight loss', 'lose baby weight login', 'baby weight loss calculation', 'baby weight loss', 'baby weight loss percentage calculator'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#newborn', anchorText: 'Newborn Weight Loss Calculator' },
      { targetAnchor: '#percent', anchorText: 'Percent Weight Loss Calculator' }
    ]
  },
  {
    id: 'keto',
    anchor: '#keto',
    hubKeyword: 'Keto Diet Calculator',
    type: 'tool',
    keywordsCount: 9,
    impressions: 306,
    avgPos: 57.1,
    subtopics: [
      { title: 'Diet', keywords: ['keto diet calculator', 'calculator for keto diet', 'keto diet calculator free'] },
      { title: 'Tdee', keywords: ['keto tdee calculator', 'tdee calculator keto'] },
      { title: 'General', keywords: ['keto calculator', 'keto Weight Loss Calculator', 'Weight Loss Calculator keto', 'keto calculator for weight loss'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#water-fasting', anchorText: 'Water Fasting & OMAD Calculator' },
      { targetAnchor: '#bmr', anchorText: 'BMR & TDEE Calculator' }
    ]
  },
  {
    id: 'metabolic-rate',
    anchor: '#metabolic-rate',
    hubKeyword: 'Basal Metabolic Rate Calculator',
    type: 'tool',
    keywordsCount: 22,
    impressions: 271,
    avgPos: 58.1,
    subtopics: [
      { title: 'Basal', keywords: ['basal metabolic rate calculator', 'basal metabolic rate calc', 'basal metabolic rate calculator weight loss', 'bmr basal metabolic rate calculator', 'resting basal metabolic rate calculator', 'basal metabolic rate', 'basal metabolic rate cal', 'free basal metabolic rate calculator'] },
      { title: 'Resting', keywords: ['resting metabolic rate calculator', 'find resting metabolic rate', 'calculate my resting metabolic rate', 'calculate resting metabolic rate', 'calculator resting metabolic rate', "what's my resting metabolic rate", 'what is my resting metabolic rate'] },
      { title: 'General', keywords: ['metabolic rate calculator', 'metabolic rate calculator for weight loss', 'basil metabolic rate calculator', 'body metabolic rate calculator', 'metabolic rate tdee calculator'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#percentage', anchorText: 'Weight Loss Percentage Calculator' },
      { targetAnchor: '#newborn', anchorText: 'Newborn Weight Loss Calculator' }
    ]
  },
  {
    id: 'gastric-bypass',
    anchor: '#gastric-bypass',
    hubKeyword: 'Gastric Bypass Surgery Weight Loss Calculator',
    type: 'tool',
    keywordsCount: 21,
    impressions: 1212,
    avgPos: 14.5,
    subtopics: [
      { title: 'Sleeve (VSG)', keywords: ['Weight Loss Calculator gastric sleeve', 'gastric sleeve calculator', 'gastric sleeve Weight Loss Calculator', 'gastric sleeve weight loss timeline', 'Weight Loss Calculator after gastric sleeve', 'vsg weight loss calculator'] },
      { title: 'RNY Bypass & Duodenal Switch', keywords: ['gastric bypass surgery Weight Loss Calculator', 'gastric surgery calculator', 'gastric bypass surgery weight loss timeline', 'rny weight loss calculator', 'duodenal switch weight loss calculator'] },
      { title: 'Monthly Post-Op Chart', keywords: ['gastric bypass weight loss chart', 'gastric bypass calculator', 'gastric bypass weight loss timeline', 'gastric bypass Weight Loss Calculator', 'bariatric weight loss calculator by month'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#bariatric-surgery', anchorText: 'Bariatric %EWL vs %TBWL Calculator' },
      { targetAnchor: '#glp1-calculator', anchorText: 'GLP-1 & Semaglutide Weight Loss Calculator' }
    ]
  },
  {
    id: 'calculate-birth',
    anchor: '#calculate-birth',
    hubKeyword: 'Birth Weight Loss Calculator',
    type: 'tool',
    keywordsCount: 2,
    impressions: 219,
    avgPos: 9.0,
    subtopics: [
      { title: 'Birth Metrics', keywords: ['birth Weight Loss Calculator', 'calculate birth weight loss'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#percentage', anchorText: 'Weight Loss Percentage Calculator' },
      { targetAnchor: '#newborn', anchorText: 'Newborn Weight Loss Calculator' }
    ]
  },
  {
    id: 'per-month',
    anchor: '#per-month',
    hubKeyword: 'Healthy Weight Loss Per Month',
    type: 'informational',
    keywordsCount: 42,
    impressions: 618,
    avgPos: 22.2,
    subtopics: [
      { title: 'Lose & Timeline By Date', keywords: ['how many pounds can you lose in a month', 'healthy amount of weight to lose per month', 'lose 10 pounds in a month calculator', 'how to lose 15 pounds in a month calculator', 'lose 5 pounds in a month calculator', 'weight loss calculator by date', 'weekly weight loss calculator'] },
      { title: 'Healthy', keywords: ['healthy weight loss per month', 'what is a healthy weight loss per month', 'healthy loss of weight per month', 'healthy weight loss amount per month', 'what is healthy weight loss per month'] },
      { title: 'Normal', keywords: ['normal weight loss per month', 'normal weight loss per month kg', 'what is the normal weight loss per month', 'what is normal weight loss per month'] },
      { title: 'Average', keywords: ['average weight loss per month', 'average weight loss in a month'] },
      { title: 'General', keywords: ['glp-1 weight loss percentages by month', 'how many pounds can be lost in a month', 'safe weight loss per month', 'realistic weight loss per month', 'ideal weight loss per month'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#glp1-calculator', anchorText: 'GLP-1 Monthly Weight Loss Calculator' },
      { targetAnchor: '#bmr', anchorText: 'Losertown-Style Weekly Projection Calculator' }
    ]
  },
  {
    id: 'bmr',
    anchor: '#bmr',
    hubKeyword: 'BMR Calculator',
    type: 'tool',
    keywordsCount: 24,
    impressions: 924,
    avgPos: 19.2,
    subtopics: [
      { title: 'Tdee & Weekly Forecast', keywords: ['bmr vs tdee', 'tdee vs bmr', 'losertown weight loss calculator', 'daves weight loss calculator', 'calorie deficit weight loss calculator'] },
      { title: 'Rest & Activity Burn', keywords: ['bmr at rest calculator', 'bmr at rest', 'treadmill weight loss calculator', 'sauna weight loss calculator'] },
      { title: 'General', keywords: ['bmr calculator', 'bmr', 'calculate bmr', 'bmr calculator for men', 'bmr calculator free', 'bmr calculator to lose weight', 'find bmr calculator', 'bmr rate calculator'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#water-fasting', anchorText: 'Water Fasting & OMAD Weight Loss Calculator' },
      { targetAnchor: '#tdee', anchorText: 'TDEE Calorie Deficit Calculator' }
    ]
  },
  {
    id: 'infant',
    anchor: '#infant',
    hubKeyword: 'Infant Weight Loss Calculator',
    type: 'informational',
    keywordsCount: 3,
    impressions: 155,
    avgPos: 10.8,
    subtopics: [
      { title: 'Infant Pediatric Tracking', keywords: ['infant Weight Loss Calculator', 'calculate infant weight loss', 'infant weight loss'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#newborn', anchorText: 'Newborn Weight Loss Calculator' },
      { targetAnchor: '#percent', anchorText: 'Percent Weight Loss Calculator' }
    ]
  },
  {
    id: 'bmi',
    anchor: '#bmi',
    hubKeyword: "5'4\" 115 BMI",
    type: 'informational',
    keywordsCount: 20,
    impressions: 138,
    avgPos: 21.0,
    subtopics: [
      { title: 'Height Weight Ratios', keywords: ["5'4 115 bmi", "5'5 120 bmi", "6'4 225 bmi", "6'3 230 bmi", "5'11 235 bmi", "6'5 250 bmi", "5'6 125 bmi"] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#lbs', anchorText: "5'2\" 105 lbs" },
      { targetAnchor: '#percent', anchorText: 'Percent Weight Loss Calculator' }
    ]
  },
  {
    id: 'subway',
    anchor: '#subway',
    hubKeyword: 'Subway Macro Calculator',
    type: 'tool',
    keywordsCount: 14,
    impressions: 109,
    avgPos: 30.1,
    subtopics: [
      { title: 'Nutritionix & Macro Analysis', keywords: ['subway macro calculator', 'subway nutritional values', 'subway meal prep macros'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#percentage', anchorText: 'Weight Loss Percentage Calculator' },
      { targetAnchor: '#newborn', anchorText: 'Newborn Weight Loss Calculator' }
    ]
  },
  {
    id: 'bariatric-surgery',
    anchor: '#bariatric-surgery',
    hubKeyword: 'Bariatric Calculator',
    type: 'tool',
    keywordsCount: 16,
    impressions: 603,
    avgPos: 18.4,
    subtopics: [
      { title: 'Timeline & Expectations', keywords: ['bariatric calculator', 'bariatric weight loss calculator', 'bariatric surgery weight loss calculator', 'bariatric surgery weight loss percentage', 'excess body Weight Loss Calculator', 'bariatric weight loss calculator by month', 'liposuction weight loss calculator'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#gastric-bypass', anchorText: 'Gastric Bypass & Sleeve Calculator' },
      { targetAnchor: '#glp1-calculator', anchorText: 'GLP-1 Weight Loss Calculator' }
    ]
  },
  {
    id: 'biggest-loser',
    anchor: '#biggest-loser',
    hubKeyword: 'Biggest Loser Calculator',
    type: 'tool',
    keywordsCount: 3,
    impressions: 80,
    avgPos: 8.0,
    subtopics: [
      { title: 'Contest Rankings', keywords: ['biggest loser calculator', 'biggest loser percentage calculator', 'competition Weight Loss Calculator'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#percentage', anchorText: 'Weight Loss Percentage Calculator' },
      { targetAnchor: '#newborn', anchorText: 'Newborn Weight Loss Calculator' }
    ]
  },
  {
    id: 'calculate',
    anchor: '#calculate',
    hubKeyword: 'Calculate Weight Loss',
    type: 'informational',
    keywordsCount: 6,
    impressions: 79,
    avgPos: 57.4,
    subtopics: [
      { title: 'Formulas & Precision', keywords: ['calculate weight loss', 'how to calculate weight loss', 'weight loss math equations'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#lbs', anchorText: "5'2\" 105 lbs" },
      { targetAnchor: '#percent', anchorText: 'Percent Weight Loss Calculator' }
    ]
  },
  {
    id: 'body',
    anchor: '#body',
    hubKeyword: 'Total Body Weight Loss',
    type: 'tool',
    keywordsCount: 13,
    impressions: 76,
    avgPos: 63.5,
    subtopics: [
      { title: 'Fat & Composition', keywords: ['total body weight loss', 'tbwl calculator', 'body fat loss vs lean mass'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#percentage', anchorText: 'Weight Loss Percentage Calculator' },
      { targetAnchor: '#newborn', anchorText: 'Newborn Weight Loss Calculator' }
    ]
  },
  {
    id: 'pounds',
    anchor: '#pounds',
    hubKeyword: '10% of 7 Pounds',
    type: 'informational',
    keywordsCount: 14,
    impressions: 58,
    avgPos: 18.7,
    subtopics: [
      { title: 'Fractional Conversions', keywords: ['10% of 7 pounds', '5 percent of 7 lbs', 'ounces to decimal pounds'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#lbs', anchorText: "5'2\" 105 lbs" },
      { targetAnchor: '#percent', anchorText: 'Percent Weight Loss Calculator' }
    ]
  },
  {
    id: 'tdee',
    anchor: '#tdee',
    hubKeyword: 'TDEE Calculator',
    type: 'tool',
    keywordsCount: 12,
    impressions: 256,
    avgPos: 23.2,
    subtopics: [
      { title: 'Total Daily Energy Expenditure', keywords: ['tdee calculator', 'total daily energy expenditure', 'tdee breastfeeding', 'weight loss while breastfeeding calculator', 'calorie deficit weight loss calculator'] }
    ],
    linksTo: [
      { targetAnchor: '#', anchorText: 'Weight Loss Calculator' },
      { targetAnchor: '#bmr', anchorText: 'BMR & Weekly Weight Forecast Calculator' },
      { targetAnchor: '#water-fasting', anchorText: 'Water Fasting & OMAD Weight Loss Calculator' }
    ]
  }
];
