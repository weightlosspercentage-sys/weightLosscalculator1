import React, { useEffect } from 'react';
import { LOCALE_TRANSLATIONS } from '../data/localeStrings';
import { EXTENDED_LOCALE_PARITY } from '../data/multilingualParity';

interface StructuredDataProps {
  locale?: string;
  canonicalPath?: string;
  customTitle?: string;
  customDescription?: string;
}

export const StructuredData: React.FC<StructuredDataProps> = ({
  locale = 'en',
  canonicalPath,
  customTitle,
  customDescription
}) => {
  useEffect(() => {
    const t = LOCALE_TRANSLATIONS[locale] || LOCALE_TRANSLATIONS.en;
    const p = EXTENDED_LOCALE_PARITY[locale] || EXTENDED_LOCALE_PARITY.en;
    const localizedFaqs = t.faqs && t.faqs.length > 0 ? t.faqs : LOCALE_TRANSLATIONS.en.faqs;

    const effectivePath = canonicalPath || t.canonicalPath;
    const effectiveTitle = customTitle || t.heroTitle;
    const effectiveDesc = customDescription || t.metaDescription;
    const fullUrl = `https://www.weightlosspercentage.com${effectivePath}`;

    // 1. WebApplication Schema with Medical Reviewer, Author Attribution & inLanguage
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: effectiveTitle,
      url: fullUrl,
      inLanguage: t.htmlLang,
      description: effectiveDesc,
      applicationCategory: 'HealthApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      },
      reviewedBy: {
        '@type': 'Person',
        name: 'Dr. Rekha Kumar, M.D., M.S.',
        jobTitle: 'Lead Medical Reviewer & Obesity Medicine Specialist',
        url: 'https://www.weightlosspercentage.com/authors/dr-rekha-kumar/',
        sameAs: ['https://www.linkedin.com/in/rekha-kumar-m-d-m-s-70b481237/'],
        affiliation: {
          '@type': 'Organization',
          name: 'Weill Cornell Medicine'
        }
      },
      creator: {
        '@type': 'Organization',
        name: 'Weight Loss Percentage',
        url: 'https://www.weightlosspercentage.com/',
        sameAs: ['https://www.linkedin.com/in/wordpress-seo-specialist-abhi/']
      },
      browserRequirements: 'Requires JavaScript. Operates offline.'
    };

    // 2. Organization & Medical Reviewer Person Schema
    const orgSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Weight Loss Percentage',
      url: 'https://www.weightlosspercentage.com/',
      logo: 'https://www.weightlosspercentage.com/favicon.svg',
      sameAs: [
        'https://www.instagram.com/weightlosspercentage',
        'https://x.com/weightlossperce',
        'https://www.facebook.com/weightlossnewborn/',
        'https://www.youtube.com/@WeightLossPercentage'
      ],
      member: [
        {
          '@type': 'Person',
          name: 'Dr. Rekha Kumar, M.D., M.S.',
          jobTitle: 'Lead Medical Reviewer & Obesity Medicine Specialist',
          url: 'https://www.weightlosspercentage.com/authors/dr-rekha-kumar/',
          sameAs: ['https://www.linkedin.com/in/rekha-kumar-m-d-m-s-70b481237/']
        }
      ]
    };

    // 3. BreadcrumbList Schema (dynamically includes active calculator subroute when not on root)
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: t.heroTitle,
        item: `https://www.weightlosspercentage.com${t.canonicalPath}`
      }
    ];

    if (effectivePath !== t.canonicalPath && effectivePath !== '/') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: effectiveTitle,
        item: fullUrl
      });
    }

    breadcrumbItems.push({
      '@type': 'ListItem',
      position: breadcrumbItems.length + 1,
      name: 'Dr. Rekha Kumar, M.D., M.S. (Medical Reviewer)',
      item: 'https://www.weightlosspercentage.com/authors/dr-rekha-kumar/'
    });

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbItems
    };

    // 4. FAQPage Schema (dynamically localized per Triple-to-Triple parity)
    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: t.htmlLang,
      mainEntity: localizedFaqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    // 5. HowTo Schema (localized 3-step formula guide for Google rich results)
    const howToSchema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: p.howToTitle,
      inLanguage: t.htmlLang,
      totalTime: 'PT10S',
      step: p.howToSteps.map((stepItem, idx) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: stepItem.name,
        text: stepItem.text
      }))
    };

    const injectScript = (id: string, data: object) => {
      let script = document.getElementById(id) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    injectScript('schema-webapp', webAppSchema);
    injectScript('schema-org', orgSchema);
    injectScript('schema-breadcrumb', breadcrumbSchema);
    injectScript('schema-faq', faqSchema);
    injectScript('schema-howto', howToSchema);
  }, [locale, canonicalPath, customTitle, customDescription]);

  return null;
};

