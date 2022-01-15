import { database } from '@/models/database';
import { DataTypes } from 'sequelize';
import { Model } from 'sequelize';

class CouplesInternal extends Model {}

CouplesInternal.init({
    donator_id: {
        type: DataTypes.INTEGER,
    },
    recipient_id: {
        type: DataTypes.INTEGER,
    },
}, {
    sequelize: database,
    modelName: 'couples',
    createdAt: false,
    updatedAt: false,
});

export class Couples extends CouplesInternal {}
