import { Gifts } from '@/types/userRoutes/Gifts';
import { User } from '@/types/userRoutes/User';

export interface UserRegisterDTO {
    readonly user: User;
    readonly gifts: Gifts;
}
