
import { Sequelize } from 'sequelize';

export const database = new Sequelize({
    dialect: 'sqlite',
    host: './public/database.sqlite',
});
