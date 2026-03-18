/**
 * Author/Journalist Database
 * Contains political leanings and writing history for major journalists
 */

export interface AuthorInfo {
  name: string;
  outlet: string;
  leanScore: number;        // -3 (far left) to +3 (far right)
  topics: string[];
  articleCount: number;
  avgSensationalism: number;
  writingStyle: 'neutral' | 'analytical' | 'opinionated' | 'investigative' | 'sensationalist';
  reliability: number;      // 0-100
  notableWorks: string[];
  yearsActive: string;
  avatar?: string;          // Initials for avatar
}

// Author database with political leanings
export const AUTHOR_DATABASE: Record<string, AuthorInfo> = {
  // Left-Leaning Authors
  'rachel_maddow': {
    name: 'Rachel Maddow',
    outlet: 'MSNBC',
    leanScore: -2.5,
    topics: ['politics', 'national security', 'investigations'],
    articleCount: 150,
    avgSensationalism: 4.5,
    writingStyle: 'opinionated',
    reliability: 72,
    notableWorks: ['Trump tax returns investigation', 'Russia investigation coverage'],
    yearsActive: '2008-present',
    avatar: 'RM',
  },
  'paul_krugman': {
    name: 'Paul Krugman',
    outlet: 'New York Times',
    leanScore: -2.2,
    topics: ['economics', 'politics', 'healthcare'],
    articleCount: 500,
    avgSensationalism: 3.5,
    writingStyle: 'analytical',
    reliability: 85,
    notableWorks: ['Nobel Prize Economics', 'Economic policy analysis'],
    yearsActive: '2000-present',
    avatar: 'PK',
  },
  'ezra_klein': {
    name: 'Ezra Klein',
    outlet: 'Vox',
    leanScore: -1.8,
    topics: ['politics', 'policy', 'healthcare'],
    articleCount: 300,
    avgSensationalism: 2.5,
    writingStyle: 'analytical',
    reliability: 82,
    notableWorks: ['The Ezra Klein Show', 'Policy deep dives'],
    yearsActive: '2009-present',
    avatar: 'EK',
  },
  'michelle_goldberg': {
    name: 'Michelle Goldberg',
    outlet: 'New York Times',
    leanScore: -2.0,
    topics: ['politics', 'culture', 'women rights'],
    articleCount: 200,
    avgSensationalism: 3.0,
    writingStyle: 'opinionated',
    reliability: 78,
    notableWorks: ['Opinion columns', 'Political commentary'],
    yearsActive: '2015-present',
    avatar: 'MG',
  },
  'maureen_dowd': {
    name: 'Maureen Dowd',
    outlet: 'New York Times',
    leanScore: -1.5,
    topics: ['politics', 'culture'],
    articleCount: 400,
    avgSensationalism: 5.0,
    writingStyle: 'opinionated',
    reliability: 70,
    notableWorks: ['Political satire', 'Culture commentary'],
    yearsActive: '1983-present',
    avatar: 'MD',
  },
  'ta-nehisi_coates': {
    name: 'Ta-Nehisi Coates',
    outlet: 'The Atlantic',
    leanScore: -2.3,
    topics: ['race', 'politics', 'culture'],
    articleCount: 150,
    avgSensationalism: 2.0,
    writingStyle: 'analytical',
    reliability: 88,
    notableWorks: ['The Case for Reparations', 'Between the World and Me'],
    yearsActive: '2008-present',
    avatar: 'TC',
  },

  // Center Authors
  'david_brooks': {
    name: 'David Brooks',
    outlet: 'New York Times',
    leanScore: 0.5,
    topics: ['politics', 'culture', 'social issues'],
    articleCount: 400,
    avgSensationalism: 2.0,
    writingStyle: 'analytical',
    reliability: 80,
    notableWorks: ['Bobos in Paradise', 'Political commentary'],
    yearsActive: '2003-present',
    avatar: 'DB',
  },
  'thomas_friedman': {
    name: 'Thomas Friedman',
    outlet: 'New York Times',
    leanScore: 0.2,
    topics: ['foreign policy', 'globalization', 'economics'],
    articleCount: 500,
    avgSensationalism: 3.0,
    writingStyle: 'analytical',
    reliability: 78,
    notableWorks: ['The World is Flat', 'Foreign affairs coverage'],
    yearsActive: '1981-present',
    avatar: 'TF',
  },
  'fareed_zakaria': {
    name: 'Fareed Zakaria',
    outlet: 'CNN',
    leanScore: -0.3,
    topics: ['foreign policy', 'global affairs', 'economics'],
    articleCount: 300,
    avgSensationalism: 2.0,
    writingStyle: 'analytical',
    reliability: 85,
    notableWorks: ['GPS Show', 'International affairs analysis'],
    yearsActive: '2000-present',
    avatar: 'FZ',
  },
  'maggie_haberman': {
    name: 'Maggie Haberman',
    outlet: 'New York Times',
    leanScore: 0.0,
    topics: ['politics', 'white house', 'campaigns'],
    articleCount: 400,
    avgSensationalism: 2.5,
    writingStyle: 'investigative',
    reliability: 88,
    notableWorks: ['Trump administration coverage', 'Political reporting'],
    yearsActive: '1999-present',
    avatar: 'MH',
  },

  // Right-Leaning Authors
  'sean_hannity': {
    name: 'Sean Hannity',
    outlet: 'Fox News',
    leanScore: 2.8,
    topics: ['politics', 'culture war', 'elections'],
    articleCount: 200,
    avgSensationalism: 7.0,
    writingStyle: 'opinionated',
    reliability: 45,
    notableWorks: ['Hannity Show', 'Talk radio'],
    yearsActive: '1996-present',
    avatar: 'SH',
  },
  'ben_shapiro': {
    name: 'Ben Shapiro',
    outlet: 'Daily Wire',
    leanScore: 2.5,
    topics: ['culture war', 'politics', 'free speech'],
    articleCount: 300,
    avgSensationalism: 5.5,
    writingStyle: 'opinionated',
    reliability: 55,
    notableWorks: ['The Ben Shapiro Show', 'Political commentary'],
    yearsActive: '2013-present',
    avatar: 'BS',
  },
  'peggy_noonan': {
    name: 'Peggy Noonan',
    outlet: 'Wall Street Journal',
    leanScore: 1.5,
    topics: ['politics', 'culture', 'presidency'],
    articleCount: 350,
    avgSensationalism: 2.0,
    writingStyle: 'analytical',
    reliability: 82,
    notableWorks: ['Reagan speechwriter', 'Political commentary'],
    yearsActive: '1984-present',
    avatar: 'PN',
  },
  'jonah_goldberg': {
    name: 'Jonah Goldberg',
    outlet: 'The Dispatch',
    leanScore: 2.0,
    topics: ['politics', 'culture', 'conservatism'],
    articleCount: 300,
    avgSensationalism: 3.0,
    writingStyle: 'opinionated',
    reliability: 72,
    notableWorks: ['National Review contributor', 'Political commentary'],
    yearsActive: '1998-present',
    avatar: 'JG',
  },
  'david_french': {
    name: 'David French',
    outlet: 'New York Times',
    leanScore: 1.2,
    topics: ['law', 'culture', 'religion'],
    articleCount: 200,
    avgSensationalism: 2.0,
    writingStyle: 'analytical',
    reliability: 80,
    notableWorks: ['National Review contributor', 'Legal analysis'],
    yearsActive: '2005-present',
    avatar: 'DF',
  },
  'bret_stephens': {
    name: 'Bret Stephens',
    outlet: 'New York Times',
    leanScore: 1.0,
    topics: ['foreign policy', 'politics', 'israel'],
    articleCount: 250,
    avgSensationalism: 3.0,
    writingStyle: 'opinionated',
    reliability: 75,
    notableWorks: ['Pulitzer Prize winner', 'Foreign affairs commentary'],
    yearsActive: '2009-present',
    avatar: 'BS',
  },

  // Investigative Journalists
  'bob_woodward': {
    name: 'Bob Woodward',
    outlet: 'Washington Post',
    leanScore: -0.3,
    topics: ['investigations', 'white house', 'national security'],
    articleCount: 200,
    avgSensationalism: 1.5,
    writingStyle: 'investigative',
    reliability: 95,
    notableWorks: ['Watergate', 'Multiple presidential books'],
    yearsActive: '1971-present',
    avatar: 'BW',
  },
  'ronan_farrow': {
    name: 'Ronan Farrow',
    outlet: 'The New Yorker',
    leanScore: -1.2,
    topics: ['investigations', 'media', 'foreign policy'],
    articleCount: 80,
    avgSensationalism: 2.0,
    writingStyle: 'investigative',
    reliability: 88,
    notableWorks: ['Harvey Weinstein story', 'Pulitzer Prize winner'],
    yearsActive: '2011-present',
    avatar: 'RF',
  },
};

