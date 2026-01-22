import { Collection } from './Collection';
import type { StorageAdapter } from '../adapters/StorageAdapter';
import { LocalStorageAdapter } from '../adapters/LocalStorageAdapter';
import type { DBEvent, DBEventListener } from './types';

// Import all schema types
import type {
  // User
  UserRecord,
  UserSubscriptionRecord,
  DuoTicketRecord,
  UserFavoriteRecord,
  UserActivityRecord,
  // Learn
  InstructorRecord,
  CourseCategoryRecord,
  CourseRecord,
  CourseTagRecord,
  LessonRecord,
  UserCourseProgressRecord,
  UserLessonProgressRecord,
  // Forum
  PostRecord,
  PostTagRecord,
  CommentRecord,
  VoteRecord,
  // Space
  CompanionRecord,
  CompanionExpertiseRecord,
  MatchRecord,
  MatchRatingRecord,
  UserMentorshipRecord,
  NunuApplicationRecord,
  NunuProfileRecord,
  MatchingPostRecord,
  MatchingPostTagRecord,
  MatchingCommentRecord,
  // Sprint
  SeasonRecord,
  SprintRecord,
  ProjectRecord,
  ProjectTechStackRecord,
  ProjectVoteRecord,
  // Shop
  ProductRecord,
  PlanProductRecord,
  DuoTicketProductRecord,
  EventProductRecord,
  EventAgendaItemRecord,
  EventFAQRecord,
  MerchandiseProductRecord,
  MerchandiseVariantRecord,
  ProductReviewRecord,
  CartRecord,
  CartItemRecord,
  OrderRecord,
  OrderItemRecord,
  // Test
  QuestionRecord,
  TestSessionRecord,
  TestAnswerRecord,
  UserTestProgressRecord,
  LevelAttemptRecord,
} from '../schema';

/**
 * Database schema containing all collections
 */
interface DatabaseSchema {
  // User collections
  users: Collection<UserRecord>;
  userSubscriptions: Collection<UserSubscriptionRecord>;
  duoTickets: Collection<DuoTicketRecord>;
  userFavorites: Collection<UserFavoriteRecord>;
  userActivities: Collection<UserActivityRecord>;

  // Learn collections
  instructors: Collection<InstructorRecord>;
  courseCategories: Collection<CourseCategoryRecord>;
  courses: Collection<CourseRecord>;
  courseTags: Collection<CourseTagRecord>;
  lessons: Collection<LessonRecord>;
  userCourseProgress: Collection<UserCourseProgressRecord>;
  userLessonProgress: Collection<UserLessonProgressRecord>;

  // Forum collections
  posts: Collection<PostRecord>;
  postTags: Collection<PostTagRecord>;
  comments: Collection<CommentRecord>;
  votes: Collection<VoteRecord>;

  // Space collections
  companions: Collection<CompanionRecord>;
  companionExpertise: Collection<CompanionExpertiseRecord>;
  matches: Collection<MatchRecord>;
  matchRatings: Collection<MatchRatingRecord>;
  userMentorships: Collection<UserMentorshipRecord>;
  nunuApplications: Collection<NunuApplicationRecord>;
  nunuProfiles: Collection<NunuProfileRecord>;
  matchingPosts: Collection<MatchingPostRecord>;
  matchingPostTags: Collection<MatchingPostTagRecord>;
  matchingComments: Collection<MatchingCommentRecord>;

  // Sprint collections
  seasons: Collection<SeasonRecord>;
  sprints: Collection<SprintRecord>;
  projects: Collection<ProjectRecord>;
  projectTechStack: Collection<ProjectTechStackRecord>;
  projectVotes: Collection<ProjectVoteRecord>;

  // Shop collections
  products: Collection<ProductRecord>;
  planProducts: Collection<PlanProductRecord>;
  duoTicketProducts: Collection<DuoTicketProductRecord>;
  eventProducts: Collection<EventProductRecord>;
  eventAgendaItems: Collection<EventAgendaItemRecord>;
  eventFAQs: Collection<EventFAQRecord>;
  merchandiseProducts: Collection<MerchandiseProductRecord>;
  merchandiseVariants: Collection<MerchandiseVariantRecord>;
  productReviews: Collection<ProductReviewRecord>;
  carts: Collection<CartRecord>;
  cartItems: Collection<CartItemRecord>;
  orders: Collection<OrderRecord>;
  orderItems: Collection<OrderItemRecord>;

  // Test collections
  questions: Collection<QuestionRecord>;
  testSessions: Collection<TestSessionRecord>;
  testAnswers: Collection<TestAnswerRecord>;
  userTestProgress: Collection<UserTestProgressRecord>;
  levelAttempts: Collection<LevelAttemptRecord>;
}

/**
 * MockDB - Singleton database class
 *
 * Provides a complete mock database with CRUD operations,
 * localStorage persistence, and event system for reactivity.
 */
class MockDB {
  private static instance: MockDB | null = null;
  private adapter: StorageAdapter;
  private schema: DatabaseSchema;
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;
  private listeners: Set<DBEventListener> = new Set();

