import { CoupleDTO } from '@/types/userRoutes/get/CoupleDTO';
import { Request } from 'express';
import { Response } from 'express';
import { ServerDTO } from '@/types/ServerDTO';
import { ShuffleHandler } from '@/Application/Command/ShuffleHandler';

export class ShuffleController {
    async shuffle(req: Request, res: Response<ServerDTO<CoupleDTO>>): Promise<void> {
        const handler = new ShuffleHandler();
        const response = await handler.getResponse();
        if (response.hasError) {
            res.status(response.status).send({ errors: response.errors });
            return;
        }
        res.status(response.status).send();
    }
}
