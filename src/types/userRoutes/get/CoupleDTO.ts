import { Gifts } from '@/types/userRoutes/Gifts';
import { User } from '@/types/userRoutes/User';

export interface CoupleDTO {
    readonly user: User;
    readonly gifts: Gifts;
}
