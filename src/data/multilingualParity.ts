export interface ExtendedLocaleParity {
  focusStandard: string;
  focusBariatric: string;
  focusGlp1: string;
  focusPostpartum: string;
  focusFasting: string;
  ewlLabel: string;
  ewlDesc: (goalStr: string, unit: string) => string;
  glp1Label: string;
  glp1Reached20: string;
  glp1Reached15: string;
  glp1Target15: (targetStr: string, unit: string) => string;
  glp1Desc: string;
  postpartumLabel: string;
  postpartumPace: string;
  postpartumDesc: string;
  fastingLabel: string;
  fastingDesc: string;
  mcdBuilderBtn: string;
  subwayBuilderBtn: string;
  mcdResultHeading: string;
  stoneEquivalentLabel: string;
  relatedCalculatorsLabel: string;
  howToTitle: string;
  howToSteps: { name: string; text: string }[];
  siloHubTitles: Record<string, string>;
}

const EN_SILO_HUBS: Record<string, string> = {
  percentage: 'Weight Loss Percentage Calculator',
  newborn: 'Newborn Weight Loss Calculator',
  'water-fasting': 'Water Fasting & OMAD Weight Loss Calculator',
  'glp1-calculator': 'GLP-1, Semaglutide & Tirzepatide Calculator',
  calorie: 'Subway & McDonald’s Calorie Calculator',
  nutrition: 'Restaurant Nutrition Calculator',
  lbs: "5'2\" 105 lbs BMI Reference",
  much: 'How Much Weight Have I Lost Calculator',
  calories: 'Daily Calorie & Meal Calculator',
  percent: 'Percent Weight Loss Calculator',
  baby: 'Baby Weight Loss Calculator',
  keto: 'Keto Diet Macro Calculator',
  'metabolic-rate': 'Basal Metabolic Rate Calculator',
  'gastric-bypass': 'Gastric Bypass & RNY Weight Loss Calculator',
  'calculate-birth': 'Birth Weight Loss Calculator',
  'per-month': 'Healthy Weight Loss Per Month',
  bmr: 'BMR & 12-Week Forecast Calculator',
  infant: 'Infant Weight Loss Calculator',
  bmi: "5'4\" 115 lbs BMI Reference",
  subway: 'Restaurant Macro Calculator',
  'bariatric-surgery': 'Bariatric (%EWL) & Duodenal Switch Calculator',
  'biggest-loser': 'Group Weight Loss % Challenge',
  calculate: 'Calculate Weight Loss Formula',
  body: 'Total Body Weight Loss (%TBWL)',
  pounds: '10% of 7 Pounds Newborn Guide',
  tdee: 'TDEE Maintenance Calorie Calculator'
};

const EN_BASE: ExtendedLocaleParity = {
  focusStandard: 'Standard Adult %',
  focusBariatric: 'Bariatric Surgery (%EWL)',
  focusGlp1: 'GLP-1 / Semaglutide',
  focusPostpartum: 'Postpartum & Breastfeeding',
  focusFasting: 'Water Fasting & OMAD',
  ewlLabel: 'Excess Weight Loss (%EWL):',
  ewlDesc: (goalStr, unit) =>
    `Bariatric surgeons track %EWL toward your goal/ideal weight (${goalStr} ${unit}). Typical 12-month gastric sleeve or RNY bypass benchmark is 60%–75% EWL.`,
  glp1Label: 'GLP-1 Trial Benchmark:',
  glp1Reached20: 'SURMOUNT-1 (~20.9%) Reached',
  glp1Reached15: 'STEP-1 (~14.9%) Reached',
  glp1Target15: (targetStr, unit) => `${targetStr} ${unit} = 15% Target`,
  glp1Desc:
    'Clinical trials average 14.9% total body weight loss at 68 weeks on Semaglutide, 20.9% at 72 weeks on Tirzepatide, and 24.2% at 48 weeks in Phase 2 Retatrutide studies.',
  postpartumLabel: 'Postpartum & Lactation Pace:',
  postpartumPace: '~1 lb (0.5 kg) / week',
  postpartumDesc:
    'Initial delivery accounts for 12–15 lbs (5.5–7 kg) from baby, placenta, and fluid. Exclusive breastfeeding burns ~450–500 kcal/day.',
  fastingLabel: 'Water Fasting & OMAD Split:',
  fastingDesc:
    'Days 1–3 of a water fast release 1.5–3.5 lbs (0.7–1.6 kg) of stored glycogen and bound water alongside ~0.5 lb/day of true adipose fat oxidation (TDEE ÷ 3,500 kcal).',
  mcdBuilderBtn: 'McDonald’s Meal Builder',
  subwayBuilderBtn: 'Subway Sub Builder',
  mcdResultHeading: 'McDonald’s Meal Total',
  stoneEquivalentLabel: 'UK Stone Equivalent:',
  relatedCalculatorsLabel: 'Related Calculators:',
  howToTitle: 'How to Calculate Weight Loss Percentage',
  howToSteps: [
    {
      name: 'Subtract Current Weight from Starting Weight',
      text: 'Find your total weight lost by subtracting your current weight from your initial starting weight (e.g., 200 lbs − 180 lbs = 20 lbs lost).'
    },
    {
      name: 'Divide Weight Lost by Starting Weight',
      text: 'Divide the weight lost by your original starting weight (e.g., 20 ÷ 200 = 0.10).'
    },
    {
      name: 'Multiply by 100 for Percentage',
      text: 'Multiply the decimal by 100 to get your exact weight loss percentage (0.10 × 100 = 10%).'
    }
  ],
  siloHubTitles: EN_SILO_HUBS
};

