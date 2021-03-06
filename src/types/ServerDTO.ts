import { ErrorDTO } from '@/types/ErrorDTO';
import { ValidationError } from 'express-validator';

export type ServerDTO<T> = {
    data?: T;
    errors: ValidationError[]|ErrorDTO[];
};

