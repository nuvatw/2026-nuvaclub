import { IUserRepository, ICourseRepository, IPostRepository, IProductRepository, ILearnRepository } from '../ports';

export interface FavoriteItem {
    id: string;
    type: string;
    itemId: string;
    addedAt: Date;
    title: string;
    subtitle: string;
    thumbnail?: string;
    href: string;
    meta?: string;
}

export interface CourseEnrollment {
    id: string;
    courseId: string;
    progressPercent: number;
    completedAt?: Date;
    lastAccessedAt: Date;
    courseTitle: string;
    courseSubtitle: string;
    thumbnailUrl: string;
    instructorName: string;
    instructorAvatar: string;
    categoryName: string;
}

export class MemberService {
    constructor(
        private userRepository: IUserRepository,
        private courseRepository: ICourseRepository,
        private postRepository: IPostRepository,
        private productRepository: IProductRepository,
        private learnRepository: ILearnRepository
    ) { }

    /**
     * Get user favorites with full details
     */
    async getFavorites(userId: string): Promise<FavoriteItem[]> {
        const rawFavorites = this.userRepository.getFavorites(userId);

        const results: FavoriteItem[] = [];

        for (const fav of rawFavorites) {
            switch (fav.itemType) {
                case 'course': {
                    const course = this.courseRepository.findById(fav.itemId);
                    if (course) {
                        results.push({
                            id: fav.id,
                            type: 'course',
                            itemId: fav.itemId,
                            addedAt: fav.createdAt,
                            title: course.title,
                            subtitle: course.subtitle,
                            thumbnail: course.thumbnailUrl,
                            href: `/learn/${course.id}`,
                            meta: '', // Meta can be populated later if needed
                        });
                    }
                    break;
                }
                case 'post': {
                    const post = this.postRepository.findById(fav.itemId);
                    if (post) {
                        results.push({
                            id: fav.id,
                            type: 'post',
                            itemId: fav.itemId,
                            addedAt: fav.createdAt,
                            title: post.title,
                            subtitle: post.content.substring(0, 100) + '...',
                            href: `/forum/${post.id}`,
                            meta: '',
                        });
                    }
                    break;
                }
                case 'product': {
                    const product = this.productRepository.findById(fav.itemId);
                    if (product) {
                        results.push({
                            id: fav.id,
                            type: 'product',
                            itemId: fav.itemId,
                            addedAt: fav.createdAt,
                            title: product.name,
                            subtitle: product.description.substring(0, 100) + '...',
                            thumbnail: product.imageUrl,
                            href: `/shop/${product.id}`,
                            meta: `$${product.price.toFixed(2)}`,
                        });
                    }
                    break;
                }
            }
        }

        return results;
    }

    /**
     * Remove a favorite
     */
    async removeFavorite(favoriteId: string): Promise<boolean> {
        return this.userRepository.removeFavorite(favoriteId);
    }

    /**
   * Get user active subscription
   */
    async getSubscription(userId: string) {
        return this.userRepository.getActiveSubscription(userId);
    }

    /**
     * Get user active duo ticket
     */
    async getDuoTicket(userId: string) {
        return this.userRepository.getActiveDuoTicket(userId);
    }

    /**
     * Get detailed profile data for a member
     */
    async getProfile(userId: string) {
        const user = this.userRepository.findById(userId);
        if (!user) return null;

        const subscription = await this.getSubscription(userId);
        const duoTicket = await this.getDuoTicket(userId);
        const enrollments = await this.getEnrollments(userId);
        const favorites = this.userRepository.getFavorites(userId);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                bio: user.bio,
                discordId: user.discordId,
                githubUsername: user.githubUsername,
                identityType: user.identityType,
                createdAt: user.createdAt,
            },
            subscription,
            duoTicket,
            enrollments,
            favoritesCount: favorites.length,
        };
    }

    /**
     * Get user course enrollments with progress and details
     */
    async getEnrollments(userId: string): Promise<CourseEnrollment[]> {
        const enrollments = this.learnRepository.getUserEnrollments(userId);
        const results: CourseEnrollment[] = [];

        for (const enrollment of enrollments) {
            const course = this.courseRepository.findById(enrollment.courseId);
            if (course) {
                const instructor = this.userRepository.findById(course.instructorId);

                results.push({
                    id: enrollment.id,
                    courseId: enrollment.courseId,
                    progressPercent: enrollment.progressPercent,
                    completedAt: enrollment.completedAt,
                    lastAccessedAt: enrollment.lastAccessedAt,
                    courseTitle: course.title,
                    courseSubtitle: course.subtitle,
                    thumbnailUrl: course.thumbnailUrl,
                    instructorName: instructor?.name || 'Unknown Instructor',
                    instructorAvatar: instructor?.avatar || '',
                    categoryName: course.categoryId, // Simple category mapping for now
                });
            }
        }

        return results;
    }
}
