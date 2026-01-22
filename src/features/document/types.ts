export interface PlaybookSection {
  id: string;
  title: string;
  icon?: string;
  subsections?: PlaybookSubsection[];
}

export interface PlaybookSubsection {
  id: string;
  title: string;
  content: string;
}

export interface QuickStartItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

export interface IdentityInfo {
  id: string;
  name: string;
  description: string;
  color: string;
  capabilities: string[];
  limitations: string[];
  upgradePath?: string;
}

export interface IdentityCapability {
  feature: string;
  guest: boolean | string;
  explorer: boolean | string;
  soloTraveler: boolean | string;
  duoGo: boolean | string;
  duoRun: boolean | string;
  duoFly: boolean | string;
}

export interface TOCItem {
  id: string;
  title: string;
  level: number;
  children?: TOCItem[];
}

// Version System Types
export interface VersionInfo {
  version: string;
  releaseDate: string;
  title: string;
  description: string;
}

export interface VersionUpdate {
  category: 'feature' | 'improvement' | 'fix' | 'breaking';
  title: string;
  description: string;
}

export interface VersionChangelog {
  version: string;
  releaseDate: string;
  summary: string;
  updates: VersionUpdate[];
}

export interface PlaybookVersion {
  info: VersionInfo;
  changelog?: VersionChangelog;
  quickStartItems: QuickStartItem[];
  identityInfo: IdentityInfo[];
  identityCapabilities: IdentityCapability[];
  tableOfContents: TOCItem[];
  content: PlaybookContentType;
}

export interface PlaybookContentType {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  quickStart: {
    title: string;
    content: string;
  };
  versionUpdates?: {
    title: string;
    content: string;
  };
  learn: {
    overview: string;
    access: string;
    progress: string;
  };
  test: {
    overview: string;
    levels: string;
    types: string;
    scoring: string;
  };
  forum: {
    overview: string;
    categories: string;
    guidelines: string;
    markdown: string;
  };
  space: {
    overview: string;
    roles: string;
    matching: string;
    tickets: string;
  };
  sprint: {
    overview: string;
    seasons: string;
    submit: string;
    voting: string;
  };
  shop: {
    plans: string;
    duo: string;
    events: string;
    merch: string;
  };
  faq: {
    title: string;
    items: Array<{
      question: string;
      answer: string;
    }>;
  };
}
