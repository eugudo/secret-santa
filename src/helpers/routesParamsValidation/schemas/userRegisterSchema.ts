import { Schema } from 'express-validator';
import { validateArrayOfStrings } from '@/helpers/routesParamsValidation/validateArrayOfStrings';
import { varCharParamSchema } from '@/helpers/routesParamsValidation/paramSchemas/varCharParamSchema';

export const registerSchema: Schema = {
    user: {
        in: ['body'],
        exists: true,
        isObject: true,
    },
    'user.first_name': varCharParamSchema,
    'user.last_name': varCharParamSchema,
    gifts: {
        exists: true,
        isArray: {
            options: {
                min: 1, max: 10,
            },
        },
        custom: {
            options: (value) => validateArrayOfStrings(value),
        },
    },
};
