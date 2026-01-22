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
