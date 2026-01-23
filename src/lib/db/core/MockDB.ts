import { Collection } from './Collection';
import type { StorageAdapter } from '../adapters/StorageAdapter';
import { LocalStorageAdapter } from '../adapters/LocalStorageAdapter';
import type { DBEvent, DBEventListener } from './types';

// Import all schema types
import type {
  // User
  UserRecord,
  UserSubscriptionRecord,
  UserDuoTicketRecord,
  DuoMonthPassRecord,
  UserFavoriteRecord,
  UserActivityRecord,
  UserPointsRecord,
  PointTransactionRecord,
} from '../schema/user.schema';

import type {
  // Learn
  InstructorRecord,
  InstructorExpertiseRecord,
  CourseCategoryRecord,
  CourseRecord,
  CourseTagRecord,
  LessonRecord,
  LessonResourceRecord,
  UserCourseEnrollmentRecord,
  UserLessonProgressRecord,
  UserCompletedLessonRecord,
  CourseReviewRecord,
} from '../schema/learn.schema';

import type {
  // Forum
  ForumPostRecord,
  ForumPostStatsRecord,
  ForumPostTagRecord,
  ForumCommentRecord,
  ForumCommentStatsRecord,
  ForumVoteRecord,
  ForumPostViewRecord,
  ForumBookmarkRecord,
  ForumPostEventRecord,
} from '../schema/forum.schema';

import type {
  // Space
  CompanionRecord,
  CompanionExpertiseRecord,
  CompanionStatsRecord,
  MatchRecord,
  MatchRatingRecord,
  NunuApplicationRecord,
  NunuApplicationExpertiseRecord,
  NunuApplicationAnswerRecord,
  NunuProfileRecord,
  NunuProfileExpertiseRecord,
  NunuStatsRecord,
  UserMentorshipRecord,
  MentorshipSessionRecord,
  MatchingPostRecord,
  MatchingPostStatsRecord,
  MatchingPostTagRecord,
  MatchingCommentRecord,
  MentorshipAgreementRecord,
} from '../schema/space.schema';

import type {
  // Sprint
  SeasonRecord,
  SprintRecord,
  SprintStatsRecord,
  ProjectRecord,
  ProjectStatsRecord,
  ProjectTechStackRecord,
  ProjectScreenshotRecord,
  ProjectTeamMemberRecord,
  ProjectVoteRecord,
  ProjectStarRecord,
  ProjectCommentRecord,
  SprintAwardRecord,
  ProjectAwardRecord,
} from '../schema/sprint.schema';

import type {
  // Shop
  ProductRecord,
  ProductStatsRecord,
  PlanProductRecord,
  PlanProductFeatureRecord,
  EventProductRecord,
  EventLearningOutcomeRecord,
  EventTargetAudienceRecord,
  EventAgendaItemRecord,
  EventFAQRecord,
  MerchandiseProductRecord,
  MerchandiseVariantRecord,
  ProductReviewRecord,
  CartRecord,
  CartItemRecord,
  OrderRecord,
  OrderItemRecord,
  DiscountCodeRecord,
  DiscountCodeUseRecord,
} from '../schema/shop.schema';

import type {
  // Test
  TestLevelRecord,
  QuestionCategoryRecord,
  QuestionRecord,
  QuestionOptionRecord,
  QuestionMediaRecord,
  TestSessionRecord,
  TestSessionQuestionRecord,
  TestAnswerRecord,
  UserTestProgressRecord,
  LevelAttemptRecord,
  UserLevelStatsRecord,
  QuestionStatsRecord,
} from '../schema/test.schema';

/**
 * Database schema containing all collections
 * Following 3NF Normalization with proper junction tables
 */
interface DatabaseSchema {
  // ==========================================
  // USER MODULE COLLECTIONS
  // ==========================================
  users: Collection<UserRecord>;
  userSubscriptions: Collection<UserSubscriptionRecord>;
  userDuoTickets: Collection<UserDuoTicketRecord>;
  duoMonthPasses: Collection<DuoMonthPassRecord>;
  userFavorites: Collection<UserFavoriteRecord>;
  userActivities: Collection<UserActivityRecord>;
  userPoints: Collection<UserPointsRecord>;
  pointTransactions: Collection<PointTransactionRecord>;

