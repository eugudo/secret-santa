import { database } from '@/models/database';
import { DataTypes } from 'sequelize';
import { Model } from 'sequelize';

class GiftsInternal extends Model {}

GiftsInternal.init({
    user_id: {
        type: DataTypes.INTEGER,
    },
    gifts: {
        type: DataTypes.TEXT,
    },
}, {
    sequelize: database,
    modelName: 'gifts',
});

export class Gifts extends GiftsInternal {}
