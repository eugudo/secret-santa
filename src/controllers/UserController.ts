import { CoupleDTO } from '@/types/userRoutes/CoupleDTO';
import { Couples } from '@/models/Couples';
import { CreateEntityResponse } from '@/types/CreateEntityResponse';
import { ErrorDTO } from '@/types/ServerDTO';
import { GetCoupleRequest } from '@/types/userRoutes/GetCoupleRequest';
import { getSuccessResponseTemplate } from '@/helpers/getSuccessResponseTemplate';
import { Gifts } from '@/models/Gifts';
import { Request } from 'express';
import { Response } from 'express';
import { ServerDTO } from '@/types/ServerDTO';
import { UserRegisterDTO } from '@/types/userRoutes/UserRegisterDTO';
import { Users } from '@/models/Users';
import { validationResult } from 'express-validator';

export class UserController {
    async register(req: Request<Record<string, unknown>, Record<string, unknown>, UserRegisterDTO>, res: Response<ServerDTO<CreateEntityResponse>>): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() }).send();
            return;
        }
        const totalUsers = await Users.findAndCountAll();
        const maxUsersInDb = 500;
        if (totalUsers.count >= maxUsersInDb) {
            const err: ErrorDTO = {
                msg: 'Maximum number of users created.',
            };
            res.status(403).send({ errors: [err] });
            return;
        }

        const couples = await Couples.findAndCountAll();
        if (couples.count) {
            const err: ErrorDTO = {
                msg: 'Sorry, couples already created.',
            };
            res.status(403).send({ errors: [err] });
            return;
        }

        const userId: number = await new Promise((resolve, reject) => {
            Users.create(req.body.user).then((value) => {
                resolve(value.getDataValue('id'));
            }).catch((e) => {
                reject(e);
            });
        });

        await new Promise((resolve, reject) => {
            Gifts.create({
                user_id: userId, gifts: JSON.stringify(req.body.gifts),
            }).then((value) => {
                resolve(value.getDataValue('id'));
            }).catch((e) => {
                reject(e);
            });
        });

        const response = getSuccessResponseTemplate<CreateEntityResponse>({ id: userId });
        res.send(response);
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
