import { ServerDTO } from '@/types/ServerDTO';

export const getSuccessResponseTemplate = <T>(v: T): ServerDTO<T> => {
    return {
        data: v,
        errors: [],
    };
};
