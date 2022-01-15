import { check } from 'express-validator';
import { CreateEntityResponse } from '@/types/CreateEntityResponse';
import express from 'express';
import { GetCoupleRequest } from '@/types/userRoutes/GetCoupleRequest';
import { query } from 'express-validator';
import { Request } from 'express';
import { Response } from 'express';
import { ServerDTO } from '@/types/ServerDTO';
import { UserController } from '@/controllers/UserController';
import { UserRegisterDTO } from '@/types/userRoutes/UserRegisterDTO';
import { validateArrayOfStrings } from '@/helpers/validation/validateArrayOfStrings';

const router = express.Router();
const controller = new UserController();

router.get('/',
    query('id')
        .exists()
        .isNumeric()
        .toInt(),
    (req: Request<Record<string, unknown>, Record<string, unknown>, Record<string, unknown>, GetCoupleRequest>, res) => controller.getCouple(req, res));

router.post('/register',
    check('user')
        .exists()
        .isObject(),
    check('user.first_name')
        .exists()
        .isString()
        .isLength({
            min: 1, max: 255,
        })
        .withMessage('Must be at least 1 chars long and max 255 chars long'),
    check('user.last_name')
        .exists()
        .isString()
        .isLength({
            min: 1, max: 255,
        })
        .withMessage('Must be at least 1 chars long and max 255 chars long'),
    check('gifts')
        .exists()
        .isArray({
            min: 1, max: 10,
        })
        .withMessage('Gifts must be an array with min 1 and max 10 items')
        .custom((gifts: string[]) => {
            return validateArrayOfStrings(gifts);
        }),
    (
        req: Request<Record<string, unknown>, Record<string, unknown>, UserRegisterDTO>, res: Response<ServerDTO<CreateEntityResponse>>
    ) => controller.register(req, res));

export const userRoutes = router;
