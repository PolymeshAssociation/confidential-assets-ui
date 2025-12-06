/**
 * Guide Types
 *
 * Type definitions for user guide content
 */

export interface GuideContentItem {
  title: string;
  description: string;
  tip?: string;
  note?: string;
  warning?: string;
  info?: string;
  link?: {
    text: string;
    url: string;
  };
}

export interface Guide {
  id: string;
  title: string;
  description: string;
  prerequisites?: string[];
  // Use 'steps' for procedural how-to guides (numbered)
  steps?: GuideContentItem[];
  // Use 'sections' for conceptual/informational content (not numbered)
  sections?: GuideContentItem[];
  behindTheScenes?: string;
  learnMoreUrl?: string;
  learnMoreLabel?: string;
  relatedGuides?: string[];
}

export interface GuideCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  guides: Guide[];
}