  // ==========================================
  // LEARN MODULE COLLECTIONS
  // ==========================================
  instructors: Collection<InstructorRecord>;
  instructorExpertise: Collection<InstructorExpertiseRecord>;
  courseCategories: Collection<CourseCategoryRecord>;
  courses: Collection<CourseRecord>;
  courseTags: Collection<CourseTagRecord>;
  lessons: Collection<LessonRecord>;
  lessonResources: Collection<LessonResourceRecord>;
  userCourseEnrollments: Collection<UserCourseEnrollmentRecord>;
  userLessonProgress: Collection<UserLessonProgressRecord>;
  userCompletedLessons: Collection<UserCompletedLessonRecord>;
  courseReviews: Collection<CourseReviewRecord>;

  // ==========================================
  // FORUM MODULE COLLECTIONS
  // ==========================================
  forumPosts: Collection<ForumPostRecord>;
  forumPostStats: Collection<ForumPostStatsRecord>;
  forumPostTags: Collection<ForumPostTagRecord>;
  forumComments: Collection<ForumCommentRecord>;
  forumCommentStats: Collection<ForumCommentStatsRecord>;
  forumVotes: Collection<ForumVoteRecord>;
  forumPostViews: Collection<ForumPostViewRecord>;
  forumBookmarks: Collection<ForumBookmarkRecord>;
  forumPostEvents: Collection<ForumPostEventRecord>;

  // ==========================================
  // SPACE MODULE COLLECTIONS
  // ==========================================
  companions: Collection<CompanionRecord>;
  companionExpertise: Collection<CompanionExpertiseRecord>;
  companionStats: Collection<CompanionStatsRecord>;
  matches: Collection<MatchRecord>;
  matchRatings: Collection<MatchRatingRecord>;
  nunuApplications: Collection<NunuApplicationRecord>;
  nunuApplicationExpertise: Collection<NunuApplicationExpertiseRecord>;
  nunuApplicationAnswers: Collection<NunuApplicationAnswerRecord>;
  nunuProfiles: Collection<NunuProfileRecord>;
  nunuProfileExpertise: Collection<NunuProfileExpertiseRecord>;
  nunuStats: Collection<NunuStatsRecord>;
  userMentorships: Collection<UserMentorshipRecord>;
  mentorshipSessions: Collection<MentorshipSessionRecord>;
  matchingPosts: Collection<MatchingPostRecord>;
  matchingPostStats: Collection<MatchingPostStatsRecord>;
  matchingPostTags: Collection<MatchingPostTagRecord>;
  matchingComments: Collection<MatchingCommentRecord>;
  mentorshipAgreements: Collection<MentorshipAgreementRecord>;

  // ==========================================
  // SPRINT MODULE COLLECTIONS
  // ==========================================
  seasons: Collection<SeasonRecord>;
  sprints: Collection<SprintRecord>;
  sprintStats: Collection<SprintStatsRecord>;
  projects: Collection<ProjectRecord>;
  projectStats: Collection<ProjectStatsRecord>;
  projectTechStack: Collection<ProjectTechStackRecord>;
  projectScreenshots: Collection<ProjectScreenshotRecord>;
  projectTeamMembers: Collection<ProjectTeamMemberRecord>;
  projectVotes: Collection<ProjectVoteRecord>;
  projectStars: Collection<ProjectStarRecord>;
  projectComments: Collection<ProjectCommentRecord>;
  sprintAwards: Collection<SprintAwardRecord>;
  projectAwards: Collection<ProjectAwardRecord>;