export const EXTENDED_LOCALE_PARITY: Record<string, ExtendedLocaleParity> = {
  en: EN_BASE,
  ca: EN_BASE,
  uk: EN_BASE,
  au: EN_BASE,
  de: {
    focusStandard: 'Standard Erwachsene %',
    focusBariatric: 'Bariatrie-OP (%EWL)',
    focusGlp1: 'GLP-1 / Semaglutid',
    focusPostpartum: 'Rückbildung & Stillzeit',
    focusFasting: 'Wasserfasten & OMAD',
    ewlLabel: 'Übergewichtsverlust (%EWL):',
    ewlDesc: (goalStr, unit) =>
      `Bariatrische Chirurgen messen den %EWL bis zum Zielgewicht (${goalStr} ${unit}). Der klinische 12-Monats-Richtwert nach Schlauchmagen oder Bypass liegt bei 60%–75% EWL.`,
    glp1Label: 'GLP-1 Studien-Richtwert:',
    glp1Reached20: 'SURMOUNT-1 (~20,9%) erreicht',
    glp1Reached15: 'STEP-1 (~14,9%) erreicht',
    glp1Target15: (targetStr, unit) => `${targetStr} ${unit} = 15%-Ziel`,
    glp1Desc:
      'Klinische Studien zeigen durchschnittlich 14,9% Gesamtgewichtsverlust mit Semaglutid, 20,9% mit Tirzepatid und 24,2% in Phase-2-Studien zu Retatrutid.',
    postpartumLabel: 'Sicheres Tempo nach Geburt:',
    postpartumPace: '~0,5 kg (1 lb) / Woche',
    postpartumDesc:
      'Die Entbindung selbst reduziert das Gewicht um 5,5–7 kg (Baby, Plazenta, Fruchtwasser). Vollstillen verbraucht zusätzlich ca. 450–500 kcal/Tag.',
    fastingLabel: 'Wasserfasten & OMAD Bilanz:',
    fastingDesc:
      'In den ersten 1–3 Fastentagen werden 0,7–1,6 kg Glykogen und gebundenes Wasser freigesetzt, ergänzt durch ~0,25 kg echten Fettabbau pro Tag (TDEE ÷ 7.700 kcal).',
    mcdBuilderBtn: 'McDonald’s Kalorien-Rechner',
    subwayBuilderBtn: 'Subway Sandwich-Rechner',
    mcdResultHeading: 'McDonald’s Mahlzeit Gesamt',
    stoneEquivalentLabel: 'Stone & Pfund (st/lbs):',
    relatedCalculatorsLabel: 'Passende Rechner:',
    howToTitle: 'Wie man den prozentualen Gewichtsverlust berechnet',
    howToSteps: [
      {
        name: 'Aktuelles Gewicht vom Startgewicht abziehen',
        text: 'Ziehen Sie Ihr aktuelles Gewicht vom Ausgangsgewicht ab (z. B. 100 kg − 90 kg = 10 kg Verlust).'
      },
      {
        name: 'Gewichtsverlust durch das Startgewicht teilen',
        text: 'Teilen Sie die Differenz durch Ihr ursprüngliches Startgewicht (10 ÷ 100 = 0,10).'
      },
      {
        name: 'Mit 100 multiplizieren',
        text: 'Multiplizieren Sie das Ergebnis mit 100, um den exakten Prozentsatz zu erhalten (0,10 × 100 = 10%).'
      }
    ],
    siloHubTitles: {
      percentage: 'Prozentualer Gewichtsverlust-Rechner',
      newborn: 'Neugeborenen-Gewichtsverlust-Rechner',
      'water-fasting': 'Wasserfasten & OMAD Gewichtsverlust-Rechner',
      'glp1-calculator': 'GLP-1, Semaglutid & Tirzepatid Rechner',
      calorie: 'McDonald’s & Subway Kalorienrechner',
      nutrition: 'Restaurant-Nährwertrechner',
      lbs: 'BMI-Referenz (157 cm & 48 kg)',
      much: 'Wie viel Gewicht habe ich verloren?',
      calories: 'Tageskalorien & Mahlzeiten-Rechner',
      percent: 'Gewichtsabnahme in Prozent berechnen',
      baby: 'Baby-Gewichtsverlust-Rechner',
      keto: 'Keto-Diät Makrorechner',
      'metabolic-rate': 'Grundumsatz-Rechner (Metabolismus)',
      'gastric-bypass': 'Magenbypass & RNY Gewichtsverlust-Rechner',
      'calculate-birth': 'Geburtsgewicht-Abnahme berechnen',
      'per-month': 'Gesunder Gewichtsverlust pro Monat',
      bmr: 'BMR & 12-Wochen-Prognose-Rechner',
      infant: 'Säuglings-Gewichtsrechner',
      bmi: 'BMI-Referenz (163 cm & 52 kg)',
      subway: 'Subway & Fast-Food Makrorechner',
      'bariatric-surgery': 'Bariatrie-Rechner (%EWL & Duodenal Switch)',
      'biggest-loser': 'Gruppen-Gewichtsverlust-Challenge %',
      calculate: 'Gewichtsverlust-Formel erklärt',
      body: 'Gesamtkörpergewichtsverlust (%TBWL)',
      pounds: '10% von 7 Pfund Neugeborenen-Tabelle',
      tdee: 'TDEE Gesamtumsatz-Rechner'
    }
  },
  it: {
    focusStandard: 'Percentuale Standard %',
    focusBariatric: 'Chirurgia Bariatrica (%EWL)',
    focusGlp1: 'GLP-1 / Semaglutide',
    focusPostpartum: 'Post-Parto e Allattamento',
    focusFasting: 'Digiuno Idrico e OMAD',
    ewlLabel: 'Perdita Peso in Eccesso (%EWL):',
    ewlDesc: (goalStr, unit) =>
      `I chirurghi bariatrici monitorano la %EWL verso il peso ideale (${goalStr} ${unit}). Il traguardo tipico a 12 mesi dopo sleeve o bypass RNY è del 60%–75% EWL.`,
    glp1Label: 'Benchmark Studi GLP-1:',
    glp1Reached20: 'SURMOUNT-1 (~20,9%) Raggiunto',
    glp1Reached15: 'STEP-1 (~14,9%) Raggiunto',
    glp1Target15: (targetStr, unit) => `${targetStr} ${unit} = Obiettivo 15%`,
    glp1Desc:
      'Gli studi clinici mostrano una perdita media del 14,9% con Semaglutide, fino al 20,9% con Tirzepatide e il 24,2% negli studi di Fase 2 su Retatrutide.',
    postpartumLabel: 'Ritmo Sicuro Post-Parto:',
    postpartumPace: '~0,5 kg (1 lb) / settimana',
    postpartumDesc:
      'Il parto comporta un calo iniziale di 5,5–7 kg (neonato, placenta e liquidi). L’allattamento esclusivo richiede circa +450–500 kcal/giorno.',
    fastingLabel: 'Bilancio Digiuno Idrico e OMAD:',
    fastingDesc:
      'Nei primi 1–3 giorni di digiuno si perdono 0,7–1,6 kg di glicogeno e acqua legata, oltre a ~0,25 kg/giorno di grasso corporeo reale (TDEE ÷ 7.700 kcal).',
    mcdBuilderBtn: 'Calcolatore Pasto McDonald’s',
    subwayBuilderBtn: 'Calcolatore Panino Subway',
    mcdResultHeading: 'Totale Pasto McDonald’s',
    stoneEquivalentLabel: 'Equivalente Stone & Libbre:',
    relatedCalculatorsLabel: 'Calcolatori Correlati:',
    howToTitle: 'Come Calcolare la Percentuale di Perdita di Peso',
    howToSteps: [
      {
        name: 'Sottrai il Peso Attuale dal Peso Iniziale',
        text: 'Calcola il peso perso sottraendo il peso attuale dal peso di partenza (es. 90 kg − 81 kg = 9 kg persi).'
      },
      {
        name: 'Dividi per il Peso Iniziale',
        text: 'Dividi il peso perso per il tuo peso iniziale (9 ÷ 90 = 0,10).'
      },
      {
        name: 'Moltiplica per 100',
        text: 'Moltiplica il risultato per 100 per ottenere la percentuale esatta (0,10 × 100 = 10%).'
      }
    ],
    siloHubTitles: {
      percentage: 'Calcolatore Percentuale Perdita di Peso',
      newborn: 'Calcolatore Calo Ponderale Neonato',
      'water-fasting': 'Calcolatore Digiuno Idrico e OMAD',
      'glp1-calculator': 'Calcolatore GLP-1, Semaglutide e Tirzepatide',
      calorie: 'Calcolatore Calorie McDonald’s e Subway',
      nutrition: 'Calcolatore Nutrizionale Ristoranti',
      lbs: 'Riferimento BMI (157 cm e 48 kg)',
      much: 'Quanto Peso Ho Perso? Calcolatore',
      calories: 'Calcolatore Calorie Giornaliere',
      percent: 'Calcolo Percentuale Dimagrimento',
      baby: 'Calcolatore Peso Neonato e Lattante',
      keto: 'Calcolatore Macro Dieta Chetogenica',
      'metabolic-rate': 'Calcolatore Metabolismo Basale',
      'gastric-bypass': 'Calcolatore Bypass Gastrico RNY e Sleeve',
      'calculate-birth': 'Calcolo Calo Peso alla Nascita',
      'per-month': 'Perdita di Peso Sicura al Mese',
      bmr: 'Calcolatore BMR e Previsione 12 Settimane',
      infant: 'Calcolatore Crescita e Peso Infantile',
      bmi: 'Riferimento BMI (163 cm e 52 kg)',
      subway: 'Calcolatore Macro Pasti Veloci',
      'bariatric-surgery': 'Calcolatore Chirurgia Bariatrica (%EWL)',
      'biggest-loser': 'Sfida Percentuale Perdita di Peso',
      calculate: 'Formula Perdita di Peso Spiegata',
      body: 'Perdita Totale di Peso Corporeo (%TBWL)',
      pounds: 'Guida Neonato: 10% del Peso alla Nascita',
      tdee: 'Calcolatore TDEE Fabbisogno Calorico'
    }
  },
  ru: {
    focusStandard: 'Стандартный % (Взрослые)',
    focusBariatric: 'Бариатрия (%EWL)',
    focusGlp1: 'ГПП-1 / Семаглутид',
    focusPostpartum: 'После родов и ГВ',
    focusFasting: 'Водное голодание и OMAD',
    ewlLabel: 'Потеря избыточного веса (%EWL):',
    ewlDesc: (goalStr, unit) =>
      `Бариатрические хирурги оценивают %EWL относительно целевого веса (${goalStr} ${unit}). Клинический ориентир через 12 месяцев после операции — 60%–75% EWL.`,
    glp1Label: 'Ориентир исследований ГПП-1:',
    glp1Reached20: 'Достигнут уровень SURMOUNT-1 (~20,9%)',
    glp1Reached15: 'Достигнут уровень STEP-1 (~14,9%)',
    glp1Target15: (targetStr, unit) => `${targetStr} ${unit} = цель 15%`,
    glp1Desc:
      'В клинических исследованиях средняя потеря массы тела составляет 14,9% на Семаглутиде, 20,9% на Тирзепатиде и 24,2% в исследованиях фазы 2 Ретатрутида.',
    postpartumLabel: 'Безопасный темп после родов:',
    postpartumPace: '~0,5 кг (1 фунт) / нед.',
    postpartumDesc:
      'Сразу после родов уходит 5,5–7 кг (вес ребенка, плаценты и вод). Грудное вскармливание расходует дополнительно ~450–500 ккал/день.',
    fastingLabel: 'Водное голодание и OMAD:',
    fastingDesc:
      'В первые 1–3 дня голодания уходит 0,7–1,6 кг гликогена и связанной воды, а также ~0,25 кг истинного жира в сутки (TDEE ÷ 7700 ккал).',
    mcdBuilderBtn: 'Калькулятор калорий McDonald’s',
    subwayBuilderBtn: 'Калькулятор сэндвичей Subway',
    mcdResultHeading: 'Итого калорий (McDonald’s)',
    stoneEquivalentLabel: 'В стоунах и фунтах (st/lbs):',
    relatedCalculatorsLabel: 'Связанные калькуляторы:',
    howToTitle: 'Как рассчитать процент потери веса',
    howToSteps: [
      {
        name: 'Вычтите текущий вес из начального веса',
        text: 'Определите общую потерю веса, вычтя текущий вес из исходного (например: 100 кг − 90 кг = 10 кг).'
      },
      {
        name: 'Разделите потерю веса на начальный вес',
        text: 'Разделите полученную разницу на ваш начальный вес (10 ÷ 100 = 0,10).'
      },
      {
        name: 'Умножьте результат на 100',
        text: 'Умножьте число на 100, чтобы получить точный процент потери веса (0,10 × 100 = 10%).'
      }
    ],
    siloHubTitles: {
      percentage: 'Калькулятор процента потери веса',
      newborn: 'Калькулятор потери веса новорожденного',
      'water-fasting': 'Калькулятор водного голодания и OMAD',
      'glp1-calculator': 'Калькулятор ГПП-1, Семаглутида и Тирзепатида',
      calorie: 'Калькулятор калорий McDonald’s и Subway',
      nutrition: 'Калькулятор БЖУ и калорийности блюд',
      lbs: 'Ориентир ИМТ (157 см и 48 кг)',
      much: 'Сколько веса я сбросил: калькулятор',
      calories: 'Расчет суточной нормы калорий',
      percent: 'Расчет процента снижения массы тела',
      baby: 'Калькулятор веса грудничка после родов',
      keto: 'Калькулятор кето-диеты и макронутриентов',
      'metabolic-rate': 'Калькулятор базового метаболизма',
      'gastric-bypass': 'Калькулятор шунтирования RNY и резекции желудка',
      'calculate-birth': 'Расчет потери веса от рождения',
      'per-month': 'Безопасная потеря веса за месяц',
      bmr: 'Калькулятор BMR и прогноз на 12 недель',
      infant: 'Контроль веса младенца (нормы ВОЗ и AAP)',
      bmi: 'Ориентир ИМТ (163 см и 52 кг)',
      subway: 'Калькулятор калорий и белка в ресторанах',
      'bariatric-surgery': 'Бариатрический калькулятор (%EWL и %TBWL)',
      'biggest-loser': 'Командный расчет процента похудения',
      calculate: 'Формула процента потери веса с примерами',
      body: 'Общая потеря массы тела (%TBWL)',
      pounds: 'Норма потери 10% веса у новорожденных',
      tdee: 'Калькулятор суточного расхода энергии (TDEE)'
    }
  },
  zh: {
    focusStandard: '成人标准减重 %',
    focusBariatric: '减重代谢手术 (%EWL)',
    focusGlp1: 'GLP-1 / 司美格鲁肽',
    focusPostpartum: '产后与母乳喂养恢复',
    focusFasting: '断食与 OMAD 减重',
    ewlLabel: '多余体重减轻百分比 (%EWL)：',
    ewlDesc: (goalStr, unit) =>
      `减重外科医生通过目标/理想体重（${goalStr} ${unit}）追踪 %EWL。袖状胃切除或 RNY 胃旁路术后 12 个月的临床达标基准通常为 60%–75% EWL。`,
    glp1Label: 'GLP-1 临床试验基准：',
    glp1Reached20: '已达 SURMOUNT-1 (~20.9%) 基准',
    glp1Reached15: '已达 STEP-1 (~14.9%) 基准',
    glp1Target15: (targetStr, unit) => `${targetStr} ${unit} = 15% 减重目标`,
    glp1Desc:
      '临床研究显示，司美格鲁肽 68 周平均减重 14.9%，替尔泊肽 72 周平均减重 20.9%，瑞他鲁肽 (Retatrutide) 2 期试验 48 周达 24.2%。',
    postpartumLabel: '产后安全减重速度：',
    postpartumPace: '~0.5 千克 (1 磅) / 周',
    postpartumDesc:
      '分娩当天因胎儿、胎盘及羊水排出通常会减轻 5.5–7 千克；纯母乳喂养每日额外消耗约 450–500 千卡热量。',
    fastingLabel: '清水断食与 OMAD 减重分解：',
    fastingDesc:
      '断食前 1–3 天会释放 0.7–1.6 千克糖原与结合水分，同时每天氧化约 0.25 千克真正脂肪（TDEE ÷ 7700 千卡）。',
    mcdBuilderBtn: '麦当劳餐食热量计算器',
    subwayBuilderBtn: '赛百味三明治热量计算',
    mcdResultHeading: '麦当劳餐食预估总热量',
    stoneEquivalentLabel: '英石与磅换算 (st/lbs)：',
    relatedCalculatorsLabel: '相关计算工具：',
    howToTitle: '如何计算减重百分比',
    howToSteps: [
      {
        name: '用初始体重减去当前体重',
        text: '将您的初始体重减去当前体重，算出总减重数值（例如：80 千克 − 72 千克 = 减去 8 千克）。'
      },
      {
        name: '除以初始体重',
        text: '将减去的体重除以您的初始体重（8 ÷ 80 = 0.10）。'
      },
      {
        name: '乘以 100 得出百分比',
        text: '将结果乘以 100 即可获得精确的减重百分比（0.10 × 100 = 10%）。'
      }
    ],
    siloHubTitles: {
      percentage: '减重百分比计算器',
      newborn: '新生儿生理性体重下降计算器',
      'water-fasting': '清水断食与 OMAD 减重计算器',
      'glp1-calculator': 'GLP-1、司美格鲁肽与替尔泊肽计算器',
      calorie: '麦当劳与赛百味热量计算器',
      nutrition: '快餐营养与蛋白质计算器',
      lbs: '身高体重 BMI 参考 (157cm / 48kg)',
      much: '我已经减了多少体重计算器',
      calories: '每日热量赤字与饮食计算器',
      percent: '体重减轻百分比在线计算',
      baby: '婴儿出生体重变化计算器',
      keto: '生酮饮食 (Keto) 宏量营养素计算器',
      'metabolic-rate': '基础代谢率 (BMR) 临床计算器',
      'gastric-bypass': '胃旁路 (RNY) 与袖状胃手术减重计算器',
      'calculate-birth': '新生儿出生体重百分比核对',
      'per-month': '每月安全健康减重速度指南',
      bmr: 'BMR 代谢与 12 周减重预测计算器',
      infant: '婴幼儿体重增长与喂养评估工具',
      bmi: '身高体重 BMI 参考 (163cm / 52kg)',
      subway: '赛百味与麦当劳宏量营养计算',
      'bariatric-surgery': '减重代谢手术 (%EWL) 计算器',
      'biggest-loser': '团队减重百分比挑战赛计算器',
      calculate: '减重百分比计算公式详解',
      body: '总体重减轻百分比 (%TBWL) 指南',
      pounds: '新生儿出生体重下降 10% 换算表',
      tdee: 'TDEE 每日总能量消耗计算器'
    }
  }
};