  private constructor(adapter?: StorageAdapter) {
    this.adapter = adapter ?? new LocalStorageAdapter('nuvaclub_db');
    this.schema = this.createSchema();
  }

  /**
   * Get the singleton instance
   */
  static getInstance(adapter?: StorageAdapter): MockDB {
    if (!MockDB.instance) {
      MockDB.instance = new MockDB(adapter);
    }
    return MockDB.instance;
  }

  /**
   * Reset the singleton (useful for testing)
   */
  static resetInstance(): void {
    MockDB.instance = null;
  }

  private createSchema(): DatabaseSchema {
    return {
      // User collections
      users: new Collection<UserRecord>('users'),
      userSubscriptions: new Collection<UserSubscriptionRecord>('userSubscriptions'),
      duoTickets: new Collection<DuoTicketRecord>('duoTickets'),
      userFavorites: new Collection<UserFavoriteRecord>('userFavorites'),
      userActivities: new Collection<UserActivityRecord>('userActivities'),

      // Learn collections
      instructors: new Collection<InstructorRecord>('instructors'),
      courseCategories: new Collection<CourseCategoryRecord>('courseCategories'),
      courses: new Collection<CourseRecord>('courses'),
      courseTags: new Collection<CourseTagRecord>('courseTags'),
      lessons: new Collection<LessonRecord>('lessons'),
      userCourseProgress: new Collection<UserCourseProgressRecord>('userCourseProgress'),
      userLessonProgress: new Collection<UserLessonProgressRecord>('userLessonProgress'),

      // Forum collections
      posts: new Collection<PostRecord>('posts'),
      postTags: new Collection<PostTagRecord>('postTags'),
      comments: new Collection<CommentRecord>('comments'),
      votes: new Collection<VoteRecord>('votes'),

      // Space collections
      companions: new Collection<CompanionRecord>('companions'),
      companionExpertise: new Collection<CompanionExpertiseRecord>('companionExpertise'),
      matches: new Collection<MatchRecord>('matches'),
      matchRatings: new Collection<MatchRatingRecord>('matchRatings'),
      userMentorships: new Collection<UserMentorshipRecord>('userMentorships'),
      nunuApplications: new Collection<NunuApplicationRecord>('nunuApplications'),
      nunuProfiles: new Collection<NunuProfileRecord>('nunuProfiles'),
      matchingPosts: new Collection<MatchingPostRecord>('matchingPosts'),
      matchingPostTags: new Collection<MatchingPostTagRecord>('matchingPostTags'),
      matchingComments: new Collection<MatchingCommentRecord>('matchingComments'),

      // Sprint collections
      seasons: new Collection<SeasonRecord>('seasons'),
      sprints: new Collection<SprintRecord>('sprints'),
      projects: new Collection<ProjectRecord>('projects'),
      projectTechStack: new Collection<ProjectTechStackRecord>('projectTechStack'),
      projectVotes: new Collection<ProjectVoteRecord>('projectVotes'),

      // Shop collections
      products: new Collection<ProductRecord>('products'),
      planProducts: new Collection<PlanProductRecord>('planProducts'),
      duoTicketProducts: new Collection<DuoTicketProductRecord>('duoTicketProducts'),
      eventProducts: new Collection<EventProductRecord>('eventProducts'),
      eventAgendaItems: new Collection<EventAgendaItemRecord>('eventAgendaItems'),
      eventFAQs: new Collection<EventFAQRecord>('eventFAQs'),
      merchandiseProducts: new Collection<MerchandiseProductRecord>('merchandiseProducts'),
      merchandiseVariants: new Collection<MerchandiseVariantRecord>('merchandiseVariants'),
      productReviews: new Collection<ProductReviewRecord>('productReviews'),
      carts: new Collection<CartRecord>('carts'),
      cartItems: new Collection<CartItemRecord>('cartItems'),
      orders: new Collection<OrderRecord>('orders'),
      orderItems: new Collection<OrderItemRecord>('orderItems'),

      // Test collections
      questions: new Collection<QuestionRecord>('questions'),
      testSessions: new Collection<TestSessionRecord>('testSessions'),
      testAnswers: new Collection<TestAnswerRecord>('testAnswers'),
      userTestProgress: new Collection<UserTestProgressRecord>('userTestProgress'),
      levelAttempts: new Collection<LevelAttemptRecord>('levelAttempts'),
    };
  }

  /**
   * Initialize the database (load from storage or seed)
   */
  async initialize(): Promise<void> {
    // Return existing promise if already initializing
    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.isInitialized) {
      return;
    }