/**
 * Get author info by name (fuzzy match)
 */
export function getAuthorInfo(name: string): AuthorInfo | null {
  const normalizedName = name.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, '_');
  
  // Direct match
  if (AUTHOR_DATABASE[normalizedName]) {
    return AUTHOR_DATABASE[normalizedName];
  }
  
  // Fuzzy match
  for (const [key, value] of Object.entries(AUTHOR_DATABASE)) {
    const dbName = value.name.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, '_');
    if (dbName.includes(normalizedName) || normalizedName.includes(dbName)) {
      return value;
    }
    const nameParts = normalizedName.split('_');
    const dbParts = dbName.split('_');
    if (nameParts.some(part => dbParts.some(dbPart => dbPart.includes(part) && part.length > 2))) {
      return value;
    }
  }
  
  return null;
}

/**
 * Get all authors sorted by lean score
 */
export function getAllAuthors(): AuthorInfo[] {
  return Object.values(AUTHOR_DATABASE).sort((a, b) => a.leanScore - b.leanScore);
}

/**
 * Get authors by lean range
 */
export function getAuthorsByLean(minLean: number, maxLean: number): AuthorInfo[] {
  return Object.values(AUTHOR_DATABASE).filter(
    (author) => author.leanScore >= minLean && author.leanScore <= maxLean
  );
}

