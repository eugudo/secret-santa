import { Gifts } from '@/types/Gifts';
import { User } from '@/types/User';

export interface CoupleDTO {
    readonly user: User;
    readonly gifts: Gifts;
}
