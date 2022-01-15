import { Couples } from '@/models/Couples';
import { ErrorDTO } from '@/types/ErrorDTO';
import { HandlerOperationResult } from '@/types/HandlerOperationResult';
import { Users } from '@/models/Users';

interface AllUsersFromDB {
    rows: Users[];
    count: number;
}

export class ShuffleHandler {
    private async getMinUsersCheckResult(): Promise<HandlerOperationResult<AllUsersFromDB>> {
        const totalUsers = await Users.findAndCountAll();
        const minUsersInDb = 3;
        if (totalUsers.count < minUsersInDb) {
            const err: ErrorDTO = {
                msg: 'Not enough participants to create couples.',
            };
            return {
                status: 403,
                hasError: true,
                errors: [err],
            };
        }
        return {
            status: 200,
            hasError: false,
            errors: [],
            data: totalUsers,
        };
    }

    private async getCouplesCheckResult(): Promise<HandlerOperationResult<void>|void> {
        const couples = await Couples.findAndCountAll();
        if (couples.count) {
            const err: ErrorDTO = {
                msg: 'Sorry, couples already created.',
            };
            return {
                status: 403,
                hasError: true,
                errors: [err],
            };
        }
    }

    private async createCouples(users: AllUsersFromDB): Promise<HandlerOperationResult<void>> {
        const arr = users.rows;
        const promises = arr.map((donator, i, arr) => {
            let recipient = arr[i + 1];
            if (typeof recipient === 'undefined') {
                recipient = arr[0];
            }
            return new Promise<{success: boolean; error?: Error}>((resolve) => {
                Couples.create({
                    donator_id: donator.get('id'),
                    recipient_id: recipient.get('id'),
                }).then(() => {
                    resolve({ success: true });
                }).catch((e) => {
                    resolve({
                        success: false, error: e,
                    });
                });
            });
        });
        const operationFailure = await Promise.all<{success: boolean; error?: Error}>(promises).then((values) => {
            const error = values.find((v) => !v.success);
            return error ?? { success: true };
        });

        if (!operationFailure.success && operationFailure.error) {
            const err: ErrorDTO = {
                msg: `Internal server error. ${operationFailure.error.name} ${operationFailure.error.message} ${operationFailure.error.stack}`,
            };
            return {
                status: 500,
                hasError: true,
                errors: [err],
            };
        }
        return {
            status: 204,
            hasError: false,
            errors: [],
        };
    }

    async getResponse(): Promise<HandlerOperationResult<void>> {
        const couplesAlreadyCreatedCheck = await this.getCouplesCheckResult();
        if (couplesAlreadyCreatedCheck?.hasError) {
            return couplesAlreadyCreatedCheck;
        }

        const minUsersCheck = await this.getMinUsersCheckResult();
        if (minUsersCheck?.hasError || !minUsersCheck?.data) {
            return {
                status: minUsersCheck.status,
                errors: minUsersCheck.errors,
                hasError: minUsersCheck.hasError,
            };
        }

        return this.createCouples(minUsersCheck.data);
    }
}

