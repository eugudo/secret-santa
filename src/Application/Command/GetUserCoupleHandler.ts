import { CoupleDTO } from '@/types/userRoutes/CoupleDTO';
import { Couples } from '@/models/Couples';
import { ErrorDTO } from '@/types/ErrorDTO';
import { GetCoupleRequest } from '@/types/userRoutes/GetCoupleRequest';
import { Gifts } from '@/models/Gifts';
import { HandlerOperationResult } from '@/types/HandlerOperationResult';
import { Request } from 'express';
import { Users } from '@/models/Users';
import { validationResult } from 'express-validator';

export class GetUserCoupleHandler {
    private request: Request<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, GetCoupleRequest>;

    constructor(req: Request<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, GetCoupleRequest>) {
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

    private async getCouple(): Promise<HandlerOperationResult<Couples>> {
        const couple = await Couples.findOne({
            where: { donator_id: this.request.query.id }, limit: 1,
        });
        if (couple === null) {
            const err: ErrorDTO = {
                msg: 'Your couple not found or couples was not created yet.',
            };
            return {
                status: 404,
                hasError: true,
                errors: [err],
            };
        }
        return {
            status: 200,
            hasError: false,
            errors: [],
            data: couple,
        };
    }

    private async getUser(id: number): Promise<HandlerOperationResult<Users>> {
        const user = await Users.findOne({ where: { id } });
        if (user === null) {
            const err: ErrorDTO = {
                msg: 'Your couple not found.',
            };
            return {
                status: 404,
                hasError: true,
                errors: [err],
            };
        }
        return {
            status: 200,
            hasError: false,
            errors: [],
            data: user,
        };
    }

    private async getGifts(id: number): Promise<HandlerOperationResult<Gifts>> {
        const gifts = await Gifts.findOne({ where: { user_id: id } });
        if (gifts === null) {
            const err: ErrorDTO = {
                msg: 'Gifts not found.',
            };
            return {
                status: 404,
                hasError: true,
                errors: [err],
            };
        }
        return {
            status: 200,
            hasError: false,
            errors: [],
            data: gifts,
        };
    }

    async getResponse(): Promise<HandlerOperationResult<CoupleDTO|void>> {
        if (this.routeValidationErrors?.hasError) {
            return this.routeValidationErrors;
        }

        const getCoupleResult = await this.getCouple();
        if (getCoupleResult?.hasError || !getCoupleResult?.data) {
            return {
                status: getCoupleResult.status,
                errors: getCoupleResult.errors,
                hasError: getCoupleResult.hasError,
            };
        }
        const recipientId: number = getCoupleResult.data.getDataValue('recipient_id');
        const getUserResult = await this.getUser(recipientId);

        if (getUserResult?.hasError || !getUserResult?.data) {
            return {
                status: getUserResult.status,
                errors: getUserResult.errors,
                hasError: getUserResult.hasError,
            };
        }
        const getGiftsResult = await this.getGifts(recipientId);
        if (getGiftsResult?.hasError || !getGiftsResult?.data) {
            return {
                status: getGiftsResult.status,
                errors: getGiftsResult.errors,
                hasError: getGiftsResult.hasError,
            };
        }
        const coupleDTO: CoupleDTO = {
            user: {
                first_name: getUserResult.data.getDataValue('first_name'),
                last_name: getUserResult.data.getDataValue('last_name'),
            },
            gifts: JSON.parse(getGiftsResult.data.getDataValue('gifts')),
        };
        return {
            hasError: false,
            status: 200,
            errors: [],
            data: coupleDTO,
        };
    }
}
