import { Sequelize, where } from "sequelize";
import jwt from "jsonwebtoken";
import {} from 'dotenv/config'
import jwt_decode from 'jwt-decode';

import {
    Users,
    Student_Acads,
    Courses,
} from "../classes.js";

const decode = (token) => {
    var decoded = jwt_decode(token);
    return decoded;
}

const getUserId = async (req) => {
    const token = req.headers["authorization"];
    const user_id = await decode(token).user_id;
    return user_id;
}

const isAdmin = async (req) => {
    const token = req.headers["authorization"];
    const user_id = await decode(token).user_id;
    console.log(user_id);

    const user = await Users.findAll({
        where: {
            user_id: user_id,
        }
    });
    if(user.role == "Admin"){
        return true;
    }
    return false;
};

const isStudent = async (req) => {
    const token = req.headers["authorization"];
    const user_id = await decode(token).user_id;
    console.log(user_id);

    const user = await Users.findAll({
        where: {
            user_id: user_id,
        }
    });
    if(user.role == "Student"){
        return true;
    }
    return false;
};

const isProfessor = async (req) => {
    const token = req.headers["authorization"];
    const user_id = await decode(token).user_id;
    console.log(user_id);

    const user = await Users.findAll({
        where: {
            user_id: user_id,
        }
    });
    if(user.role == "Professor"){
        return true;
    }
    return false;
};