    this.initPromise = this._initialize();
    await this.initPromise;
  }

  private async _initialize(): Promise<void> {
    await this.adapter.initialize();

    const hasData = await this.adapter.hasData();
    if (hasData) {
      await this.loadFromStorage();
    } else {
      await this.seed();
    }

    this.isInitialized = true;
  }

  /**
   * Seed the database with initial data
   */
  async seed(): Promise<void> {
    // Import seed functions dynamically to avoid circular dependencies
    const { seedAll } = await import('../seed');
    await seedAll(this);
    await this.persist();
  }

  /**
   * Persist all data to storage
   */
  async persist(): Promise<void> {
    await this.adapter.persist(this.schema as unknown as Record<string, { toArray(): unknown[] }>);
  }

  /**
   * Load data from storage
   */
  private async loadFromStorage(): Promise<void> {
    const data = await this.adapter.load();
    if (data) {
      for (const [key, items] of Object.entries(data)) {
        const collection = this.schema[key as keyof DatabaseSchema];
        if (collection && Array.isArray(items)) {
          collection.hydrate(items as any[]);
        }
      }
    }
  }

  /**
   * Clear all data and reseed
   */
  async reset(): Promise<void> {
    await this.adapter.clear();
    this.schema = this.createSchema();
    await this.seed();
    this.emit({ type: 'reset', collection: '*' });
  }

  /**
   * Clear all data without reseeding
   */
  async clear(): Promise<void> {
    await this.adapter.clear();
    this.schema = this.createSchema();
    this.emit({ type: 'reset', collection: '*' });
  }

  // ==========================================
  // Event System for Reactivity
  // ==========================================

  /**
   * Subscribe to database events
   */
  subscribe(listener: DBEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Emit a database event
   */
  emit(event: DBEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }

  // ==========================================
  // Collection Accessors
  // ==========================================

  /**
   * Generic collection accessor - use for cleaner code in new implementations
   * Example: db.collection('users').findAll()
   */
  collection<K extends keyof DatabaseSchema>(name: K): DatabaseSchema[K] {
    return this.schema[name];
  }

  // User collections
  get users() {
    return this.schema.users;
  }
  get userSubscriptions() {
    return this.schema.userSubscriptions;
  }
  get duoTickets() {
    return this.schema.duoTickets;
  }
  get userFavorites() {
    return this.schema.userFavorites;
  }
  get userActivities() {
    return this.schema.userActivities;
  }

  // Learn collections
  get instructors() {
    return this.schema.instructors;
  }
  get courseCategories() {
    return this.schema.courseCategories;
  }
  get courses() {
    return this.schema.courses;
  }
  get courseTags() {
    return this.schema.courseTags;
  }
  get lessons() {
    return this.schema.lessons;
  }
  get userCourseProgress() {
    return this.schema.userCourseProgress;
  }
  get userLessonProgress() {
    return this.schema.userLessonProgress;
  }

  // Forum collections
  get posts() {
    return this.schema.posts;
  }
  get postTags() {
    return this.schema.postTags;
  }
  get comments() {
    return this.schema.comments;
  }
  get votes() {
    return this.schema.votes;
  }

  // Space collections
  get companions() {
    return this.schema.companions;
  }
  get companionExpertise() {
    return this.schema.companionExpertise;
  }
  get matches() {
    return this.schema.matches;
  }
  get matchRatings() {
    return this.schema.matchRatings;
  }
  get userMentorships() {
    return this.schema.userMentorships;
  }
  get nunuApplications() {
    return this.schema.nunuApplications;
  }
  get nunuProfiles() {
    return this.schema.nunuProfiles;
  }
  get matchingPosts() {
    return this.schema.matchingPosts;
  }
  get matchingPostTags() {
    return this.schema.matchingPostTags;
  }
  get matchingComments() {
    return this.schema.matchingComments;
  }

  // Sprint collections
  get seasons() {
    return this.schema.seasons;
  }
  get sprints() {
    return this.schema.sprints;
  }
  get projects() {
    return this.schema.projects;
  }
  get projectTechStack() {
    return this.schema.projectTechStack;
  }
  get projectVotes() {
    return this.schema.projectVotes;
  }

  // Shop collections
  get products() {
    return this.schema.products;
  }
  get planProducts() {
    return this.schema.planProducts;
  }
  get duoTicketProducts() {
    return this.schema.duoTicketProducts;
  }
  get eventProducts() {
    return this.schema.eventProducts;
  }
  get eventAgendaItems() {
    return this.schema.eventAgendaItems;
  }
  get eventFAQs() {
    return this.schema.eventFAQs;
  }
  get merchandiseProducts() {
    return this.schema.merchandiseProducts;
  }
  get merchandiseVariants() {
    return this.schema.merchandiseVariants;
  }
  get productReviews() {
    return this.schema.productReviews;
  }
  get carts() {
    return this.schema.carts;
  }
  get cartItems() {
    return this.schema.cartItems;
  }
  get orders() {
    return this.schema.orders;
  }
  get orderItems() {
    return this.schema.orderItems;
  }

  // Test collections
  get questions() {
    return this.schema.questions;
  }
  get testSessions() {
    return this.schema.testSessions;
  }
  get testAnswers() {
    return this.schema.testAnswers;
  }
  get userTestProgress() {
    return this.schema.userTestProgress;
  }
  get levelAttempts() {
    return this.schema.levelAttempts;
  }

  // ==========================================
  // Helper method to get all collection names
  // ==========================================
  getCollectionNames(): string[] {
    return Object.keys(this.schema);
  }
}

export { MockDB };
export type { DatabaseSchema };
