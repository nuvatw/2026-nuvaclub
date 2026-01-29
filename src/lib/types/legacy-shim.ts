/**
 * Legacy shim to allow UI to access Types without directly importing from @/Database.
 * This file is a temporary bridge until true DTOs are established for all features.
 * 
 * @deprecated Migrate these to application/dtos over time.
 */

export type {
    User,
    UserIdentity
} from '@/lib/types/legacy-tables/users';

export type {
    Season
} from '@/lib/types/legacy-tables/seasons';

export type {
    Companion,
    CompanionType
} from '@/lib/types/legacy-tables/companions';

export type {
    PlanProduct,
    PlanType,
    BillingCycle
} from '@/lib/types/legacy-tables/plans';

export type {
    MerchandiseProduct,
    MerchandiseVariant
} from '@/lib/types/legacy-tables/merchandise';

export type {
    ForumPost,
    Post,
    PostAuthor,
    PostCategory
} from '@/lib/types/legacy-tables/forumPosts';

export type {
    Comment,
    CommentAuthor
} from '@/lib/types/legacy-tables/comments';

export type {
    EventProduct,
    EventType,
    EventAgendaItem,
    EventFAQItem,
    EventSortBy
} from '@/lib/types/legacy-tables/events';

export type {
    DuoProduct,
    DuoVariant,
    NunuTier
} from '@/lib/types/legacy-tables/duo';

export type {
    Course,
    CourseCategory,
    CourseLevel,
    CourseType,
    CourseTrack,
    Chapter,
    Lesson,
    Trailer
} from '@/lib/types/legacy-tables/courses';

export type {
    Sprint,
    Project
} from '@/lib/types/legacy-tables/sprints';

export type {
    Product,
    ShopProduct,
    ProductCategory
} from '@/lib/types/legacy-tables/products';
