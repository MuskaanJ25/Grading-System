import { Sequelize } from "sequelize";
import db from "./routes/connections.js";

const { DataTypes } = Sequelize;

export const Users = db.define(
    "users",
    {
        user_name: {
            type: DataTypes.STRING,
        },
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        pswd: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.STRING,
        }
    },
    {
        freezeTablename: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    },
);

export const Student_Acads = db.define(
    "student_acads",
    {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        course_id: {
            type: DataTypes.STRING,
        },
        grade: {
            type: DataTypes.STRING,
        },
        course_rating: {
            type: DataTypes.INTEGER,
        },
    },
    {
        freezeTablename: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    }
);

export const Courses = db.define(
    "courses",
    {
        course_id: {
            type: DataTypes.STRING,
            primaryKey:true
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        rating: {
            type: DataTypes.INTEGER,
        },
    },  
    {
        freezeTablename: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
    }
);