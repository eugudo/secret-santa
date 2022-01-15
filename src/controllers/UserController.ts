import { CoupleDTO } from '@/types/userRoutes/CoupleDTO';
import { CreateEntityResponse } from '@/types/CreateEntityResponse';
import { GetCoupleRequest } from '@/types/userRoutes/GetCoupleRequest';
import { GetUserCoupleHandler } from '@/Application/Command/GetUserCoupleHandler';
import { RegisterUserHandler } from '@/Application/Command/RegisterUserHandler';
import { Request } from 'express';
import { Response } from 'express';
import { ServerDTO } from '@/types/ServerDTO';
import { UserRegisterDTO } from '@/types/userRoutes/UserRegisterDTO';

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
        const handler = new GetUserCoupleHandler(req);
        const response = await handler.getResponse();
        if (response.data && !response.hasError) {
            res.status(response.status).send({
                data: response.data, errors: response.errors,
            });
            return;
        }
        res.status(response.status).send({ errors: response.errors });
    }
}
