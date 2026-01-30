import { IBaseRepository } from './IBaseRepository';

export interface IDuoRepository extends IBaseRepository<any> {
    getPassesByUserId(userId: string): any[];
    getTransactionsByUserId(userId: string): any[];
    getMatchStatusesByUserId(userId: string): any[];
    updatePass(id: string, data: any): void;
    createTransaction(data: any): void;
    updateMatchStatus(id: string, data: any): void;
    createMatchStatus(data: any): void;
}
