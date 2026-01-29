export type Brand<K, T> = K & { __brand: T };

export type UserId = Brand<string, 'UserId'>;
export type CourseId = Brand<string, 'CourseId'>;
export type LessonId = Brand<string, 'LessonId'>;
export type ChapterId = Brand<string, 'ChapterId'>;
export type PlanId = Brand<string, 'PlanId'>;
export type OrderId = Brand<string, 'OrderId'>;
export type SubscriptionId = Brand<string, 'SubscriptionId'>;
export type SpaceId = Brand<string, 'SpaceId'>;
export type PostId = Brand<string, 'PostId'>;
export type CommentId = Brand<string, 'CommentId'>;
export type SprintId = Brand<string, 'SprintId'>;
export type ProjectId = Brand<string, 'ProjectId'>;
export type EntitlementId = Brand<string, 'EntitlementId'>;

export const Ids = {
    User: (id: string) => id as UserId,
    Course: (id: string) => id as CourseId,
    Lesson: (id: string) => id as LessonId,
    Chapter: (id: string) => id as ChapterId,
    Plan: (id: string) => id as PlanId,
    Order: (id: string) => id as OrderId,
    Subscription: (id: string) => id as SubscriptionId,
    Space: (id: string) => id as SpaceId,
    Post: (id: string) => id as PostId,
    Comment: (id: string) => id as CommentId,
    Sprint: (id: string) => id as SprintId,
    Project: (id: string) => id as ProjectId,
    Entitlement: (id: string) => id as EntitlementId,
};
