import { Sequelize } from "sequelize";

const db = new Sequelize('grading_sys', 'root', 'Tsunami123!', {
    host: "localhost",
    dialect: "mysql"
});

export default db;