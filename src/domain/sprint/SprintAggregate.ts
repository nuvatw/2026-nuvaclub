export type NunuLevel = 'Nx' | 'N-5' | 'N-4' | 'N-3' | 'N-2' | 'N-1';

export interface SprintParticipantProps {
    userId: string;
    currentNunuLevel: NunuLevel | null;
    vavaLevel: number;
    totalMentored: number;
    missionStreak: number;
    coursesCompletedThisMonth: number;
    forumPostsThisMonth: number;
    forumCommentsThisMonth: number;
    activeMenteesCount: number;
}

export interface MissionRequirements {
    courses: number;
    posts: number;
    comments: number;
    mentees: number;
}

export class SprintAggregate {
    private constructor(private props: SprintParticipantProps) { }

    static create(userId: string): SprintAggregate {
        return new SprintAggregate({
            userId,
            currentNunuLevel: null,
            vavaLevel: 1,
            totalMentored: 0,
            missionStreak: 0,
            coursesCompletedThisMonth: 0,
            forumPostsThisMonth: 0,
            forumCommentsThisMonth: 0,
            activeMenteesCount: 0,
        });
    }

    static reconstitute(props: SprintParticipantProps): SprintAggregate {
        return new SprintAggregate(props);
    }

    checkEligibility(targetLevel: NunuLevel): boolean {
        // Logic moved from nunu-rules.ts (simplified for aggregate)
        const requirements = this.getApplicationRequirements(targetLevel);
        if (!requirements) return true; // Nx or similar

        const vavaMet = this.props.vavaLevel >= requirements.minVavaLevel;
        const mentoredMet = requirements.totalMentoredMin ? this.props.totalMentored >= requirements.totalMentoredMin : true;
        const streakMet = this.props.missionStreak >= 3;

        return vavaMet && mentoredMet && streakMet;
    }

    canUnlockNext(): boolean {
        const nextLevel = this.getNextLevel();
        if (!nextLevel) return false;
        return this.checkEligibility(nextLevel);
    }

    private getNextLevel(): NunuLevel | null {
        const levels: NunuLevel[] = ['Nx', 'N-5', 'N-4', 'N-3', 'N-2', 'N-1'];
        if (!this.props.currentNunuLevel) return 'Nx';
        const index = levels.indexOf(this.props.currentNunuLevel);
        if (index === -1 || index === levels.length - 1) return null;
        return levels[index + 1];
    }

    getMissionStatus(level: NunuLevel) {
        const requirements = this.getMissionRequirements(level);
        const missions = [
            {
                key: 'courses',
                label: 'Courses completed',
                target: requirements.courses,
                current: this.props.coursesCompletedThisMonth,
                completed: this.props.coursesCompletedThisMonth >= requirements.courses,
            },
            {
                key: 'forumPosts',
                label: 'Forum posts',
                target: requirements.posts,
                current: this.props.forumPostsThisMonth,
                completed: this.props.forumPostsThisMonth >= requirements.posts,
            },
            {
                key: 'forumComments',
                label: 'Forum comments',
                target: requirements.comments,
                current: this.props.forumCommentsThisMonth,
                completed: this.props.forumCommentsThisMonth >= requirements.comments,
            },
            {
                key: 'mentoredMin',
                label: 'Active mentees (minimum)',
                target: requirements.mentees,
                current: this.props.activeMenteesCount,
                completed: this.props.activeMenteesCount >= requirements.mentees,
            },
        ];

        return {
            missions,
            allCompleted: missions.every(m => m.completed)
        };
    }

    private getMissionRequirements(level: NunuLevel): MissionRequirements {
        const missions: Record<NunuLevel, MissionRequirements> = {
            'Nx': { courses: 1, posts: 1, comments: 3, mentees: 1 },
            'N-5': { courses: 1, posts: 2, comments: 5, mentees: 2 },
            'N-4': { courses: 2, posts: 3, comments: 8, mentees: 3 },
            'N-3': { courses: 2, posts: 4, comments: 12, mentees: 4 },
            'N-2': { courses: 3, posts: 5, comments: 15, mentees: 5 },
            'N-1': { courses: 3, posts: 6, comments: 20, mentees: 6 },
        };
        return missions[level];
    }

    getApplicationRequirements(targetLevel: NunuLevel) {
        const requirements: Record<string, { minVavaLevel: number; totalMentoredMin?: number }> = {
            'N-5': { minVavaLevel: 4 },
            'N-4': { minVavaLevel: 6, totalMentoredMin: 10 },
            'N-3': { minVavaLevel: 8, totalMentoredMin: 30 },
            'N-2': { minVavaLevel: 10, totalMentoredMin: 50 },
            'N-1': { minVavaLevel: 12, totalMentoredMin: 100 },
        };
        const req = requirements[targetLevel] || null;
        if (!req) return null;

        return {
            ...req,
            checks: [
                { key: 'vavaLevel', label: 'Vava Level', required: req.minVavaLevel, current: this.props.vavaLevel, met: this.props.vavaLevel >= req.minVavaLevel },
                { key: 'totalMentored', label: 'Total Mentored', required: req.totalMentoredMin || 0, current: this.props.totalMentored, met: req.totalMentoredMin ? this.props.totalMentored >= req.totalMentoredMin : true },
                { key: 'missionStreak', label: 'Mission Streak', required: 3, current: this.props.missionStreak, met: this.props.missionStreak >= 3 }
            ]
        };
    }

    // Invariant: Mission streak resets if missions not completed.
    // This would be called at end of month or after a mission check.
    updateMissionProgress(completed: boolean): void {
        if (completed) {
            this.props.missionStreak += 1;
        } else {
            this.props.missionStreak = 0;
        }
    }

    toJSON() {
        return { ...this.props };
    }
}