  // ==========================================
  // SHOP MODULE COLLECTIONS
  // ==========================================
  products: Collection<ProductRecord>;
  productStats: Collection<ProductStatsRecord>;
  planProducts: Collection<PlanProductRecord>;
  planProductFeatures: Collection<PlanProductFeatureRecord>;
  eventProducts: Collection<EventProductRecord>;
  eventLearningOutcomes: Collection<EventLearningOutcomeRecord>;
  eventTargetAudiences: Collection<EventTargetAudienceRecord>;
  eventAgendaItems: Collection<EventAgendaItemRecord>;
  eventFAQs: Collection<EventFAQRecord>;
  merchandiseProducts: Collection<MerchandiseProductRecord>;
  merchandiseVariants: Collection<MerchandiseVariantRecord>;
  productReviews: Collection<ProductReviewRecord>;
  carts: Collection<CartRecord>;
  cartItems: Collection<CartItemRecord>;
  orders: Collection<OrderRecord>;
  orderItems: Collection<OrderItemRecord>;
  discountCodes: Collection<DiscountCodeRecord>;
  discountCodeUses: Collection<DiscountCodeUseRecord>;

  // ==========================================
  // TEST MODULE COLLECTIONS
  // ==========================================
  testLevels: Collection<TestLevelRecord>;
  questionCategories: Collection<QuestionCategoryRecord>;
  questions: Collection<QuestionRecord>;
  questionOptions: Collection<QuestionOptionRecord>;
  questionMedia: Collection<QuestionMediaRecord>;
  testSessions: Collection<TestSessionRecord>;
  testSessionQuestions: Collection<TestSessionQuestionRecord>;
  testAnswers: Collection<TestAnswerRecord>;
  userTestProgress: Collection<UserTestProgressRecord>;
  levelAttempts: Collection<LevelAttemptRecord>;
  userLevelStats: Collection<UserLevelStatsRecord>;
  questionStats: Collection<QuestionStatsRecord>;
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
      // ==========================================
      // USER MODULE COLLECTIONS
      // ==========================================
      users: new Collection<UserRecord>('users'),
      userSubscriptions: new Collection<UserSubscriptionRecord>('userSubscriptions'),
      userDuoTickets: new Collection<UserDuoTicketRecord>('userDuoTickets'),
      duoMonthPasses: new Collection<DuoMonthPassRecord>('duoMonthPasses'),
      userFavorites: new Collection<UserFavoriteRecord>('userFavorites'),
      userActivities: new Collection<UserActivityRecord>('userActivities'),
      userPoints: new Collection<UserPointsRecord>('userPoints'),
      pointTransactions: new Collection<PointTransactionRecord>('pointTransactions'),

      // ==========================================
      // LEARN MODULE COLLECTIONS
      // ==========================================
      instructors: new Collection<InstructorRecord>('instructors'),
      instructorExpertise: new Collection<InstructorExpertiseRecord>('instructorExpertise'),
      courseCategories: new Collection<CourseCategoryRecord>('courseCategories'),
      courses: new Collection<CourseRecord>('courses'),
      courseTags: new Collection<CourseTagRecord>('courseTags'),
      lessons: new Collection<LessonRecord>('lessons'),
      lessonResources: new Collection<LessonResourceRecord>('lessonResources'),
      userCourseEnrollments: new Collection<UserCourseEnrollmentRecord>('userCourseEnrollments'),
      userLessonProgress: new Collection<UserLessonProgressRecord>('userLessonProgress'),
      userCompletedLessons: new Collection<UserCompletedLessonRecord>('userCompletedLessons'),
      courseReviews: new Collection<CourseReviewRecord>('courseReviews'),

      // ==========================================
      // FORUM MODULE COLLECTIONS
      // ==========================================
      forumPosts: new Collection<ForumPostRecord>('forumPosts'),
      forumPostStats: new Collection<ForumPostStatsRecord>('forumPostStats'),
      forumPostTags: new Collection<ForumPostTagRecord>('forumPostTags'),
      forumComments: new Collection<ForumCommentRecord>('forumComments'),
      forumCommentStats: new Collection<ForumCommentStatsRecord>('forumCommentStats'),
      forumVotes: new Collection<ForumVoteRecord>('forumVotes'),
      forumPostViews: new Collection<ForumPostViewRecord>('forumPostViews'),
      forumBookmarks: new Collection<ForumBookmarkRecord>('forumBookmarks'),
      forumPostEvents: new Collection<ForumPostEventRecord>('forumPostEvents'),

