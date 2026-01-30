export interface ISpaceRepository {
    getNunuProfileByUserId(userId: string): any;
    getNunuStats(profileId: string): any;
    getUserCourseEnrollmentCount(userId: string, month: number): number;
    // Add more as needed by SprintService
}
