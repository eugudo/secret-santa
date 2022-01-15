import { database } from '@/models/database';
import { DataTypes } from 'sequelize';
import { Model } from 'sequelize';

class UsersInternal extends Model {}

UsersInternal.init({
    first_name: {
        type: DataTypes.STRING,
    },
    last_name: {
        type: DataTypes.STRING,
    },
}, {
    sequelize: database,
    modelName: 'users',
});

export class Users extends UsersInternal {}
