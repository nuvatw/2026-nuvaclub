/**
 * Legacy shim to allow UI to access Types without directly importing from @/Database.
 * This file is a temporary bridge until true DTOs are established for all features.
 * 
 * @deprecated Migrate these to application/dtos over time.
 */

export type {
    User,
    UserIdentity
} from '@/Database/tables/users';

export type {
    Season
} from '@/Database/tables/seasons';

export type {
    Companion,
    CompanionType
} from '@/Database/tables/companions';

export type {
    PlanProduct,
    PlanType,
    BillingCycle
} from '@/Database/tables/plans';

export type {
    MerchandiseProduct,
    MerchandiseVariant
} from '@/Database/tables/merchandise';

export type {
    ForumPost,
    Post,
    PostAuthor,
    PostCategory
} from '@/Database/tables/forumPosts';

export type {
    Comment,
    CommentAuthor
} from '@/Database/tables/comments';

export type {
    EventProduct,
    EventType,
    EventAgendaItem,
    EventFAQItem,
    EventSortBy
} from '@/Database/tables/events';

export type {
    DuoProduct,
    DuoVariant,
    NunuTier
} from '@/Database/tables/duo';

export type {
    Course,
    CourseCategory,
    CourseLevel,
    CourseType,
    CourseTrack,
    Chapter,
    Lesson,
    Trailer
} from '@/Database/tables/courses';

export type {
    Sprint,
    Project
} from '@/Database/tables/sprints';

export type {
    Product,
    ShopProduct,
    ProductCategory
} from '@/Database/tables/products';
