import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';
import type {
  CompanionRecord,
  CompanionType,
  MatchRecord,
} from '../schema';

export interface CompanionWithRelations extends CompanionRecord {
  expertise?: string[];
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
    const companion = this.findById(companionId);
    if (!companion) return;

    const totalRatings = companion.totalRatings + 1;
    const avgRating =
      (companion.avgRating * companion.totalRatings + newRating) / totalRatings;

    this.update(companionId, {
      avgRating: Math.round(avgRating * 10) / 10,
      totalRatings,
      updatedAt: new Date(),
    });
  }

  /**
   * Increment match count
   */
  incrementMatchCount(companionId: string): void {
    const companion = this.findById(companionId);
    if (!companion) return;

    this.update(companionId, {
      matchCount: companion.matchCount + 1,
      updatedAt: new Date(),
    });
  }

  /**
   * Enrich companion with expertise
   */
  private enrichCompanion(companion: CompanionRecord): CompanionWithRelations {
    const expertiseRecords = this.db.companionExpertise.findMany({
      where: { companionId: companion.id },
    });
    const expertise = expertiseRecords.map((e) => e.expertise);

    return {
      ...companion,
      expertise,
    };
  }
}
