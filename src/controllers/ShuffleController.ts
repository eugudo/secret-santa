import { CoupleDTO } from '@/types/userRoutes/CoupleDTO';
import { Couples } from '@/models/Couples';
import { ErrorDTO } from '@/types/ServerDTO';
import { Request } from 'express';
import { Response } from 'express';
import { ServerDTO } from '@/types/ServerDTO';
import { Users } from '@/models/Users';

export class ShuffleController {
    async shuffle(req: Request, res: Response<ServerDTO<CoupleDTO>>): Promise<void> {
        const couples = await Couples.findAndCountAll();
        if (couples.count) {
            const err: ErrorDTO = {
                msg: 'Sorry, couples already created.',
            };
            res.status(403).send({ errors: [err] });
            return;
        }
        const users = await Users.findAndCountAll();

        if (users.count < 3) {
            const err: ErrorDTO = {
                msg: 'Not enough participants to create pairs.',
            };
            res.status(403).send({ errors: [err] });
            return;
        }
        const arr = users.rows;
        for (let i = 0; i < arr.length; i++) {
            const donator = arr[i];
            let recipient = arr[i + 1];
            if (typeof recipient === 'undefined') {
                recipient = arr[0];
            }
            Couples.create({
                donator_id: donator.get('id'),
                recipient_id: recipient.get('id'),
            });
        }
        res.status(204).send();
    }
}
