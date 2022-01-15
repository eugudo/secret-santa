import { Schema } from 'express-validator';

export const userCoupleSchema: Schema = {
    id: {
        in: ['query'],
        isNumeric: true,
        toInt: true,
    },
};
