import { ParamSchema } from 'express-validator';

export const varCharParamSchema: ParamSchema = {
    in: ['body'],
    exists: true,
    isString: true,
    isLength: {
        options: {
            min: 1, max: 255,
        },
    },
};
