export interface LocalizedFAQItem {
  question: string;
  topic: string;
  answer: string;
}

export interface LocaleTranslation {
  htmlLang: string;
  hreflang: string;
  canonicalPath: string;
  metaTitle: string;
  metaDescription: string;
  searchPlaceholder: string;
  navPercentage: string;
  navNewborn: string;
  navBmr: string;
  navFaq: string;
  bylineReviewed: string;
  bylinePrivate: string;
  bylinePdf: string;
  heroTitle: string;
  heroIntro: string;
  tabAdult: string;
  tabNewborn: string;
  tabBmr: string;
  tabSubway: string;
  unitLbs: string;
  unitKg: string;
  presetHeading: string;
  startWeightLabel: string;
  currentWeightLabel: string;
  goalWeightLabel: string;
  optionalLabel: string;
  formulaLabel: string;
  worksInUnits: string;
  swapWeightsBtn: string;
  goalLabel: string;
  ofGoalLabel: string;
  milestone15: string;
  milestone10: string;
  milestone5: string;
  milestoneNext5: string;
  milestoneDescReached: string;
  lbsOzUnit: string;
  gramsUnit: string;
  birthWeightLbsOz: string;
  currentWeightLbsOz: string;
  birthWeightGrams: string;
  currentWeightGrams: string;
  babyAgeHours: string;
  hoursOldSuffix: string;
  aapOver10Title: string;
  aapOver10Desc: string;
  aap7To10Title: string;
  aap7To10Desc: string;
  aapUnder7Title: string;
  aapUnder7Desc: string;
  ageYearsLabel: string;
  sexLabel: string;
  femaleLabel: string;
  maleLabel: string;
  heightInchesLabel: string;
  activityLabel: string;
  restingBurnLabel: string;
  maintenanceLabel: string;
  steadyLossLabel: string;
  resultHeadingAdult: string;
  resultHeadingNewborn: string;
  resultHeadingBmr: string;
  resultHeadingSubway: string;
  printPdf: string;
  savedPdf: string;
  downloadReport: string;
  pdfReportDownloaded: string;
  copySummary: string;
  copied: string;
  celebrate: string;
  faqTitle: string;
  faqSubtitle: string;
  directoryTitle: string;
  directorySubtitle: string;
  faqs: LocalizedFAQItem[];
}

