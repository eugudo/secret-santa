import { ValidationError } from 'express-validator';

export type ServerDTO<T> = {
    data?: T;
    errors: ValidationError[]|ErrorDTO[];
};

export type ErrorDTO = {
    msg: string;
};

