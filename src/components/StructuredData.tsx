import React, { useEffect } from 'react';
import { FAQ_DATA } from './FAQWithLabels';
import { LOCALE_TRANSLATIONS } from '../data/localeStrings';

interface StructuredDataProps {
  locale?: string;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ locale = 'en' }) => {
  useEffect(() => {
    const t = LOCALE_TRANSLATIONS[locale] || LOCALE_TRANSLATIONS.en;
    const localizedFaqs = t.faqs && t.faqs.length > 0 ? t.faqs : FAQ_DATA;

    // 1. WebApplication Schema with Medical Reviewer, Author Attribution & inLanguage
    const webAppSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: t.heroTitle,
      url: `https://www.weightlosspercentage.com${t.canonicalPath}`,
      inLanguage: t.htmlLang,
      description: t.metaDescription,
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

    // 3. BreadcrumbList Schema
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t.heroTitle,
          item: `https://www.weightlosspercentage.com${t.canonicalPath}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Dr. Rekha Kumar, M.D., M.S. (Medical Reviewer)',
          item: 'https://www.weightlosspercentage.com/authors/dr-rekha-kumar/'
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: t.navNewborn,
          item: 'https://www.weightlosspercentage.com/calculators/newborn-weight-loss/'
        }
      ]
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
  }, [locale]);

  return null;
};