      // ==========================================
      // SPACE MODULE COLLECTIONS
      // ==========================================
      companions: new Collection<CompanionRecord>('companions'),
      companionExpertise: new Collection<CompanionExpertiseRecord>('companionExpertise'),
      companionStats: new Collection<CompanionStatsRecord>('companionStats'),
      matches: new Collection<MatchRecord>('matches'),
      matchRatings: new Collection<MatchRatingRecord>('matchRatings'),
      nunuApplications: new Collection<NunuApplicationRecord>('nunuApplications'),
      nunuApplicationExpertise: new Collection<NunuApplicationExpertiseRecord>('nunuApplicationExpertise'),
      nunuApplicationAnswers: new Collection<NunuApplicationAnswerRecord>('nunuApplicationAnswers'),
      nunuProfiles: new Collection<NunuProfileRecord>('nunuProfiles'),
      nunuProfileExpertise: new Collection<NunuProfileExpertiseRecord>('nunuProfileExpertise'),
      nunuStats: new Collection<NunuStatsRecord>('nunuStats'),
      userMentorships: new Collection<UserMentorshipRecord>('userMentorships'),
      mentorshipSessions: new Collection<MentorshipSessionRecord>('mentorshipSessions'),
      matchingPosts: new Collection<MatchingPostRecord>('matchingPosts'),
      matchingPostStats: new Collection<MatchingPostStatsRecord>('matchingPostStats'),
      matchingPostTags: new Collection<MatchingPostTagRecord>('matchingPostTags'),
      matchingComments: new Collection<MatchingCommentRecord>('matchingComments'),
      mentorshipAgreements: new Collection<MentorshipAgreementRecord>('mentorshipAgreements'),

      // ==========================================
      // SPRINT MODULE COLLECTIONS
      // ==========================================
      seasons: new Collection<SeasonRecord>('seasons'),
      sprints: new Collection<SprintRecord>('sprints'),
      sprintStats: new Collection<SprintStatsRecord>('sprintStats'),
      projects: new Collection<ProjectRecord>('projects'),
      projectStats: new Collection<ProjectStatsRecord>('projectStats'),
      projectTechStack: new Collection<ProjectTechStackRecord>('projectTechStack'),
      projectScreenshots: new Collection<ProjectScreenshotRecord>('projectScreenshots'),
      projectTeamMembers: new Collection<ProjectTeamMemberRecord>('projectTeamMembers'),
      projectVotes: new Collection<ProjectVoteRecord>('projectVotes'),
      projectStars: new Collection<ProjectStarRecord>('projectStars'),
      projectComments: new Collection<ProjectCommentRecord>('projectComments'),
      sprintAwards: new Collection<SprintAwardRecord>('sprintAwards'),
      projectAwards: new Collection<ProjectAwardRecord>('projectAwards'),

      // ==========================================
      // SHOP MODULE COLLECTIONS
      // ==========================================
      products: new Collection<ProductRecord>('products'),
      productStats: new Collection<ProductStatsRecord>('productStats'),
      planProducts: new Collection<PlanProductRecord>('planProducts'),
      planProductFeatures: new Collection<PlanProductFeatureRecord>('planProductFeatures'),
      eventProducts: new Collection<EventProductRecord>('eventProducts'),
      eventLearningOutcomes: new Collection<EventLearningOutcomeRecord>('eventLearningOutcomes'),
      eventTargetAudiences: new Collection<EventTargetAudienceRecord>('eventTargetAudiences'),
      eventAgendaItems: new Collection<EventAgendaItemRecord>('eventAgendaItems'),
      eventFAQs: new Collection<EventFAQRecord>('eventFAQs'),
      merchandiseProducts: new Collection<MerchandiseProductRecord>('merchandiseProducts'),
      merchandiseVariants: new Collection<MerchandiseVariantRecord>('merchandiseVariants'),
      productReviews: new Collection<ProductReviewRecord>('productReviews'),
      carts: new Collection<CartRecord>('carts'),
      cartItems: new Collection<CartItemRecord>('cartItems'),
      orders: new Collection<OrderRecord>('orders'),
      orderItems: new Collection<OrderItemRecord>('orderItems'),
      discountCodes: new Collection<DiscountCodeRecord>('discountCodes'),
      discountCodeUses: new Collection<DiscountCodeUseRecord>('discountCodeUses'),

