
import {
    SeasonRecord,
    SprintRecord,
    ProjectRecord
} from '../mock/schema/sprint.schema';
import {
    SeasonDTO,
    SprintDTO,
    ProjectDTO
} from '@/domain/sprint/SprintDTO';

export class SprintMapper {
    static toSeasonDTO(record: SeasonRecord): SeasonDTO {
        return {
            id: record.id,
            name: record.name,
            description: record.description,
            theme: record.theme,
            startDate: record.startDate.toISOString(),
            endDate: record.endDate.toISOString(),
            status: record.status,
        };
    }

    static toSprintDTO(record: SprintRecord): SprintDTO {
        return {
            id: record.id,
            seasonId: record.seasonId,
            title: record.title,
            description: record.description,
            theme: record.theme,
            thumbnailUrl: record.thumbnailUrl,
            bannerUrl: record.bannerUrl,
            startDate: record.startDate.toISOString(),
            endDate: record.endDate.toISOString(),
            submissionDeadline: record.submissionDeadline.toISOString(),
            votingStartDate: record.votingStartDate.toISOString(),
            votingEndDate: record.votingEndDate.toISOString(),
            status: record.status,
        };
    }

    static toProjectDTO(record: ProjectRecord): ProjectDTO {
        return {
            id: record.id,
            sprintId: record.sprintId,
            authorId: record.authorId,
            title: record.title,
            description: record.description,
            summary: record.summary,
            thumbnailUrl: record.thumbnailUrl,
            videoUrl: record.videoUrl,
            demoVideoUrl: record.demoVideoUrl,
            githubUrl: record.githubUrl,
            liveUrl: record.liveUrl,
            documentationUrl: record.documentationUrl,
            status: record.status,
            visibility: record.visibility,
            isWinner: record.isWinner,
            rank: record.rank,
            submittedAt: record.submittedAt?.toISOString(),
            createdAt: record.createdAt.toISOString(),
        };
    }
}
