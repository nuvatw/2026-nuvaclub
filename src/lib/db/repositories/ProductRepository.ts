import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';
import type {
  ProductRecord,
  ProductType,
  PlanProductRecord,
  DuoTicketProductRecord,
  EventProductRecord,
  MerchandiseProductRecord,
  MerchandiseVariantRecord,
  EventAgendaItemRecord,
  EventFAQRecord,
} from '../schema';

export interface ProductWithDetails extends ProductRecord {
  // Plan specific
  planDetails?: PlanProductRecord;
  // Duo ticket specific
  duoTicketDetails?: DuoTicketProductRecord;
  // Event specific
  eventDetails?: EventProductRecord & {
    agenda?: EventAgendaItemRecord[];
    faqs?: EventFAQRecord[];
  };
  // Merchandise specific
  merchandiseDetails?: MerchandiseProductRecord & {
    variants?: MerchandiseVariantRecord[];
  };
}

export class ProductRepository extends BaseRepository<ProductRecord> {
  constructor(db: MockDB) {
    super(db.products, db);
  }

  /**
   * Find product with all details
   */
  findByIdWithDetails(id: string): ProductWithDetails | undefined {
    const product = this.findById(id);
    if (!product) return undefined;
    return this.enrichProduct(product);
  }

  /**
   * Find all products with details
   */
  findAllWithDetails(): ProductWithDetails[] {
    const products = this.findMany({ where: { isActive: true } });
    return products.map((p) => this.enrichProduct(p));
  }

  /**
   * Find products by type
   */
  findByType(type: ProductType): ProductWithDetails[] {
    const products = this.findMany({ where: { type, isActive: true } });
    return products.map((p) => this.enrichProduct(p));
  }

  /**
   * Find plans
   */
  findPlans(): ProductWithDetails[] {
    return this.findByType('plan');
  }

  /**
   * Find duo tickets
   */
  findDuoTickets(): ProductWithDetails[] {
    return this.findByType('duo-ticket');
  }

  /**
   * Find events
   */
  findEvents(): ProductWithDetails[] {
    return this.findByType('event');
  }

  /**
   * Find upcoming events
   */
  findUpcomingEvents(): ProductWithDetails[] {
    const now = new Date();
    const eventProducts = this.db.eventProducts.findMany({
      where: (e) => e.date >= now,
      orderBy: { field: 'date', direction: 'asc' },
    });

    return eventProducts
      .map((ep) => {
        const product = this.findById(ep.productId);
        return product ? this.enrichProduct(product) : undefined;
      })
      .filter((p): p is ProductWithDetails => p !== undefined);
  }

  /**
   * Find merchandise
   */
  findMerchandise(): ProductWithDetails[] {
    return this.findByType('merchandise');
  }

  /**
   * Search products
   */
  search(query: string): ProductWithDetails[] {
    const lowerQuery = query.toLowerCase();
    const products = this.findMany({
      where: (p) =>
        p.isActive &&
        (p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery)),
    });
    return products.map((p) => this.enrichProduct(p));
  }

  /**
   * Find plan by type
   */
  findPlanByType(planType: 'explorer' | 'traveler'): ProductWithDetails | undefined {
    const planProduct = this.db.planProducts.findFirst({
      where: { planType },
    });
    if (!planProduct) return undefined;

    const product = this.findById(planProduct.productId);
    return product ? this.enrichProduct(product) : undefined;
  }

  /**
   * Find duo ticket by type
   */
  findDuoTicketByType(ticketType: 'go' | 'run' | 'fly'): ProductWithDetails | undefined {
    const duoTicketProduct = this.db.duoTicketProducts.findFirst({
      where: { ticketType },
    });
    if (!duoTicketProduct) return undefined;

    const product = this.findById(duoTicketProduct.productId);
    return product ? this.enrichProduct(product) : undefined;
  }

  /**
   * Enrich product with type-specific details
   */
  private enrichProduct(product: ProductRecord): ProductWithDetails {
    const result: ProductWithDetails = { ...product };

    switch (product.type) {
      case 'plan': {
        const planDetails = this.db.planProducts.findFirst({
          where: { productId: product.id },
        });
        result.planDetails = planDetails;
        break;
      }
      case 'duo-ticket': {
        const duoDetails = this.db.duoTicketProducts.findFirst({
          where: { productId: product.id },
        });
        result.duoTicketDetails = duoDetails;
        break;
      }
      case 'event': {
        const eventDetails = this.db.eventProducts.findFirst({
          where: { productId: product.id },
        });
        if (eventDetails) {
          const agenda = this.db.eventAgendaItems.findMany({
            where: { eventProductId: eventDetails.id },
            orderBy: { field: 'sortOrder', direction: 'asc' },
          });
          const faqs = this.db.eventFAQs.findMany({
            where: { eventProductId: eventDetails.id },
            orderBy: { field: 'sortOrder', direction: 'asc' },
          });
          result.eventDetails = { ...eventDetails, agenda, faqs };
        }
        break;
      }
      case 'merchandise': {
        const merchDetails = this.db.merchandiseProducts.findFirst({
          where: { productId: product.id },
        });
        if (merchDetails) {
          const variants = this.db.merchandiseVariants.findMany({
            where: { merchandiseProductId: merchDetails.id },
          });
          result.merchandiseDetails = { ...merchDetails, variants };
        }
        break;
      }
    }

    return result;
  }
}
