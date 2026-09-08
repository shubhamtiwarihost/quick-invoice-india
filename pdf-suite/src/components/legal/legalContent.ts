export type LegalPageId = 'privacy' | 'terms' | 'about' | 'contact';

export interface LegalPageContent {
  id: LegalPageId;
  title: string;
  subtitle: string;
  lastUpdated: string;
}

export const LEGAL_PAGES: Record<LegalPageId, LegalPageContent> = {
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    subtitle: 'Privacy Guarantee & Cookie Policy',
    lastUpdated: 'September 2026',
  },
  terms: {
    id: 'terms',
    title: 'Terms of Service',
    subtitle: 'Terms and Conditions for Using SwiftGST PDF Tools',
    lastUpdated: 'September 2026',
  },
  about: {
    id: 'about',
    title: 'About SwiftGST PDF',
    subtitle: 'Our Mission: Fast, Private In-Browser PDF Productivity',
    lastUpdated: 'September 2026',
  },
  contact: {
    id: 'contact',
    title: 'Contact Us & Support',
    subtitle: 'Get in touch with the development and privacy compliance team',
    lastUpdated: 'September 2026',
  },
};
