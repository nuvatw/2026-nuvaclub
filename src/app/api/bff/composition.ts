import { MockDB } from '@/infra/mock/core/MockDB';
import {
    UserRepository,
    PostRepository,
    CourseRepository,
    SprintRepository,
    TestRepository,
    ProductRepository,
    LearnRepository,
    SpaceRepository,
    PointsRepository,
    DuoRepository
} from '@/infra/mock/repositories';

import { MemberService } from '@/application/services/MemberService';
import { ForumService } from '@/application/services/ForumService';
import { AuthService } from '@/application/services/AuthService';
import { LearnService } from '@/application/services/LearnService';
import { ShopService } from '@/application/services/ShopService';
import { SprintService } from '@/application/services/SprintService';
import { TestService } from '@/application/services/TestService';
import { AccessService } from '@/application/services/AccessService';
import { GetMembershipSummaryService } from '@/application/services/GetMembershipSummaryService';
import { PointsService } from '@/application/services/PointsService';
import { CampaignService } from '@/application/services/CampaignService';

import {
    IUserRepository,
    IPostRepository,
    ICourseRepository,
    ISprintRepository,
    ITestRepository,
    IProductRepository,
    ILearnRepository,
    ISpaceRepository,
    IPointsRepository,
    IDuoRepository
} from '@/application/ports';

/**
 * Composition Root
 * Responsible for instantiating and wiring all dependencies.
 */
class CompositionRoot {
    private static instance: CompositionRoot;

    public db: MockDB;

    // Repositories (defined by interfaces)
    public userRepository: IUserRepository;
    public postRepository: IPostRepository;
    public courseRepository: ICourseRepository;
    public sprintRepository: ISprintRepository;
    public testRepository: ITestRepository;
    public productRepository: IProductRepository;
    public learnRepository: ILearnRepository;
    public spaceRepository: ISpaceRepository;
    public pointsRepository: IPointsRepository;
    public duoRepository: IDuoRepository;

    // Services
    public memberService: MemberService;
    public forumService: ForumService;
    public authService: AuthService;
    public learnService: LearnService;
    public shopService: ShopService;
    public sprintService: SprintService;
    public testService: TestService;
    public accessService: AccessService;
    public getMembershipSummaryService: GetMembershipSummaryService;
    public pointsService: PointsService;
    public campaignService: CampaignService;

    private constructor() {
        this.db = MockDB.getInstance();

        // Strategy Selector (DATA_SOURCE=mock | database)
        const dataSource = process.env.DATA_SOURCE || 'mock';

        if (dataSource === 'mock') {
            // Instantiate Mock Repositories
            this.userRepository = new UserRepository(this.db);
            this.postRepository = new PostRepository(this.db);
            this.courseRepository = new CourseRepository(this.db);
            this.sprintRepository = new SprintRepository(this.db);
            this.testRepository = new TestRepository(this.db);
            this.productRepository = new ProductRepository(this.db);
            this.learnRepository = new LearnRepository(this.db);
            this.spaceRepository = new SpaceRepository(this.db);
            this.pointsRepository = new PointsRepository(this.db);
            this.duoRepository = new DuoRepository(this.db);
        } else {
            // Future: Instantiate Database Repositories
            // For now, fallback to mock to prevent crash
            console.warn(`[CompositionRoot] DATA_SOURCE=${dataSource} not yet implemented. Falling back to mock.`);
            this.userRepository = new UserRepository(this.db);
            this.postRepository = new PostRepository(this.db);
            this.courseRepository = new CourseRepository(this.db);
            this.sprintRepository = new SprintRepository(this.db);
            this.testRepository = new TestRepository(this.db);
            this.productRepository = new ProductRepository(this.db);
            this.learnRepository = new LearnRepository(this.db);
            this.spaceRepository = new SpaceRepository(this.db);
            this.pointsRepository = new PointsRepository(this.db);
            this.duoRepository = new DuoRepository(this.db);
        }

        // Instantiate Services with Dependency Injection (Port-based)
        this.memberService = new MemberService(
            this.userRepository,
            this.courseRepository,
            this.postRepository,
            this.productRepository,
            this.learnRepository
        );
        this.forumService = new ForumService(this.postRepository);
        this.authService = new AuthService(this.userRepository);
        this.learnService = new LearnService(this.courseRepository, this.learnRepository);
        this.shopService = new ShopService(this.userRepository, this.productRepository, this.duoRepository);
        this.sprintService = new SprintService(this.spaceRepository);
        this.testService = new TestService(this.testRepository);
        this.accessService = new AccessService(this.courseRepository, this.sprintRepository);
        this.getMembershipSummaryService = new GetMembershipSummaryService(this.userRepository);
        this.pointsService = new PointsService(this.pointsRepository);
        this.campaignService = new CampaignService();
    }

    public static getInstance(): CompositionRoot {
        if (!CompositionRoot.instance) {
            CompositionRoot.instance = new CompositionRoot();
        }
        return CompositionRoot.instance;
    }
}

// Export a single instance of the composition root or individual services
export const composition = CompositionRoot.getInstance();

// Individual service exports for convenience in BFF
export const {
    memberService,
    forumService,
    authService,
    learnService,
    shopService,
    sprintService,
    testService,
    accessService,
    getMembershipSummaryService,
    pointsService,
    campaignService,
    duoRepository
} = composition;
