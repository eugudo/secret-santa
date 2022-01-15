import { Couples } from '@/models/Couples';
import { CreateEntityResponse } from '@/types/userRoutes/post/CreateEntityResponse';
import { ErrorDTO } from '@/types/ErrorDTO';
import { Gifts } from '@/models/Gifts';
import { HandlerOperationResult } from '@/types/HandlerOperationResult';
import { Request } from 'express';
import { UserRegisterDTO } from '@/types/userRoutes/post/UserRegisterDTO';
import { Users } from '@/models/Users';
import { validationResult } from 'express-validator';

export class RegisterUserHandler {
    private request: Request<Record<string, unknown>, Record<string, unknown>, UserRegisterDTO>;

    constructor(req: Request<Record<string, unknown>, Record<string, unknown>, UserRegisterDTO>) {
        this.request = req;
    }

    private get routeValidationErrors(): HandlerOperationResult<void>|void {
        const errors = validationResult(this.request);
        if (!errors.isEmpty()) {
            return {
                status: 400,
                hasError: true,
                errors: errors.array(),
            };
        }
    }

    private async getMaxUsersCheckResult(): Promise<HandlerOperationResult<void>|void> {
        const totalUsers = await Users.findAndCountAll();
        const maxUsersInDb = 500;
        if (totalUsers.count >= maxUsersInDb) {
            const err: ErrorDTO = {
                msg: 'Maximum number of users created.',
            };
            return {
                status: 403,
                hasError: true,
                errors: [err],
            };
        }
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

    private createUser(): Promise<number> {
        return new Promise((resolve, reject) => {
            Users.create(this.request.body.user).then((value) => {
                resolve(value.getDataValue('id'));
            }).catch((e) => {
                console.error(e);
                reject(e);
            });
        });
    }

    private createGifts(userId: number): Promise<void> {
        return new Promise((resolve, reject) => {
            Gifts.create({
                user_id: userId, gifts: JSON.stringify(this.request.body.gifts),
            }).then(() => {
                resolve();
            }).catch((e) => {
                reject(e);
            });
        });
    }

    async getResponse(): Promise<HandlerOperationResult<CreateEntityResponse|void>> {
        if (this.routeValidationErrors?.hasError) {
            return this.routeValidationErrors;
        }

        const maxUserCheck = await this.getMaxUsersCheckResult();
        if (maxUserCheck?.hasError) {
            return maxUserCheck;
        }

        const couplesAlreadyCreatedCheck = await this.getCouplesCheckResult();
        if (couplesAlreadyCreatedCheck?.hasError) {
            return couplesAlreadyCreatedCheck;
        }

        const userId = await this.createUser();
        await this.createGifts(userId);

        return {
            hasError: false,
            status: 200,
            errors: [],
            data: { id: userId },
        };
    }
}
