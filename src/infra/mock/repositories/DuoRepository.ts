import { IDuoRepository } from '@/application/ports/IDuoRepository';
import { BaseRepository } from './BaseRepository';
import { MockDB } from '../core/MockDB';
import type { DuoMonthPassRecord, DuoTransactionRecord, MonthlyMatchStatusRecord } from '../schema/user.schema';

export class DuoRepository extends BaseRepository<DuoMonthPassRecord> implements IDuoRepository {
    constructor(db: MockDB) {
        super(db.duoMonthPasses, db);
    }

    getPassesByUserId(userId: string): DuoMonthPassRecord[] {
        return this.db.duoMonthPasses.findMany({ where: { userId } });
    }

    getTransactionsByUserId(userId: string): DuoTransactionRecord[] {
        return this.db.duoTransactions.findMany({ where: { userId } });
    }

    getMatchStatusesByUserId(userId: string): MonthlyMatchStatusRecord[] {
        return this.db.monthlyMatchStatus.findMany({ where: { userId } });
    }

    updatePass(id: string, data: Partial<DuoMonthPassRecord>): void {
        this.db.duoMonthPasses.update(id, data as any);
    }

    createTransaction(data: any): void {
        this.db.duoTransactions.create(data);
    }

    updateMatchStatus(id: string, data: Partial<MonthlyMatchStatusRecord>): void {
        this.db.monthlyMatchStatus.update(id, data as any);
    }

    createMatchStatus(data: any): void {
        this.db.monthlyMatchStatus.create(data);
    }
}
