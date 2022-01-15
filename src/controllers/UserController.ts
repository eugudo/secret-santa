import { CoupleDTO } from '@/types/userRoutes/get/CoupleDTO';
import { CreateEntityResponse } from '@/types/userRoutes/post/CreateEntityResponse';
import { GetCoupleQueryParams } from '@/types/userRoutes/get/GetCoupleQueryParams';
import { GetUserCoupleHandler } from '@/Application/Command/GetUserCoupleHandler';
import { RegisterUserHandler } from '@/Application/Command/RegisterUserHandler';
import { Request } from 'express';
import { Response } from 'express';
import { ServerDTO } from '@/types/ServerDTO';
import { UserRegisterDTO } from '@/types/userRoutes/post/UserRegisterDTO';

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

    async getCouple(req: Request<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, GetCoupleQueryParams>, res: Response<ServerDTO<CoupleDTO>>): Promise<void> {
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
