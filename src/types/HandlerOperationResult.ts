import { ErrorDTO } from '@/types/ErrorDTO';
import { ValidationError } from 'express-validator';

export type HandlerOperationResult<T> = {
    data?: T;
    status: number;
    hasError: boolean;
    errors: ValidationError[]|ErrorDTO[];
};
