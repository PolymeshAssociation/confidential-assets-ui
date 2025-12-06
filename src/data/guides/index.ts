/**
 * Guides Index
 *
 * Export all guide content organized by category
 */

import { accountGuides } from './accounts';
import { assetGuides } from './assets';
import { gettingStartedGuides } from './getting-started';
import { transferGuides } from './transfers';
import type { GuideCategory } from './types';

export const guideCategories: GuideCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description:
      'New to confidential assets? Start here to understand the basics.',
    icon: 'IconRocket',
    guides: gettingStartedGuides,
  },
  {
    id: 'accounts',
    title: 'Confidential Accounts',
    description: 'Create and manage your confidential accounts.',
    icon: 'IconUserShield',
    guides: accountGuides,
  },
  {
    id: 'assets',
    title: 'Managing Assets',
    description: 'Create, register for, and manage confidential assets.',
    icon: 'IconCoin',
    guides: assetGuides,
  },
  {
    id: 'transfers',
    title: 'Transfers',
    description: 'Send and receive confidential assets.',
    icon: 'IconArrowsExchange',
    guides: transferGuides,
  },
];

// Helper to find a guide by ID across all categories
export function findGuideById(id: string) {
  for (const category of guideCategories) {
    const guide = category.guides.find((g) => g.id === id);
    if (guide) {
      return { guide, category };
    }
  }
  return null;
}

// Export types
export type { Guide, GuideCategory, GuideContentItem } from './types';
