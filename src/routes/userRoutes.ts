import { checkSchema } from 'express-validator';
import { CoupleDTO } from '@/types/userRoutes/get/CoupleDTO';
import { CreateEntityResponse } from '@/types/userRoutes/post/CreateEntityResponse';
import express from 'express';
import { GetCoupleQueryParams } from '@/types/userRoutes/get/GetCoupleQueryParams';
import { registerSchema } from '@/Application/Request/schemas/userRegisterSchema';
import { Request } from 'express';
import { Response } from 'express';
import { ServerDTO } from '@/types/ServerDTO';
import { UserController } from '@/controllers/UserController';
import { userCoupleSchema } from '@/Application/Request/schemas/userCoupleSchema';
import { UserRegisterDTO } from '@/types/userRoutes/post/UserRegisterDTO';

const router = express.Router();
const controller = new UserController();

router.get('/',
    checkSchema(userCoupleSchema),
    (
        req: Request<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, GetCoupleQueryParams>,
        res: Response<ServerDTO<CoupleDTO>>
    ) => controller.getCouple(req, res));

router.post('/register',
    checkSchema(registerSchema),
    (
        req: Request<Record<string, unknown>, Record<string, unknown>, UserRegisterDTO>,
        res: Response<ServerDTO<CreateEntityResponse>>
    ) => controller.register(req, res));

export const userRoutes = router;
