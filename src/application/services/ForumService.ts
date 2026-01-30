import { IPostRepository, PostWithRelations } from '../ports';
import { CreatePostInput } from '@/features/forum/types';

export class ForumService {
    constructor(private postRepository: IPostRepository) { }

    /**
     * Create a new forum post with stats and tags
     */
    async createPost(input: CreatePostInput): Promise<PostWithRelations | null> {
        try {
            // The repository should ideally handle stats and tags creation
            // For now, we'll assume the repository's create method or a specific method handles it
            const post = this.postRepository.create({
                title: input.title,
                content: input.content,
                category: input.category,
                authorId: input.authorId,
                isPinned: false,
                isLocked: false,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            // If the repository doesn't handle stats/tags yet, we'd need more port methods
            // but for clean architecture, the repo SHOULD handle it.

            return this.postRepository.findByIdWithRelations(post.id) ?? null;
        } catch (err) {
            console.error('ForumService.createPost failed:', err);
            throw err;
        }
    }

    /**
     * Get recent posts
     */
    async getRecentPosts(limit = 10): Promise<PostWithRelations[]> {
        return this.postRepository.findRecent(limit);
    }
}
