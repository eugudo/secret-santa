import { CoupleDTO } from '@/types/userRoutes/CoupleDTO';
import { Couples } from '@/models/Couples';
import { CreateEntityResponse } from '@/types/CreateEntityResponse';
import { ErrorDTO } from '@/types/ErrorDTO';
import { GetCoupleRequest } from '@/types/userRoutes/GetCoupleRequest';
import { getSuccessResponseTemplate } from '@/helpers/getSuccessResponseTemplate';
import { Gifts } from '@/models/Gifts';
import { RegisterUserHandler } from '@/Application/Command/RegisterUserHandler';
import { Request } from 'express';
import { Response } from 'express';
import { ServerDTO } from '@/types/ServerDTO';
import { UserRegisterDTO } from '@/types/userRoutes/UserRegisterDTO';
import { Users } from '@/models/Users';
import { validationResult } from 'express-validator';

export class UserController {
    async register(req: Request<Record<string, unknown>, Record<string, unknown>, UserRegisterDTO>, res: Response<ServerDTO<CreateEntityResponse>>): Promise<void> {
        const handler = new RegisterUserHandler(req);
        const response = await handler.getResponse();
        if (response.data && !response.hasError) {
            res.status(response.status).send({
                data: response.data, errors: response.errors,
            });
            return;
        }
        res.status(response.status).send({ errors: response.errors });
    }

    async getCouple(req: Request<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, GetCoupleRequest>, res: Response<ServerDTO<CoupleDTO>>): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() }).send();
            return;
        }
        const couple = await Couples.findOne({
            where: { donator_id: req.query.id }, limit: 1,
        });

        if (couple === null) {
            const err: ErrorDTO = {
                msg: 'Your couple not found or couples was not created yet.',
            };
            res.status(404).send({ errors: [err] });
            return;
        }

        const recipient_id = couple.getDataValue('recipient_id');
        const user = await Users.findOne({ where: { id: recipient_id } });

        if (user === null) {
            const err: ErrorDTO = {
                msg: 'Your couple not found.',
            };
            res.status(404).send({ errors: [err] });
            return;
        }
        const gifts = await Gifts.findOne({ where: { user_id: recipient_id } });
        if (gifts === null) {
            const err: ErrorDTO = {
                msg: 'Gifts not found.',
            };
            res.status(404).send({ errors: [err] });
            return;
        }
        const coupleDTO: CoupleDTO = {
            user: {
                first_name: user.getDataValue('first_name'),
                last_name: user.getDataValue('last_name'),
            },
            gifts: JSON.parse(gifts.getDataValue('gifts')),
        };
        const response = getSuccessResponseTemplate(coupleDTO);
        res.send(response);
    }
}
