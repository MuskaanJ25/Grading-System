import express from "express";
import {
    getAllStudents,
    getAllProfs,
    getAllAdmins,
    getAllCourses,
    getUserById,
    getCourseById,
    createNewUser,
    createNewCourse,
    authenticateUser,
    removeUser,
    removeCourse,
    getGrade,
    getCourseRating,
    assignGrade,
    rateCourse,
    registerForCourse,
    unregisterCourse,
}  from "../controller/functions.js";

const router = express.Router();

router.get("/user/student", getAllStudents);

router.get("/user/professor", getAllProfs);

router.get("/user/admin", getAllAdmins);

router.get("/courses", getAllCourses);

router.get("/user/:user_id", getUserById);

router.get("/courses/:course_id", getCourseById);

router.put("/user", createNewUser);

router.put("/courses", createNewCourse);

router.post("/authenticate/user", authenticateUser);

router.delete("/courses/:course_id", removeCourse);

router.delete("/user/:user_id", removeUser);

router.get("/student/grade/:user_id", getGrade);

router.patch("/student/grade", assignGrade);

router.get("/courses/:course_id", getCourseRating);

router.patch("/student/rating", rateCourse);

router.put("/student/course", registerForCourse);

router.delete("/student/course", unregisterCourse);

export default router;