      // ==========================================
      // TEST MODULE COLLECTIONS
      // ==========================================
      testLevels: new Collection<TestLevelRecord>('testLevels'),
      questionCategories: new Collection<QuestionCategoryRecord>('questionCategories'),
      questions: new Collection<QuestionRecord>('questions'),
      questionOptions: new Collection<QuestionOptionRecord>('questionOptions'),
      questionMedia: new Collection<QuestionMediaRecord>('questionMedia'),
      testSessions: new Collection<TestSessionRecord>('testSessions'),
      testSessionQuestions: new Collection<TestSessionQuestionRecord>('testSessionQuestions'),
      testAnswers: new Collection<TestAnswerRecord>('testAnswers'),
      userTestProgress: new Collection<UserTestProgressRecord>('userTestProgress'),
      levelAttempts: new Collection<LevelAttemptRecord>('levelAttempts'),
      userLevelStats: new Collection<UserLevelStatsRecord>('userLevelStats'),
      questionStats: new Collection<QuestionStatsRecord>('questionStats'),
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

  // ==========================================
  // USER MODULE ACCESSORS
  // ==========================================
  get users() { return this.schema.users; }
  get userSubscriptions() { return this.schema.userSubscriptions; }
  get userDuoTickets() { return this.schema.userDuoTickets; }
  get duoMonthPasses() { return this.schema.duoMonthPasses; }
  get userFavorites() { return this.schema.userFavorites; }
  get userActivities() { return this.schema.userActivities; }
  get userPoints() { return this.schema.userPoints; }
  get pointTransactions() { return this.schema.pointTransactions; }

  // ==========================================
  // LEARN MODULE ACCESSORS
  // ==========================================
  get instructors() { return this.schema.instructors; }
  get instructorExpertise() { return this.schema.instructorExpertise; }
  get courseCategories() { return this.schema.courseCategories; }
  get courses() { return this.schema.courses; }
  get courseTags() { return this.schema.courseTags; }
  get lessons() { return this.schema.lessons; }
  get lessonResources() { return this.schema.lessonResources; }
  get userCourseEnrollments() { return this.schema.userCourseEnrollments; }
  get userLessonProgress() { return this.schema.userLessonProgress; }
  get userCompletedLessons() { return this.schema.userCompletedLessons; }
  get courseReviews() { return this.schema.courseReviews; }

  // ==========================================
  // FORUM MODULE ACCESSORS
  // ==========================================
  get forumPosts() { return this.schema.forumPosts; }
  get forumPostStats() { return this.schema.forumPostStats; }
  get forumPostTags() { return this.schema.forumPostTags; }
  get forumComments() { return this.schema.forumComments; }
  get forumCommentStats() { return this.schema.forumCommentStats; }
  get forumVotes() { return this.schema.forumVotes; }
  get forumPostViews() { return this.schema.forumPostViews; }
  get forumBookmarks() { return this.schema.forumBookmarks; }
  get forumPostEvents() { return this.schema.forumPostEvents; }