const EN_FAQS: LocalizedFAQItem[] = [
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
      'After bariatric surgery, doctors usually track both total body weight loss and excess weight loss. Most patients lose about 60% to 70% of their excess body weight over the first 12 to 18 months, with the fastest drop happening in the first 3 months while your appetite and metabolism adjust.'
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
      'Yes. Click or tap the Download Report button in the results box to save a clean, one-page PDF summary. It includes your starting weight, current change, percentage lost, and key health milestones that you can keep for your records or bring to your next appointment.'
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

export const LOCALE_TRANSLATIONS: Record<string, LocaleTranslation> = {
  en: {
    htmlLang: 'en',
    hreflang: 'en',
    canonicalPath: '/',
    metaTitle: 'Weight Loss Percentage Calculator | Free Adult, Newborn & BMR Tool',
    metaDescription:
      'Free, medically reviewed Weight Loss Calculator. Instantly calculate adult weight loss percentage, newborn weight change after birth, BMR, and daily calorie goals.',
    searchPlaceholder: 'Search 24 calculators & guides (e.g., Newborn, BMR, Keto, Pregnancy, BMI)...',
    navPercentage: 'Percentage Calculator',
    navNewborn: 'Newborn Calculator',
    navBmr: 'BMR & TDEE',
    navFaq: 'Clinical FAQ',
    bylineReviewed: '✓ Medically Reviewed by Dr. Rekha Kumar, M.D., M.S.',
    bylinePrivate: 'Private in your browser',
    bylinePdf: 'Free PDF summary',
    heroTitle: 'Weight Loss Calculator',
    heroIntro:
      'Find your weight loss percentage, check a newborn’s weight change after birth, or estimate your daily calorie needs. Everything runs privately in your browser with nothing saved on a server, and you can download a clean PDF summary anytime.',
    tabAdult: 'Weight Loss %',
    tabNewborn: 'Newborn Loss',
    tabBmr: 'BMR & TDEE',
    tabSubway: 'Subway Calories',
    unitLbs: 'Pounds (lbs)',
    unitKg: 'Kilograms (kg)',
    presetHeading: 'Try a quick example:',
    startWeightLabel: 'Starting Weight',
    currentWeightLabel: 'Current Weight',
    goalWeightLabel: 'Target Goal Weight',
    optionalLabel: '(Optional)',
    formulaLabel: 'Formula: ((Starting Weight − Current Weight) ÷ Starting Weight) × 100',
    worksInUnits: 'Works in lbs or kg',
    swapWeightsBtn: 'Swap Weights',
    goalLabel: 'Goal',
    ofGoalLabel: 'of goal',
    milestone15: '15% Health Milestone Reached',
    milestone10: '10% Health Milestone Reached',
    milestone5: '5% Health Milestone Reached',
    milestoneNext5: 'Next Health Milestone: 5%',
    milestoneDescReached:
      'Losing 5% to 10% of your starting weight is proven to help lower blood pressure, improve blood sugar, and ease joint strain.',
    lbsOzUnit: 'Pounds & Ounces (lbs/oz)',
    gramsUnit: 'Metric Grams (g)',
    birthWeightLbsOz: 'Birth Weight (lbs & oz)',
    currentWeightLbsOz: 'Current Weight (lbs & oz)',
    birthWeightGrams: 'Birth Weight (grams)',
    currentWeightGrams: 'Current Weight (grams)',
    babyAgeHours: 'Baby Age Since Birth (Hours)',
    hoursOldSuffix: 'hours old',
    aapOver10Title: 'Check With Your Pediatrician (Over 10%)',
    aapOver10Desc:
      'A drop of more than 10% from birth weight means it is a good idea to contact your pediatrician or lactation consultant today to check feeding.',
    aap7To10Title: 'Worth Watching Closely (7% to 10%)',
    aap7To10Desc:
      'A 7% to 10% drop is common around days 2 to 3, though your care team may want to check latch, feeding frequency, and wet diapers.',
    aapUnder7Title: 'Typical Newborn Fluid Loss (Under 7%)',
    aapUnder7Desc:
      'Healthy newborns commonly lose 5% to 7% of their birth weight in the first few days as they pass extra fluid, then regain it by day 10 to 14.',
    ageYearsLabel: 'Age (Years)',
    sexLabel: 'Biological Sex',
    femaleLabel: 'Female',
    maleLabel: 'Male',
    heightInchesLabel: 'Height (Inches)',
    activityLabel: 'Physical Activity Multiplier',
    restingBurnLabel: 'Resting Burn (BMR):',
    maintenanceLabel: 'Maintenance Calories (TDEE):',
    steadyLossLabel: 'Steady Loss (~1 lb/week):',
    resultHeadingAdult: 'Body Weight Percentage Loss',
    resultHeadingNewborn: 'Newborn Weight Change',
    resultHeadingBmr: 'Your Daily Calorie Estimates',
    resultHeadingSubway: 'Estimated Meal Total',
    printPdf: 'Print PDF',
    savedPdf: 'Saved PDF',
    downloadReport: 'Download Report',
    pdfReportDownloaded: 'PDF Report Downloaded!',
    copySummary: 'Copy Summary',
    copied: 'Copied!',
    celebrate: 'Celebrate',
    faqTitle: 'Common Questions About Weight Loss Percentage',
    faqSubtitle: 'Clear, practical answers reviewed by Dr. Rekha Kumar, M.D., M.S.',
    directoryTitle: 'All 24 Calculators & Reference Guides',
    directorySubtitle:
      'Jump directly to any topic, from adult weight loss math and newborn weight checks to daily calorie needs, BMI examples, and nutrition guides:',
    faqs: EN_FAQS
  },
  ca: {
    htmlLang: 'en-CA',
    hreflang: 'en-ca',
    canonicalPath: '/ca/',
    metaTitle: 'Weight Loss Percentage Calculator Canada | Adult, Newborn & BMR Tool',
    metaDescription:
      'Free Canadian Weight Loss Calculator in pounds (lbs) and kilograms (kg). Calculate adult weight loss percentage, newborn weight change, and BMR.',
    searchPlaceholder: 'Search 24 calculators & guides (e.g., Newborn, BMR, Kilograms, BMI)...',
    navPercentage: 'Percentage Calculator',
    navNewborn: 'Newborn Calculator',
    navBmr: 'BMR & TDEE',
    navFaq: 'Clinical FAQ',
    bylineReviewed: '✓ Medically Reviewed by Dr. Rekha Kumar, M.D., M.S.',
    bylinePrivate: 'Private in your browser',
    bylinePdf: 'Free PDF summary',
    heroTitle: 'Weight Loss Calculator',
    heroIntro:
      'Find your weight loss percentage in pounds or kilograms, check a newborn’s weight change after birth, or estimate your daily calorie needs. Everything runs privately in your browser, and you can download a clean PDF summary anytime.',
    tabAdult: 'Weight Loss %',
    tabNewborn: 'Newborn Loss',
    tabBmr: 'BMR & TDEE',
    tabSubway: 'Subway Calories',
    unitLbs: 'Pounds (lbs)',
    unitKg: 'Kilograms (kg)',
    presetHeading: 'Try a quick example:',
    startWeightLabel: 'Starting Weight',
    currentWeightLabel: 'Current Weight',
    goalWeightLabel: 'Target Goal Weight',
    optionalLabel: '(Optional)',
    formulaLabel: 'Formula: ((Starting Weight − Current Weight) ÷ Starting Weight) × 100',
    worksInUnits: 'Works in lbs or kg',
    swapWeightsBtn: 'Swap Weights',
    goalLabel: 'Goal',
    ofGoalLabel: 'of goal',
    milestone15: '15% Health Milestone Reached',
    milestone10: '10% Health Milestone Reached',
    milestone5: '5% Health Milestone Reached',
    milestoneNext5: 'Next Health Milestone: 5%',
    milestoneDescReached:
      'Losing 5% to 10% of your starting weight is proven to help lower blood pressure, improve blood sugar, and ease joint strain.',
    lbsOzUnit: 'Pounds & Ounces (lbs/oz)',
    gramsUnit: 'Metric Grams (g)',
    birthWeightLbsOz: 'Birth Weight (lbs & oz)',
    currentWeightLbsOz: 'Current Weight (lbs & oz)',
    birthWeightGrams: 'Birth Weight (grams)',
    currentWeightGrams: 'Current Weight (grams)',
    babyAgeHours: 'Baby Age Since Birth (Hours)',
    hoursOldSuffix: 'hours old',
    aapOver10Title: 'Check With Your Pediatrician (Over 10%)',
    aapOver10Desc:
      'A drop of more than 10% from birth weight means it is a good idea to contact your pediatrician or lactation consultant today to check feeding.',
    aap7To10Title: 'Worth Watching Closely (7% to 10%)',
    aap7To10Desc:
      'A 7% to 10% drop is common around days 2 to 3, though your care team may want to check latch, feeding frequency, and wet diapers.',
    aapUnder7Title: 'Typical Newborn Fluid Loss (Under 7%)',
    aapUnder7Desc:
      'Healthy newborns commonly lose 5% to 7% of their birth weight in the first few days as they pass extra fluid, then regain it by day 10 to 14.',
    ageYearsLabel: 'Age (Years)',
    sexLabel: 'Biological Sex',
    femaleLabel: 'Female',
    maleLabel: 'Male',
    heightInchesLabel: 'Height (Inches)',
    activityLabel: 'Physical Activity Multiplier',
    restingBurnLabel: 'Resting Burn (BMR):',
    maintenanceLabel: 'Maintenance Calories (TDEE):',
    steadyLossLabel: 'Steady Loss (~1 lb/week):',
    resultHeadingAdult: 'Body Weight Percentage Loss',
    resultHeadingNewborn: 'Newborn Weight Change',
    resultHeadingBmr: 'Your Daily Calorie Estimates',
    resultHeadingSubway: 'Estimated Meal Total',
    printPdf: 'Print PDF',
    savedPdf: 'Saved PDF',
    downloadReport: 'Download Report',
    pdfReportDownloaded: 'PDF Report Downloaded!',
    copySummary: 'Copy Summary',
    copied: 'Copied!',
    celebrate: 'Celebrate',
    faqTitle: 'Common Questions About Weight Loss Percentage',
    faqSubtitle: 'Clear, practical answers reviewed by Dr. Rekha Kumar, M.D., M.S.',
    directoryTitle: 'All 24 Calculators & Reference Guides',
    directorySubtitle:
      'Jump directly to any topic, from adult weight loss math and newborn weight checks to daily calorie needs, BMI examples, and nutrition guides:',
    faqs: EN_FAQS
  },
  uk: {
    htmlLang: 'en-GB',
    hreflang: 'en-gb',
    canonicalPath: '/uk/',
    metaTitle: 'Weight Loss Percentage Calculator UK | Free Adult, Newborn & BMR Tool',
    metaDescription:
      'Free UK Weight Loss Calculator in kilograms (kg) and pounds (lbs). Calculate adult weight loss percentage, newborn weight change after birth, and BMR.',
    searchPlaceholder: 'Search 24 calculators & guides (e.g., Newborn, BMR, Kilograms, BMI)...',
    navPercentage: 'Percentage Calculator',
    navNewborn: 'Newborn Calculator',
    navBmr: 'BMR & TDEE',
    navFaq: 'Clinical FAQ',
    bylineReviewed: '✓ Medically Reviewed by Dr. Rekha Kumar, M.D., M.S.',
    bylinePrivate: 'Private in your browser',
    bylinePdf: 'Free PDF summary',
    heroTitle: 'Weight Loss Calculator',
    heroIntro:
      'Find your weight loss percentage in kilograms or pounds, check a newborn’s weight change after birth, or estimate your daily calorie needs. Everything runs privately in your browser, and you can download a clean PDF summary anytime.',
    tabAdult: 'Weight Loss %',
    tabNewborn: 'Newborn Loss',
    tabBmr: 'BMR & TDEE',
    tabSubway: 'Subway Calories',
    unitLbs: 'Pounds (lbs)',
    unitKg: 'Kilograms (kg)',
    presetHeading: 'Try a quick example:',
    startWeightLabel: 'Starting Weight',
    currentWeightLabel: 'Current Weight',
    goalWeightLabel: 'Target Goal Weight',
    optionalLabel: '(Optional)',
    formulaLabel: 'Formula: ((Starting Weight − Current Weight) ÷ Starting Weight) × 100',
    worksInUnits: 'Works in kg or lbs',
    swapWeightsBtn: 'Swap Weights',
    goalLabel: 'Goal',
    ofGoalLabel: 'of goal',
    milestone15: '15% Health Milestone Reached',
    milestone10: '10% Health Milestone Reached',
    milestone5: '5% Health Milestone Reached',
    milestoneNext5: 'Next Health Milestone: 5%',
    milestoneDescReached:
      'Losing 5% to 10% of your starting weight is proven to help lower blood pressure, improve blood sugar, and ease joint strain.',
    lbsOzUnit: 'Pounds & Ounces (lbs/oz)',
    gramsUnit: 'Metric Grams (g)',
    birthWeightLbsOz: 'Birth Weight (lbs & oz)',
    currentWeightLbsOz: 'Current Weight (lbs & oz)',
    birthWeightGrams: 'Birth Weight (grams)',
    currentWeightGrams: 'Current Weight (grams)',
    babyAgeHours: 'Baby Age Since Birth (Hours)',
    hoursOldSuffix: 'hours old',
    aapOver10Title: 'Check With Your Midwife or GP (Over 10%)',
    aapOver10Desc:
      'A drop of more than 10% from birth weight means it is a good idea to contact your midwife, health visitor, or pediatrician today to check feeding.',
    aap7To10Title: 'Worth Watching Closely (7% to 10%)',
    aap7To10Desc:
      'A 7% to 10% drop is common around days 2 to 3, though your care team may want to check latch, feeding frequency, and wet nappies.',
    aapUnder7Title: 'Typical Newborn Fluid Loss (Under 7%)',
    aapUnder7Desc:
      'Healthy newborns commonly lose 5% to 7% of their birth weight in the first few days as they pass extra fluid, then regain it by day 10 to 14.',
    ageYearsLabel: 'Age (Years)',
    sexLabel: 'Biological Sex',
    femaleLabel: 'Female',
    maleLabel: 'Male',
    heightInchesLabel: 'Height (Inches)',
    activityLabel: 'Physical Activity Multiplier',
    restingBurnLabel: 'Resting Burn (BMR):',
    maintenanceLabel: 'Maintenance Calories (TDEE):',
    steadyLossLabel: 'Steady Loss (~0.5 kg/week):',
    resultHeadingAdult: 'Body Weight Percentage Loss',
    resultHeadingNewborn: 'Newborn Weight Change',
    resultHeadingBmr: 'Your Daily Calorie Estimates',
    resultHeadingSubway: 'Estimated Meal Total',
    printPdf: 'Print PDF',
    savedPdf: 'Saved PDF',
    downloadReport: 'Download Report',
    pdfReportDownloaded: 'PDF Report Downloaded!',
    copySummary: 'Copy Summary',
    copied: 'Copied!',
    celebrate: 'Celebrate',
    faqTitle: 'Common Questions About Weight Loss Percentage',
    faqSubtitle: 'Clear, practical answers reviewed by Dr. Rekha Kumar, M.D., M.S.',
    directoryTitle: 'All 24 Calculators & Reference Guides',
    directorySubtitle:
      'Jump directly to any topic, from adult weight loss math and newborn weight checks to daily calorie needs, BMI examples, and nutrition guides:',
    faqs: EN_FAQS
  },
  de: {
    htmlLang: 'de',
    hreflang: 'de',
    canonicalPath: '/de/',
    metaTitle: 'Gewichtsverlust-Rechner (Weight Loss Calculator) | Prozent, Neugeborene & BMR',
    metaDescription:
      'Kostenloser, medizinisch geprüfter Gewichtsverlust-Rechner. Berechnen Sie Ihren prozentualen Gewichtsverlust, die Gewichtsabnahme bei Neugeborenen und Ihren Grundumsatz (BMR).',
    searchPlaceholder: 'Alle 24 Rechner & Ratgeber durchsuchen (z. B. Neugeborene, BMR, Keto, BMI)...',
    navPercentage: 'Gewichtsverlust %',
    navNewborn: 'Neugeborenen-Rechner',
    navBmr: 'Grundumsatz (BMR)',
    navFaq: 'Klinische FAQ',
    bylineReviewed: '✓ Medizinisch geprüft von Dr. Rekha Kumar, M.D., M.S.',
    bylinePrivate: 'Privat in Ihrem Browser',
    bylinePdf: 'Kostenloser PDF-Bericht',
    heroTitle: 'Gewichtsverlust-Rechner (Weight Loss Calculator)',
    heroIntro:
      'Berechnen Sie Ihren prozentualen Gewichtsverlust, prüfen Sie die Gewichtsänderung eines Neugeborenen nach der Geburt oder schätzen Sie Ihren täglichen Kalorienbedarf. Alles läuft privat im Browser, inklusive kostenlosem PDF-Bericht.',
    tabAdult: 'Gewichtsverlust %',
    tabNewborn: 'Neugeborene',
    tabBmr: 'BMR & Kalorien',
    tabSubway: 'Subway Kalorien',
    unitLbs: 'Pfund (lbs)',
    unitKg: 'Kilogramm (kg)',
    presetHeading: 'Schnelles Beispiel testen:',
    startWeightLabel: 'Startgewicht',
    currentWeightLabel: 'Aktuelles Gewicht',
    goalWeightLabel: 'Zielgewicht',
    optionalLabel: '(Optional)',
    formulaLabel: 'Formel: ((Startgewicht − Aktuelles Gewicht) ÷ Startgewicht) × 100',
    worksInUnits: 'Für kg und lbs geeignet',
    swapWeightsBtn: 'Werte tauschen',
    goalLabel: 'Ziel',
    ofGoalLabel: 'vom Ziel',
    milestone15: '15% Gesundheits-Meilenstein erreicht',
    milestone10: '10% Gesundheits-Meilenstein erreicht',
    milestone5: '5% Gesundheits-Meilenstein erreicht',
    milestoneNext5: 'Nächster Meilenstein: 5%',
    milestoneDescReached:
      'Ein Verlust von 5% bis 10% des Ausgangsgewichts senkt nachweislich den Blutdruck, verbessert den Blutzucker (HbA1c) und entlastet die Gelenke.',
    lbsOzUnit: 'Pfund & Unzen (lbs/oz)',
    gramsUnit: 'Metrische Gramm (g)',
    birthWeightLbsOz: 'Geburtsgewicht (lbs & oz)',
    currentWeightLbsOz: 'Aktuelles Gewicht (lbs & oz)',
    birthWeightGrams: 'Geburtsgewicht (Gramm)',
    currentWeightGrams: 'Aktuelles Gewicht (Gramm)',
    babyAgeHours: 'Alter seit der Geburt (Stunden)',
    hoursOldSuffix: 'Stunden alt',
    aapOver10Title: 'Kinderärztliche Kontrolle empfohlen (Über 10%)',
    aapOver10Desc:
      'Ein Gewichtsverlust von mehr als 10% erfordert eine zeitnahe Rücksprache mit Kinderarzt, Hebamme oder Stillberatung zur Überprüfung des Stillens.',
    aap7To10Title: 'Engmaschig beobachten (7% bis 10%)',
    aap7To10Desc:
      'Ein Rückgang von 7% bis 10% ist um den 2. bis 3. Lebenstag häufig; Anlegetechnik, Trinkhäufigkeit und nasse Windeln sollten geprüft werden.',
    aapUnder7Title: 'Normale Neugeborenen-Abnahme (Unter 7%)',
    aapUnder7Desc:
      'Gesunde Neugeborene verlieren in den ersten Tagen meist 5% bis 7% Flüssigkeit und erreichen ihr Geburtsgewicht bis Tag 10 bis 14 wieder.',
    ageYearsLabel: 'Alter (Jahre)',
    sexLabel: 'Biologisches Geschlecht',
    femaleLabel: 'Weiblich',
    maleLabel: 'Männlich',
    heightInchesLabel: 'Größe (Zoll / in)',
    activityLabel: 'Körperliche Aktivität',
    restingBurnLabel: 'Grundumsatz (BMR):',
    maintenanceLabel: 'Erhaltungskalorien (TDEE):',
    steadyLossLabel: 'Gesunde Abnahme (~0,5 kg/Woche):',
    resultHeadingAdult: 'Prozentualer Gewichtsverlust',
    resultHeadingNewborn: 'Gewichtsänderung Neugeborenes',
    resultHeadingBmr: 'Täglicher Kalorienbedarf',
    resultHeadingSubway: 'Geschätzte Mahlzeit-Kalorien',
    printPdf: 'PDF drucken',
    savedPdf: 'PDF gespeichert',
    downloadReport: 'PDF-Bericht laden',
    pdfReportDownloaded: 'PDF-Bericht geladen!',
    copySummary: 'Kopieren',
    copied: 'Kopiert!',
    celebrate: 'Feiern',
    faqTitle: 'Häufige Fragen zum prozentualen Gewichtsverlust',
    faqSubtitle: 'Klare, praxisnahe Antworten, geprüft von Dr. Rekha Kumar, M.D., M.S.',
    directoryTitle: 'Alle 24 Rechner & Klinischen Fachratgeber',
    directorySubtitle:
      'Wählen Sie direkt einen passenden Rechner oder Leitfaden, von der Prozentformel über Neugeborenen-Gewicht bis hin zu Grundumsatz und BMI:',
    faqs: [
      {
        question: 'Wie berechne ich den prozentualen Gewichtsverlust genau?',
        topic: 'Die Formel',
        answer:
          'Ziehen Sie Ihr aktuelles Gewicht vom Startgewicht ab, teilen Sie die Differenz durch das Startgewicht und multiplizieren Sie das Ergebnis mit 100. Wenn Sie bei 100 kg gestartet sind und jetzt 90 kg wiegen, beträgt Ihr Verlust (10 ÷ 100) × 100 = 10%. Diese Formel gilt identisch für Kilogramm, Pfund und Gramm.'
      },
      {
        question: 'Wie interpretiere ich mein Ergebnis beim Gewichtsverlust in Prozent?',
        topic: 'Gesundheits-Meilensteine',
        answer:
          'Konzentrieren Sie sich auf die 5%- und 10%-Meilensteine statt auf tägliche Schwankungen der Waage. Ärzte und Endokrinologen nutzen eine Reduktion um 5% bis 10% als klinischen Richtwert, da sich ab diesem Punkt Blutdruck, Blutzucker (HbA1c) und Cholesterinwerte spürbar verbessern.'
      },
      {
        question: 'Wie berechnet man den Gewichtsverlust bei Neugeborenen nach der Geburt?',
        topic: 'Neugeborenen-Pflege',
        answer:
          'Ziehen Sie das aktuelle Gewicht des Babys vom Geburtsgewicht ab, teilen Sie durch das Geburtsgewicht und multiplizieren Sie mit 100. Ein Verlust von 5% bis 7% in den ersten 2 bis 3 Lebenstagen durch Flüssigkeitsausscheidung ist physiologisch normal. Ab 10% Verlust sollte eine kinderärztliche oder Still-Kontrolle erfolgen.'
      },
      {
        question: 'Wie viel Gewicht kann man in einem Monat gesund abnehmen?',
        topic: 'Gesundes Tempo',
        answer:
          'Für die meisten Erwachsenen gilt ein Tempo von 0,5 bis 1 Kilogramm pro Woche, also etwa 2 bis 4 Kilogramm pro Monat, als optimal. Ein Verlust von deutlich mehr als 1% des Körpergewichts pro Woche erhöht das Risiko für Muskelabbau, Erschöpfung und Gallensteine.'
      },
      {
        question: 'Wie hoch ist der typische Gewichtsverlust nach einer Schlauchmagen- oder Bypass-OP?',
        topic: 'Bariatrische Medizin',
        answer:
          'Nach bariatrischen Eingriffen dokumentieren Ärzte sowohl den Gesamtgewichtsverlust als auch den Verlust des Übergewichts. Die meisten Patienten verlieren innerhalb von 12 bis 18 Monaten rund 60% bis 70% ihres Übergewichts, wobei die stärkste Abnahme in den ersten 3 Monaten stattfindet.'
      },
      {
        question: 'Wie berechne ich das Gewicht eines Babys in Pfund und Unzen?',
        topic: 'Einheiten-Umrechnung',
        answer:
          'Da ein Pfund aus 16 Unzen besteht, rechnen Sie beide Gewichte zuerst in Gesamtunzen um: (Pfund × 16) + Unzen. Ziehen Sie die aktuellen Unzen von den Geburtsunzen ab, teilen Sie durch die Geburtsunzen und multiplizieren Sie mit 100, oder nutzen Sie direkt unseren Neugeborenen-Rechner oben.'
      },
      {
        question: 'Werden meine Gewichtsdaten auf Ihren Servern gespeichert?',
        topic: 'Datenschutz',
        answer:
          'Nein. Jede Berechnung erfolgt vollständig lokal in Ihrem Webbrowser auf Ihrem Smartphone oder Computer. Keine Ihrer eingegebenen Zahlen wird jemals an einen Server übertragen oder in einer Datenbank gespeichert.'
      },
      {
        question: 'Kann ich meine Ergebnisse für den Arzttermin als PDF speichern oder drucken?',
        topic: 'PDF-Bericht',
        answer:
          'Ja. Klicken Sie im Ergebnisfeld auf die Schaltfläche PDF-Bericht laden, um eine übersichtliche Zusammenfassung herunterzuladen. Der Bericht enthält Startgewicht, Differenz, Prozentsatz und klinische Meilensteine für Ihre Unterlagen.'
      },
      {
        question: 'Wie viel Gewicht verliert man direkt nach der Entbindung?',
        topic: 'Rückbildung nach Geburt',
        answer:
          'Unmittelbar nach der Geburt verlieren Mütter durch das Gewicht von Baby, Plazenta und Fruchtwasser durchschnittlich 5 bis 7 Kilogramm. In den folgenden 4 bis 6 Wochen gehen meist weitere 2 bis 4 Kilogramm eingelagerte Flüssigkeit zurück.'
      },
      {
        question: 'Was ist der Unterschied zwischen prozentualem Gewichtsverlust und Körperfettanteil?',
        topic: 'Körperzusammensetzung',
        answer:
          'Der prozentuale Gewichtsverlust misst die Veränderung des gesamten Körpergewichts auf der Waage im Vergleich zum Startgewicht. Der Körperfettanteil gibt an, wie viel Prozent des Körpers aus Fettgewebe gegenüber Muskeln, Knochen und Wasser bestehen.'
      }
    ]
  },
  it: {
    htmlLang: 'it',
    hreflang: 'it',
    canonicalPath: '/it/',
    metaTitle: 'Calcolatore Perdita di Peso (Weight Loss Calculator) | Percentuale, Neonato & BMR',
    metaDescription:
      'Calcolatore gratuito e validato medicamente per la percentuale di perdita di peso negli adulti, il calo ponderale del neonato e il metabolismo basale (BMR).',
    searchPlaceholder: 'Cerca tra i 24 calcolatori e guide (es. Neonato, BMR, Keto, BMI)...',
    navPercentage: 'Calcolo Percentuale',
    navNewborn: 'Peso Neonato',
    navBmr: 'Metabolismo (BMR)',
    navFaq: 'Domande Frequenti',
    bylineReviewed: '✓ Revisione medica: Dr. Rekha Kumar, M.D., M.S.',
    bylinePrivate: 'Privato nel browser',
    bylinePdf: 'Riepilogo PDF gratuito',
    heroTitle: 'Calcolatore Perdita di Peso (Weight Loss Calculator)',
    heroIntro:
      'Calcola la tua percentuale di perdita di peso, controlla il calo fisiologico del neonato dopo la nascita o stima il tuo fabbisogno calorico giornaliero. Tutto funziona privatamente nel browser con riepilogo PDF gratuito.',
    tabAdult: 'Perdita Peso %',
    tabNewborn: 'Calo Neonato',
    tabBmr: 'BMR e TDEE',
    tabSubway: 'Calorie Subway',
    unitLbs: 'Libbre (lbs)',
    unitKg: 'Chilogrammi (kg)',
    presetHeading: 'Prova un esempio rapido:',
    startWeightLabel: 'Peso Iniziale',
    currentWeightLabel: 'Peso Attuale',
    goalWeightLabel: 'Peso Obiettivo',
    optionalLabel: '(Opzionale)',
    formulaLabel: 'Formula: ((Peso Iniziale − Peso Attuale) ÷ Peso Iniziale) × 100',
    worksInUnits: 'Funziona in kg o lbs',
    swapWeightsBtn: 'Inverti Pesi',
    goalLabel: 'Obiettivo',
    ofGoalLabel: 'dell’obiettivo',
    milestone15: 'Traguardo Clinico del 15% Raggiunto',
    milestone10: 'Traguardo Clinico del 10% Raggiunto',
    milestone5: 'Traguardo Clinico del 5% Raggiunto',
    milestoneNext5: 'Prossimo Traguardo Salute: 5%',
    milestoneDescReached:
      'Perdere dal 5% al 10% del peso iniziale aiuta concretamente a ridurre la pressione arteriosa, migliorare la glicemia e alleggerire le articolazioni.',
    lbsOzUnit: 'Libbre e Once (lbs/oz)',
    gramsUnit: 'Grammi Metrici (g)',
    birthWeightLbsOz: 'Peso alla Nascita (lbs & oz)',
    currentWeightLbsOz: 'Peso Attuale (lbs & oz)',
    birthWeightGrams: 'Peso alla Nascita (grammi)',
    currentWeightGrams: 'Peso Attuale (grammi)',
    babyAgeHours: 'Età del Neonato dalla Nascita (Ore)',
    hoursOldSuffix: 'ore di vita',
    aapOver10Title: 'Consultare il Pediatra (Oltre il 10%)',
    aapOver10Desc:
      'Un calo superiore al 10% rispetto al peso alla nascita richiede una valutazione tempestiva con il pediatra o la consulente per l’allattamento.',
    aap7To10Title: 'Da Monitorare con Attenzione (7% a 10%)',
    aap7To10Desc:
      'Un calo tra il 7% e il 10% è frequente tra il secondo e il terzo giorno; è utile verificare attacco al seno, poppate e pannolini bagnati.',
    aapUnder7Title: 'Calo Fisiologico Normale (Sotto il 7%)',
    aapUnder7Desc:
      'I neonati sani perdono normalmente dal 5% al 7% di liquidi nei primi giorni e recuperano il peso alla nascita entro il decimo o quattordicesimo giorno.',
    ageYearsLabel: 'Età (Anni)',
    sexLabel: 'Sesso Biologico',
    femaleLabel: 'Femmina',
    maleLabel: 'Maschio',
    heightInchesLabel: 'Altezza (Pollici / in)',
    activityLabel: 'Livello di Attività Fisica',
    restingBurnLabel: 'Metabolismo Basale (BMR):',
    maintenanceLabel: 'Calorie di Mantenimento (TDEE):',
    steadyLossLabel: 'Dimagrimento Sicuro (~0,5 kg/sett.):',
    resultHeadingAdult: 'Percentuale di Peso Perso',
    resultHeadingNewborn: 'Variazione Peso Neonato',
    resultHeadingBmr: 'Stima Calorie Giornaliere',
    resultHeadingSubway: 'Totale Calorie Pasto',
    printPdf: 'Stampa PDF',
    savedPdf: 'PDF Salvato',
    downloadReport: 'Scarica Report',
    pdfReportDownloaded: 'Report PDF Scaricato!',
    copySummary: 'Copia Riepilogo',
    copied: 'Copiato!',
    celebrate: 'Festeggia',
    faqTitle: 'Domande Frequenti sulla Percentuale di Perdita di Peso',
    faqSubtitle: 'Risposte pratiche revisionate dalla Dott.ssa Rekha Kumar, M.D., M.S.',
    directoryTitle: 'Tutti i 24 Calcolatori e Guide Cliniche',
    directorySubtitle:
      'Accedi rapidamente a qualsiasi argomento, dal calcolo percentuale per adulti e il calo ponderale del neonato fino a BMR, BMI e nutrizione:',
    faqs: [
      {
        question: 'Come si calcola con precisione la percentuale di perdita di peso?',
        topic: 'La Formula',
        answer:
          'Sottrai il peso attuale dal peso iniziale, dividi il risultato per il peso iniziale e moltiplica per 100. Ad esempio, passando da 90 kg a 81 kg hai perso 9 kg: (9 ÷ 90) × 100 = 10%. Lo stesso calcolo vale sia in chilogrammi che in libbre o grammi.'
      },
      {
        question: 'Come devo interpretare i risultati della percentuale di peso perso?',
        topic: 'Traguardi di Salute',
        answer:
          'Concentrati sui traguardi del 5% e del 10% anziché sulle oscillazioni giornaliere della bilancia. Medici ed endocrinologi considerano una riduzione del 5% o 10% come soglia clinica fondamentale per migliorare pressione arteriosa, glicemia (HbA1c), colesterolo e salute articolare.'
      },
      {
        question: 'Come si calcola la percentuale di calo ponderale del neonato dopo la nascita?',
        topic: 'Cura del Neonato',
        answer:
          'Sottrai il peso attuale del neonato dal peso alla nascita, dividi per il peso alla nascita e moltiplica per 100. È del tutto fisiologico che un neonato sano perda dal 5% al 7% nei primi 2 o 3 giorni eliminando i liquidi in eccesso; un calo pari o superiore al 10% richiede il controllo del pediatra.'
      },
      {
        question: 'Quanto peso si può perdere in modo sicuro in un mese?',
        topic: 'Ritmo Salutare',
        answer:
          'Per la maggior parte degli adulti, un ritmo costante di 0,5 o 1 kg a settimana, pari a circa 2 o 4 kg al mese, è il modo più sicuro per ridurre la massa grassa preservando i muscoli e l’energia.'
      },
      {
        question: 'Qual è la perdita di peso tipica dopo chirurgia bariatrica (sleeve o bypass)?',
        topic: 'Chirurgia Bariatrica',
        answer:
          'Dopo un intervento bariatrico gli specialisti monitorano sia il peso totale perso sia la percentuale di eccesso di peso perduto. La maggior parte dei pazienti perde tra il 60% e il 70% del peso in eccesso nei primi 12 o 18 mesi.'
      },
      {
        question: 'Come calcolo il calo del neonato usando libbre e once?',
        topic: 'Conversione Unità',
        answer:
          'Poiché una libbra equivale a 16 once, converti prima entrambi i pesi in once totali: (libbre × 16) + once. Sottrai le once attuali da quelle alla nascita, dividi per le once alla nascita e moltiplica per 100, oppure inserisci direttamente i valori nella scheda Calo Neonato qui sopra.'
      },
      {
        question: 'I miei dati di peso vengono salvati sui vostri server?',
        topic: 'Privacy',
        answer:
          'No. Ogni calcolo avviene interamente nel tuo browser web su telefono o computer. Nessun valore inserito viene mai inviato a un server esterno o memorizzato in un database.'
      },
      {
        question: 'Posso salvare o stampare i risultati per una visita medica?',
        topic: 'Salvataggio Report PDF',
        answer:
          'Sì. Premi il pulsante Scarica Report nel riquadro dei risultati per salvare un riepilogo PDF di una pagina con peso iniziale, variazione, percentuale e traguardi clinici da mostrare al medico.'
      },
      {
        question: 'Quanto peso si perde solitamente subito dopo il parto?',
        topic: 'Recupero Post-Parto',
        answer:
          'La maggior parte delle neomamme perde circa 5 o 7 kg immediatamente dopo il parto grazie al peso combinato di bambino, placenta e liquido amniotico, seguiti da altri 2 o 4 kg di liquidi nelle successive 4 o 6 settimane.'
      },
      {
        question: 'Qual è la differenza tra percentuale di perdita di peso e percentuale di massa grassa?',
        topic: 'Composizione Corporea',
        answer:
          'La percentuale di perdita di peso misura la variazione del peso corporeo totale rispetto al punto di partenza, mentre la percentuale di massa grassa stima la quota di tessuto adiposo rispetto a muscoli, ossa e acqua.'
      }
    ]
  },
  ru: {
    htmlLang: 'ru',
    hreflang: 'ru',
    canonicalPath: '/ru/',
    metaTitle: 'Калькулятор потери веса (Weight Loss Calculator) | Процент, Новорожденные и BMR',
    metaDescription:
      'Бесплатный медицинский калькулятор процента потери веса для взрослых, контроля потери веса у новорожденных и расчета базового метаболизма (BMR).',
    searchPlaceholder: 'Поиск по 24 калькуляторам и руководствам (например: Новорожденный, BMR, Кето, ИМТ)...',
    navPercentage: 'Калькулятор % веса',
    navNewborn: 'Вес новорожденного',
    navBmr: 'Калории (BMR)',
    navFaq: 'Вопросы и ответы',
    bylineReviewed: '✓ Проверено врачом: д-р Рекха Кумар, M.D., M.S.',
    bylinePrivate: 'Приватно в браузере',
    bylinePdf: 'Бесплатный PDF-отчет',
    heroTitle: 'Калькулятор потери веса (Weight Loss Calculator)',
    heroIntro:
      'Рассчитайте процент потери веса, проверьте изменение веса новорожденного после рождения или оцените суточную норму калорий. Все расчеты выполняются приватно в браузере с возможностью скачать чистый PDF-отчет.',
    tabAdult: 'Потеря веса %',
    tabNewborn: 'Новорожденный',
    tabBmr: 'BMR и калории',
    tabSubway: 'Калории Subway',
    unitLbs: 'Фунты (lbs)',
    unitKg: 'Килограммы (kg)',
    presetHeading: 'Быстрый пример:',
    startWeightLabel: 'Начальный вес',
    currentWeightLabel: 'Текущий вес',
    goalWeightLabel: 'Целевой вес',
    optionalLabel: '(Необязательно)',
    formulaLabel: 'Формула: ((Начальный вес − Текущий вес) ÷ Начальный вес) × 100',
    worksInUnits: 'Подходит для кг и фунтов',
    swapWeightsBtn: 'Поменять местами',
    goalLabel: 'Цель',
    ofGoalLabel: 'от цели',
    milestone15: 'Достигнут клинический рубеж 15%',
    milestone10: 'Достигнут клинический рубеж 10%',
    milestone5: 'Достигнут клинический рубеж 5%',
    milestoneNext5: 'Следующий рубеж здоровья: 5%',
    milestoneDescReached:
      'Снижение веса на 5% или 10% от исходного уровня доказанно помогает нормализовать артериальное давление, уровень сахара в крови и снизить нагрузку на суставы.',
    lbsOzUnit: 'Фунты и унции (lbs/oz)',
    gramsUnit: 'Граммы (г)',
    birthWeightLbsOz: 'Вес при рождении (lbs и oz)',
    currentWeightLbsOz: 'Текущий вес (lbs и oz)',
    birthWeightGrams: 'Вес при рождении (граммы)',
    currentWeightGrams: 'Текущий вес (граммы)',
    babyAgeHours: 'Возраст ребенка после рождения (часы)',
    hoursOldSuffix: 'ч. после рождения',
    aapOver10Title: 'Обратитесь к педиатру (более 10%)',
    aapOver10Desc:
      'Потеря более 10% от массы тела при рождении требует консультации педиатра или специалиста по грудному вскармливанию для оценки питания.',
    aap7To10Title: 'Требует внимательного наблюдения (от 7% до 10%)',
    aap7To10Desc:
      'Снижение веса на 7% или 10% часто встречается на 2 или 3 сутки; рекомендуется проверить правильность прикладывания и частоту кормлений.',
    aapUnder7Title: 'Физиологическая норма (менее 7%)',
    aapUnder7Desc:
      'Здоровые новорожденные обычно теряют от 5% до 7% веса в первые дни за счет выведения лишней жидкости и восстанавливают вес к 10 или 14 дню.',
    ageYearsLabel: 'Возраст (лет)',
    sexLabel: 'Биологический пол',
    femaleLabel: 'Женский',
    maleLabel: 'Мужской',
    heightInchesLabel: 'Рост (дюймы / in)',
    activityLabel: 'Коэффициент физической активности',
    restingBurnLabel: 'Базовый обмен (BMR):',
    maintenanceLabel: 'Поддержание веса (TDEE):',
    steadyLossLabel: 'Безопасное снижение (~0,5 кг/нед.):',
    resultHeadingAdult: 'Процент потери массы тела',
    resultHeadingNewborn: 'Изменение веса новорожденного',
    resultHeadingBmr: 'Суточная норма калорий',
    resultHeadingSubway: 'Калорийность блюда',
    printPdf: 'Печать PDF',
    savedPdf: 'PDF сохранен',
    downloadReport: 'Скачать отчет',
    pdfReportDownloaded: 'PDF-отчет скачан!',
    copySummary: 'Копировать',
    copied: 'Скопировано!',
    celebrate: 'Отметить',
    faqTitle: 'Частые вопросы о проценте потери веса',
    faqSubtitle: 'Понятные практические ответы под редакцией д-ра Рекхи Кумар, M.D., M.S.',
    directoryTitle: 'Все 24 калькулятора и клинических руководства',
    directorySubtitle:
      'Переходите к нужному разделу: от формулы процента потери веса и таблиц для новорожденных до расчета калорий BMR и ИМТ:',
    faqs: [
      {
        question: 'Как точно рассчитать процент потери веса?',
        topic: 'Формула расчета',
        answer:
          'Вычтите текущий вес из начального веса, разделите полученную разницу на начальный вес и умножьте на 100. Например, при снижении веса со 100 кг до 90 кг вы потеряли 10 кг: (10 ÷ 100) × 100 = 10%. Формула одинаково работает для килограммов, фунтов и граммов.'
      },
      {
        question: 'Как правильно интерпретировать результаты процента потери веса?',
        topic: 'Рубежи здоровья',
        answer:
          'Ориентируйтесь на рубежи в 5% и 10%, а не на ежедневные колебания весов. Врачи и эндокринологи используют снижение массы тела на 5% и 10% как главный клинический ориентир, при котором улучшаются артериальное давление, уровень глюкозы (HbA1c) и холестерин.'
      },
      {
        question: 'Как рассчитать процент потери веса у новорожденного после родов?',
        topic: 'Уход за новорожденным',
        answer:
          'Вычтите текущий вес малыша из веса при рождении, разделите на вес при рождении и умножьте на 100. Потеря от 5% до 7% в первые 2 или 3 дня является физиологической нормой за счет выведения жидкости; при потере 10% и более необходим осмотр педиатра.'
      },
      {
        question: 'Сколько килограммов можно безопасно сбросить за месяц?',
        topic: 'Безопасный темп',
        answer:
          'Для большинства взрослых безопасный темп составляет от 0,5 до 1 кг в неделю, то есть около 2 или 4 кг в месяц. Слишком быстрое похудение свыше 1% массы тела в неделю повышает риск потери мышечной массы и образования камней в желчном пузыре.'
      },
      {
        question: 'Какова типичная потеря веса после бариатрической операции?',
        topic: 'Бариатрия',
        answer:
          'После рукавной резекции желудка или шунтирования врачи оценивают как общую потерю массы тела, так и процент потери избыточного веса. В среднем пациенты теряют от 60% до 70% избыточного веса за первые 12 или 18 месяцев.'
      },
      {
        question: 'Как рассчитать потерю веса ребенка в фунтах и унциях?',
        topic: 'Перевод единиц',
        answer:
          'Поскольку в одном фунте 16 унций, сначала переведите оба показателя в унции: (фунты × 16) + унции. Затем вычтите текущие унции из начальных, разделите на начальные и умножьте на 100, либо введите значения во вкладке Новорожденный выше.'
      },
      {
        question: 'Сохраняются ли введенные данные о моем весе на сервере?',
        topic: 'Конфиденциальность',
        answer:
          'Нет. Все вычисления выполняются локально внутри вашего браузера на телефоне или компьютере. Никакие введенные числа не передаются на сервер и не сохраняются в базах данных.'
      },
      {
        question: 'Могу ли я сохранить или распечатать результаты в PDF для врача?',
        topic: 'Сохранение PDF',
        answer:
          'Да. Нажмите кнопку Скачать отчет в блоке результатов, чтобы получить одностраничный PDF-документ с начальным весом, текущим изменением, процентом и клиническими ориентирами.'
      },
      {
        question: 'Сколько веса обычно уходит сразу после родов?',
        topic: 'Восстановление после родов',
        answer:
          'Сразу после родов женщины обычно теряют от 5 до 7 кг за счет массы ребенка, плаценты и околоплодных вод. В течение следующих 4 или 6 недель постепенно уходит еще от 2 до 4 кг задерживавшейся жидкости.'
      },
      {
        question: 'Чем отличается процент потери веса от процента жира в организме?',
        topic: 'Состав тела',
        answer:
          'Процент потери веса показывает общее изменение массы тела на весах относительно исходного веса. Процент жира в организме отражает долю жировой ткани по сравнению с мышцами, костями и водой.'
      }
    ]
  },
  zh: {
    htmlLang: 'zh',
    hreflang: 'zh',
    canonicalPath: '/zh/',
    metaTitle: '减重百分比计算器 (Weight Loss Calculator) | 成人、新生儿体重与基础代谢 BMR',
    metaDescription:
      '免费且经医学审阅的减重百分比计算器。支持成人减重百分比计算、新生儿出生后生理性体重下降评估以及每日基础代谢率 (BMR) 与热量估算。',
    searchPlaceholder: '搜索全部 24 个计算器与临床指南（如：新生儿、BMR、生酮、BMI）...',
    navPercentage: '减重百分比计算器',
    navNewborn: '新生儿体重计算',
    navBmr: '基础代谢 (BMR)',
    navFaq: '常见临床问题',
    bylineReviewed: '✓ 医学审阅：Rekha Kumar 医学博士 (M.D., M.S.)',
    bylinePrivate: '浏览器本地隐私计算',
    bylinePdf: '免费下载 PDF 报告',
    heroTitle: '减重百分比计算器 (Weight Loss Calculator)',
    heroIntro:
      '快速计算您的减重百分比、核对新生儿出生后的生理性体重变化，或估算每日热量需求。所有计算均在浏览器内私密运行，不上传服务器，并可随时下载清晰的 PDF 报告。',
    tabAdult: '减重百分比 %',
    tabNewborn: '新生儿体重',
    tabBmr: 'BMR 与每日热量',
    tabSubway: '赛百味热量',
    unitLbs: '磅 (lbs)',
    unitKg: '千克 (kg)',
    presetHeading: '快速示例：',
    startWeightLabel: '初始体重',
    currentWeightLabel: '当前体重',
    goalWeightLabel: '目标体重',
    optionalLabel: '(选填)',
    formulaLabel: '计算公式：((初始体重 − 当前体重) ÷ 初始体重) × 100',
    worksInUnits: '支持千克 (kg) 与磅 (lbs)',
    swapWeightsBtn: '交换数值',
    goalLabel: '目标',
    ofGoalLabel: '目标进度',
    milestone15: '已达成 15% 健康里程碑',
    milestone10: '已达成 10% 健康里程碑',
    milestone5: '已达成 5% 健康里程碑',
    milestoneNext5: '下一个健康里程碑：5%',
    milestoneDescReached:
      '临床研究证实，减去初始体重的 5% 至 10% 能显著改善血压、血糖 (HbA1c) 与血脂水平，并减轻关节负荷。',
    lbsOzUnit: '磅与盎司 (lbs/oz)',
    gramsUnit: '公制克 (g)',
    birthWeightLbsOz: '出生体重 (磅 & 盎司)',
    currentWeightLbsOz: '当前体重 (磅 & 盎司)',
    birthWeightGrams: '出生体重 (克)',
    currentWeightGrams: '当前体重 (克)',
    babyAgeHours: '出生后小时数 (小时)',
    hoursOldSuffix: '小时龄',
    aapOver10Title: '建议立即咨询儿科医生 (超过 10%)',
    aapOver10Desc:
      '若比出生体重下降超过 10%，建议今天联系儿科医生或泌乳顾问，评估宝宝的衔乳与喂养摄入量。',
    aap7To10Title: '需密切观察喂养情况 (7% 至 10%)',
    aap7To10Desc:
      '出生后第 2 至 3 天出现 7% 至 10% 的体重下降较为常见，医护人员通常会核对喂养频率、衔乳姿势与尿布湿重。',
    aapUnder7Title: '正常生理性体重下降 (低于 7%)',
    aapUnder7Desc:
      '健康新生儿在出生后前几天排出多余体液，通常会下降 5% 至 7% 的出生体重，并在第 10 至 14 天恢复至出生体重。',
    ageYearsLabel: '年龄 (岁)',
    sexLabel: '生理性别',
    femaleLabel: '女性',
    maleLabel: '男性',
    heightInchesLabel: '身高 (英寸 / in)',
    activityLabel: '日常体力活动系数',
    restingBurnLabel: '基础代谢率 (BMR)：',
    maintenanceLabel: '每日维持热量 (TDEE)：',
    steadyLossLabel: '稳健减重目标 (~0.5 kg/周)：',
    resultHeadingAdult: '体重减轻百分比',
    resultHeadingNewborn: '新生儿体重变化',
    resultHeadingBmr: '每日热量消耗估算',
    resultHeadingSubway: '餐食预估总热量',
    printPdf: '打印 PDF',
    savedPdf: '已保存 PDF',
    downloadReport: '下载报告',
    pdfReportDownloaded: 'PDF 报告已下载！',
    copySummary: '复制摘要',
    copied: '已复制！',
    celebrate: '庆祝达成',
    faqTitle: '关于减重百分比的常见问题',
    faqSubtitle: '由 Rekha Kumar 医学博士审阅的清晰实用解答',
    directoryTitle: '全部 24 个计算器与临床参考指南',
    directorySubtitle:
      '快速跳转至任一专题，涵盖成人减重百分比公式、新生儿体重核对、每日热量需求、BMI 实例与营养指南：',
    faqs: [
      {
        question: '如何准确计算减重百分比？',
        topic: '计算公式',
        answer:
          '用初始体重减去当前体重，将差值除以初始体重，再乘以 100。例如，您从 80 千克减至 72 千克，共减去 8 千克：(8 ÷ 80) × 100 = 10%。无论使用千克、磅还是克，该公式完全通用。'
      },
      {
        question: '如何解读我的减重百分比结果？',
        topic: '健康里程碑',
        answer:
          '请重点关注 5% 与 10% 的健康里程碑，而非每日体重秤上的微小波动。内分泌科医生将减去初始体重的 5% 至 10% 视为核心临床指标，因为此时血压、血糖 (HbA1c)、胆固醇与关节压力都会出现实质性改善。'
      },
      {
        question: '如何计算新生儿出生后的体重下降百分比？',
        topic: '新生儿护理',
        answer:
          '用宝宝的出生体重减去当前体重，除以出生体重后再乘以 100。健康新生儿在出生后前 2 至 3 天因排出多余体液，体重下降 5% 至 7% 属于正常生理现象；若下降达到或超过 10%，儿科医生会进一步评估喂养与衔乳情况。'
      },
      {
        question: '一个月安全减重多少最为科学？',
        topic: '健康减重速度',
        answer:
          '对大多数成年人而言，每周稳定减重 1 至 2 磅（约 0.5 至 1 千克，即每月 2 至 4 千克）是既能减少脂肪又能保留肌肉与精力的安全速度。每周减重超过体重的 1% 容易增加肌肉流失和胆结石风险。'
      },
      {
        question: '袖状胃切除或胃旁路手术后的典型减重幅度是多少？',
        topic: '减重代谢外科',
        answer:
          '在减重代谢手术后，医生会同时追踪总体重减轻百分比与多余体重减轻百分比。大多数患者在术后 12 至 18 个月内会减去约 60% 至 70% 的多余体重，其中前 3 个月下降最快。'
      },
      {
        question: '如何使用磅和盎司计算婴儿的体重下降？',
        topic: '单位换算',
        answer:
          '由于 1 磅等于 16 盎司，请先将两个体重都换算为总盎司数：(磅 × 16) + 盎司。接着用出生总盎司数减去当前总盎司数，除以出生总盎司数并乘以 100，或者直接使用上方的新生儿体重计算标签页自动换算。'
      },
      {
        question: '我输入的体重或宝宝体重数据会保存在服务器上吗？',
        topic: '隐私安全',
        answer:
          '不会。所有计算均在您手机或电脑的浏览器本地实时完成。您输入的任何数字绝不会发送至服务器、存储在数据库中或与第三方共享。'
      },
      {
        question: '我可以保存或打印计算结果带去医院就诊吗？',
        topic: '导出 PDF 报告',
        answer:
          '可以。点击结果区域的下载报告按钮，即可生成一页排版清晰的 PDF 摘要，内含初始体重、当前变化、减重百分比与临床健康里程碑，方便就诊时供医生参考。'
      },
      {
        question: '产后分娩当下通常会减轻多少体重？',
        topic: '产后恢复',
        answer:
          '大多数母亲在分娩后会因胎儿、胎盘和羊水的重量立即减轻约 12 至 15 磅（约 5.5 至 7 千克）。在随后的 4 至 6 周内，随着孕期潴留的多余水分排出，通常还会平稳减轻 5 至 10 磅。'
      },
      {
        question: '减重百分比与体脂率有什么区别？',
        topic: '身体成分',
        answer:
          '减重百分比衡量的是当前总体重相对于初始体重的变化比例；而体脂率评估的是脂肪组织占全身总重量（含肌肉、骨骼和水分）的百分比。保证充足蛋白质摄入与力量训练有助于确保减掉的主要是脂肪而非肌肉。'
      }
    ]
  }
};
