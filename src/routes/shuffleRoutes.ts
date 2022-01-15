import { CoupleDTO } from '@/types/userRoutes/CoupleDTO';
import express from 'express';
import { Request } from 'express';
import { Response } from 'express';
import { ServerDTO } from '@/types/ServerDTO';
import { ShuffleController } from '@/controllers/ShuffleController';

const router = express.Router();
const controller = new ShuffleController();

router.post('/', (req: Request, res: Response<ServerDTO<CoupleDTO>>) => controller.shuffle(req, res));

export const shuffleRoutes = router;