/**
 * Get authors by outlet
 */
export function getAuthorsByOutlet(outlet: string): AuthorInfo[] {
  const normalizedOutlet = outlet.toLowerCase();
  return Object.values(AUTHOR_DATABASE).filter(
    (author) => author.outlet.toLowerCase().includes(normalizedOutlet) ||
                normalizedOutlet.includes(author.outlet.toLowerCase())
  );
}

/**
 * Get authors by topic
 */
export function getAuthorsByTopic(topic: string): AuthorInfo[] {
  const normalizedTopic = topic.toLowerCase();
  return Object.values(AUTHOR_DATABASE).filter(
    (author) => author.topics.some(t => t.toLowerCase().includes(normalizedTopic))
  );
}

/**
 * Get author statistics for analytics
 */
export function getAuthorStatistics(): {
  left: { name: string; lean: number; reliability: number; avatar: string }[];
  center: { name: string; lean: number; reliability: number; avatar: string }[];
  right: { name: string; lean: number; reliability: number; avatar: string }[];
} {
  const authors = getAllAuthors();
  
  return {
    left: authors
      .filter(a => a.leanScore < -0.5)
      .map(a => ({ name: a.name, lean: a.leanScore, reliability: a.reliability, avatar: a.avatar || '??' }))
      .sort((a, b) => a.lean - b.lean),
    center: authors
      .filter(a => Math.abs(a.leanScore) <= 0.5)
      .map(a => ({ name: a.name, lean: a.leanScore, reliability: a.reliability, avatar: a.avatar || '??' })),
    right: authors
      .filter(a => a.leanScore > 0.5)
      .map(a => ({ name: a.name, lean: a.leanScore, reliability: a.reliability, avatar: a.avatar || '??' }))
      .sort((a, b) => b.lean - a.lean),
  };
}