  // ==========================================
  // SPACE MODULE ACCESSORS
  // ==========================================
  get companions() { return this.schema.companions; }
  get companionExpertise() { return this.schema.companionExpertise; }
  get companionStats() { return this.schema.companionStats; }
  get matches() { return this.schema.matches; }
  get matchRatings() { return this.schema.matchRatings; }
  get nunuApplications() { return this.schema.nunuApplications; }
  get nunuApplicationExpertise() { return this.schema.nunuApplicationExpertise; }
  get nunuApplicationAnswers() { return this.schema.nunuApplicationAnswers; }
  get nunuProfiles() { return this.schema.nunuProfiles; }
  get nunuProfileExpertise() { return this.schema.nunuProfileExpertise; }
  get nunuStats() { return this.schema.nunuStats; }
  get userMentorships() { return this.schema.userMentorships; }
  get mentorshipSessions() { return this.schema.mentorshipSessions; }
  get matchingPosts() { return this.schema.matchingPosts; }
  get matchingPostStats() { return this.schema.matchingPostStats; }
  get matchingPostTags() { return this.schema.matchingPostTags; }
  get matchingComments() { return this.schema.matchingComments; }
  get mentorshipAgreements() { return this.schema.mentorshipAgreements; }

  // ==========================================
  // SPRINT MODULE ACCESSORS
  // ==========================================
  get seasons() { return this.schema.seasons; }
  get sprints() { return this.schema.sprints; }
  get sprintStats() { return this.schema.sprintStats; }
  get projects() { return this.schema.projects; }
  get projectStats() { return this.schema.projectStats; }
  get projectTechStack() { return this.schema.projectTechStack; }
  get projectScreenshots() { return this.schema.projectScreenshots; }
  get projectTeamMembers() { return this.schema.projectTeamMembers; }
  get projectVotes() { return this.schema.projectVotes; }
  get projectStars() { return this.schema.projectStars; }
  get projectComments() { return this.schema.projectComments; }
  get sprintAwards() { return this.schema.sprintAwards; }
  get projectAwards() { return this.schema.projectAwards; }

  // ==========================================
  // SHOP MODULE ACCESSORS
  // ==========================================
  get products() { return this.schema.products; }
  get productStats() { return this.schema.productStats; }
  get planProducts() { return this.schema.planProducts; }
  get planProductFeatures() { return this.schema.planProductFeatures; }
  get eventProducts() { return this.schema.eventProducts; }
  get eventLearningOutcomes() { return this.schema.eventLearningOutcomes; }
  get eventTargetAudiences() { return this.schema.eventTargetAudiences; }
  get eventAgendaItems() { return this.schema.eventAgendaItems; }
  get eventFAQs() { return this.schema.eventFAQs; }
  get merchandiseProducts() { return this.schema.merchandiseProducts; }
  get merchandiseVariants() { return this.schema.merchandiseVariants; }
  get productReviews() { return this.schema.productReviews; }
  get carts() { return this.schema.carts; }
  get cartItems() { return this.schema.cartItems; }
  get orders() { return this.schema.orders; }
  get orderItems() { return this.schema.orderItems; }
  get discountCodes() { return this.schema.discountCodes; }
  get discountCodeUses() { return this.schema.discountCodeUses; }

  // ==========================================
  // TEST MODULE ACCESSORS
  // ==========================================
  get testLevels() { return this.schema.testLevels; }
  get questionCategories() { return this.schema.questionCategories; }
  get questions() { return this.schema.questions; }
  get questionOptions() { return this.schema.questionOptions; }
  get questionMedia() { return this.schema.questionMedia; }
  get testSessions() { return this.schema.testSessions; }
  get testSessionQuestions() { return this.schema.testSessionQuestions; }
  get testAnswers() { return this.schema.testAnswers; }
  get userTestProgress() { return this.schema.userTestProgress; }
  get levelAttempts() { return this.schema.levelAttempts; }
  get userLevelStats() { return this.schema.userLevelStats; }
  get questionStats() { return this.schema.questionStats; }

  // ==========================================
  // Helper method to get all collection names
  // ==========================================
  getCollectionNames(): string[] {
    return Object.keys(this.schema);
  }
}

export { MockDB };
export type { DatabaseSchema };