export const getAllStudents = async (req, res) => {
    try {
        if(isAdmin(req)) {
            const students = await Users.findAll({
            where: {
                role: 'Student',
            }
            });
                res.status(200).json(students);
                console.log("calling GET api");
        }
        else {
            res.status(200).json("Unauthorized Access!!");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllProfs = async (req, res) => {
    try {
        if(isAdmin(req)) {
            const profs = await Users.findAll({
            where: {
                role: 'Professor',
            }
            });
            res.status(200).json(profs);
        }
        else {
            res.status(200).json("Unauthorized Access!!");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllAdmins = async (req, res) => {
    try {
        if(isAdmin(req)){
            const admins = await Users.findAll({
            where: {
                role: 'Admin',
            }
            });
            res.status(200).json(admins);
        }
        else {
            res.status(200).json("Unauthorized Access!!");
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllCourses = async (req, res) => {
    try {
        const courses = await Courses.findAll();
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req, res) => {
    console.log(JSON.stringify(req.params));
    try {
        if(isAdmin(req)){
            const user = await Users.findAll({
            where: {
                user_id: req.params.user_id,
            },
            });
            res.status(200).json(user[0]);
        }
        else {
            res.status(200).json("Unauthorized Access!!");
        }
    }   catch (error) {
        res.json({ message: error.message });
    }
};

export const getCourseById = async (req, res) => {
    console.log(JSON.stringify(req.params));
    try {
        const courses = await Courses.findAll({
        where: {
            course_id: req.params.course_id,
        },
        });
        res.status(200).json(courses[0]);
    }   catch (error) {
        res.json({ message: error.message });
    }
};

export const createNewUser = async (req, res) => {
    try {
        if(isAdmin(req)){
            await Users.create({
                role: req.body.role,
                user_name: req.body.user_name,
                pswd: req.body.pswd,
                user_id: null
            });
            res.status(200).json({ message: "User Created" });
        }
        else {
            res.status(200).json("Unauthorized Access!!");
        }
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const createNewCourse = async (req, res) => {
    try {
        if(isAdmin(req)){
            await Courses.create(req.body);
            res.status(200).json({
                message: "Course Added",
            });
        }
        else {
            res.status(200).json("Unauthorized Access!!");
        }
    } catch (error) {
        res.json({ message: error.message });
    }
};

export const authenticateUser = async (req, res) => {
  try {
    const pswd = await Users.findAll({
      where: {
        user_id: req.body.user_id,
      },
    });
    
    if (pswd[0].pswd === req.body.pswd) {
        const user = { used_id: pswd[0].user_id };
        const accessToken = jwt.sign(user, process.env.ACCESS_SECRET);
        res.status(200).json({ accessToken: accessToken});
    } else {
      res.status(200).json("wrong password!");
    }
  } catch (error) {
    res.json({ message: error.message });
  }
};

const auth_token = (req, res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null){
        res.status(401).json({
            message: "No token!!"
        });
    }
    jwt.verify(token, process.env.ACCESS_SECRET, (err, user) => {
        if(err) {
            return res.status(403).json({
                message: "invalid token!!"
            });
        }
        req.user = user;
        next();
    });
};

export default auth_token;

export const removeUser = async (req, res) => {
    try {
        if(isAdmin(req)){
            const user = await Users.findAll({
                where: {
                    user_id: req.params.user_id,
            }
            })
            user[0].destroy();
            if(user[0].role == 'Student') {
                Student_Acads.destroy({
                    where: {
                        user_id: req.params.user_id,
                    }
                });
            }
            res.status(200).json({
                    message: "User Removed!",
                });
        }
        else {
            res.status(200).json("Unauthorized Access!!");
        }
    }  catch (error) {
    res.json({ message: error.message });
  }
};

export const removeCourse = async (req, res) => {
    try {
        if(isAdmin(req)){
            Courses.destroy({
                where: {
                    course_id: req.params.course_id,
            },
            })
            res.status(200).json({
                    message: "Course Removed",
                });
        }
        else {
            res.status(200).json("Unauthorized Access!!");
        }
    }  catch (error) {
    res.json({ message: error.message  });
  }
};

export const getGrade = async (req, res) => {
    try {
        if(isAdmin(req) || isProfessor(req) || getUserId(req) == req.params.user_id) {
            const student = await Student_Acads.findAll({
                where: {
                    user_id: req.params.user_id,
                },
            });
            res.status(200).json(student);
        }
        else {
            res.status(200).json("Unauthorized Access!!");
        }
    } catch (error) {
    res.json({ message: error.message  });
  }
};

export const getCourseRating = async (req, res) => {
    try {
        const course = await Courses.findAll({
            where: {
              course_id: req.params.course_id,
            }
        });
        res.status(200).json(course[0]);
    }   catch (error) {
    res.json({ message: error.message  });
  }
};

export const assignGrade = async (req, res) => {
    try {
        if(isProfessor(req)) {
            console.log(JSON.stringify(req.body));
            await Student_Acads.update({
                    grade: req.body.grade,
            },
            {
                where: {
                    user_id: req.body.user_id,
                    course_id: req.body.course_id,
                },
            });

            res.status(200).json({
                message: "Course Graded!",
            });
        }
        else {
            res.status(200).json("Unauthorized Access!!");
        }
    }  catch (error) {
        res.json({ message: error.message  });
    }
};

export const rateCourse = async (req, res) => {
    try {
        if(isStudent(req)) {
            console.log(JSON.stringify(req.body));
            await Student_Acads.update({
                course_rating: req.body.course_rating,
            },
            {
                where: {
                    course_id: req.body.course_id,
                    user_id: req.body.user_id,
                },
            });
            res.status(200).json({
                message: "Course Rated!",
            });
        }
        else {
            res.status(200).json("Unauthorized Access!!");
        }
    }  catch (error) {
    res.json({ message: error.message  });
  }
};

export const registerForCourse = async (req, res) => {
    try {
        if(isStudent(req)){
            const course = await Student_Acads.findAll({
                where: {
                    user_id: req.body.user_id,
                    course_id: req.body.course_id,
                },
            });
            if(!course.length){
                await Student_Acads.create(req.body);
                res.status(200).json({
                message: "Course Registered",
                });
            }
            else {
                res.status(200).json({
                message: "Course Already Registered",
                });
            }
        }
        else {
            res.status(200).json("Unauthorized Access!!");
        }
    }   catch (error) {
    res.json({ message: error.message  });
  }
};

export const unregisterCourse = async (req, res) => {
    try {
        if(isStudent(req) || isAdmin(req)) {
            const course = await Student_Acads.findAll({
                where: {
                    user_id: req.body.user_id,
                    course_id: req.body.course_id,
                },
            });
            console.log(course[0].grade);
            console.log(course[0]);
            if(course.length == 0){
                res.status(200).json({
                    message: "Course not registered!"
                });
            }
            else if(course[0].grade == null){
                Student_Acads.destroy({
                    where: {
                        course_id: req.body.course_id,
                        user_id: req.body.user_id,
                    },
                    })
                res.status(200).json({
                    message: "Course Unregistered!"
                });
            }
            else {
                res.status(200).json({
                    message: "Course Already Graded, Cannot Unregister!",
                });
            }   
        }
        else {
            res.status(200).json("Unauthorized Access!!");
        }
    }  catch (error) {
        res.json({ message: error.message  });
    }
};

