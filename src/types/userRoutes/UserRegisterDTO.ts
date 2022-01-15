import { Gifts } from '@/types/Gifts';
import { User } from '@/types/User';

export interface UserRegisterDTO {
    readonly user: User;
    readonly gifts: Gifts;
}
