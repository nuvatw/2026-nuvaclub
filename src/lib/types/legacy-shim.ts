/**
 * Legacy shim to allow UI to access Types without directly importing from @/Database.
 * This file is a temporary bridge until true DTOs are established for all features.
 * 
 * @deprecated Migrate these to application/dtos over time.
 */

export type {
    User,
    UserIdentity
} from '@/infra/mock/data/users';

export type {
    Season
} from '@/infra/mock/data/seasons';

export type {
    Companion,
    CompanionType
} from '@/infra/mock/data/companions';

export type {
    PlanProduct,
    PlanType,
    BillingCycle
} from '@/infra/mock/data/plans';

export type {
    MerchandiseProduct,
    MerchandiseVariant
} from '@/infra/mock/data/merchandise';

export type {
    ForumPost,
    Post,
    PostAuthor,
    PostCategory
} from '@/infra/mock/data/forumPosts';

export type {
    Comment,
    CommentAuthor
} from '@/infra/mock/data/comments';

export type {
    EventProduct,
    EventType,
    EventAgendaItem,
    EventFAQItem,
    EventSortBy
} from '@/infra/mock/data/events';

export type {
    DuoProduct,
    DuoVariant,
    NunuTier
} from '@/infra/mock/data/duo';

export type {
    Course,
    CourseCategory,
    CourseLevel,
    CourseType,
    CourseTrack,
    Chapter,
    Lesson,
    Trailer
} from '@/infra/mock/data/courses';

export type {
    Sprint,
    Project
} from '@/infra/mock/data/sprints';

export type {
    Product,
    ShopProduct,
    ProductCategory
} from '@/infra/mock/data/products';
