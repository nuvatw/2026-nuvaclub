import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';
import type {
  CompanionRecord,
  CompanionType,
  MatchRecord,
  CompanionStatsRecord,
} from '../schema';

export interface CompanionWithRelations extends CompanionRecord {
  expertise?: string[];
  stats?: {
    matchCount: number;
    totalRatings: number;
    sumRatings: number;
    avgRating: number;
  };
}

export class CompanionRepository extends BaseRepository<CompanionRecord> {
  constructor(db: MockDB) {
    super(db.companions, db);
  }

  /**
   * Find companion with expertise
   */
  findByIdWithRelations(id: string): CompanionWithRelations | undefined {
    const companion = this.findById(id);
    if (!companion) return undefined;

    return this.enrichCompanion(companion);
  }

  /**
   * Find all companions with expertise
   */
  findAllWithRelations(): CompanionWithRelations[] {
    const companions = this.findAll();
    return companions.map((c) => this.enrichCompanion(c));
  }

  /**
   * Find companions by type
   */
  findByType(type: CompanionType): CompanionWithRelations[] {
    const companions = this.findMany({ where: { type } });
    return companions.map((c) => this.enrichCompanion(c));
  }

  /**
   * Find available companions
   */
  findAvailable(): CompanionWithRelations[] {
    const companions = this.findMany({ where: { isAvailable: true } });
    return companions.map((c) => this.enrichCompanion(c));
  }

  /**
   * Find available companions by type
   */
  findAvailableByType(type: CompanionType): CompanionWithRelations[] {
    const companions = this.findMany({
      where: { type, isAvailable: true },
    });
    return companions.map((c) => this.enrichCompanion(c));
  }

  /**
   * Find companions visible to a user based on their ticket type
   */
  findVisibleToUser(ticketType: 'go' | 'run' | 'fly' | null): CompanionWithRelations[] {
    if (!ticketType) return [];

    const visibleTypes: CompanionType[] = ['nunu'];
    if (ticketType === 'run' || ticketType === 'fly') {
      visibleTypes.push('certified-nunu');
    }
    if (ticketType === 'fly') {
      visibleTypes.push('shangzhe');
    }

    const companions = this.findMany({
      where: (c) => visibleTypes.includes(c.type),
    });
    return companions.map((c) => this.enrichCompanion(c));
  }

  /**
   * Update companion rating after a match is rated
   */
  updateRating(companionId: string, newRating: number): void {
    const stats = this.db.companionStats.findFirst({
      where: { companionId },
    });
    if (!stats) return;

    const totalRatings = stats.totalRatings + 1;
    const sumRatings = stats.sumRatings + newRating;
    const avgRating = sumRatings / totalRatings;

    this.db.companionStats.update(companionId, {
      totalRatings,
      sumRatings,
      avgRating: Math.round(avgRating * 10) / 10,
      lastUpdatedAt: new Date(),
    });

    this.persist();
  }

  /**
   * Increment match count
   */
  incrementMatchCount(companionId: string): void {
    const stats = this.db.companionStats.findFirst({
      where: { companionId },
    });
    if (!stats) return;

    this.db.companionStats.update(companionId, {
      matchCount: stats.matchCount + 1,
      lastUpdatedAt: new Date(),
    });

    this.persist();
  }

  /**
   * Enrich companion with expertise and stats
   */
  private enrichCompanion(companion: CompanionRecord): CompanionWithRelations {
    const expertiseRecords = this.db.companionExpertise.findMany({
      where: { companionId: companion.id },
    });
    const expertise = expertiseRecords.map((e) => e.expertise);

    // Get stats from separate table
    const companionStats = this.db.companionStats.findFirst({
      where: { companionId: companion.id },
    });

    return {
      ...companion,
      expertise,
      stats: companionStats
        ? {
            matchCount: companionStats.matchCount,
            totalRatings: companionStats.totalRatings,
            sumRatings: companionStats.sumRatings,
            avgRating: companionStats.avgRating,
          }
        : undefined,
    };
  }
}
