const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/signup", (req, res) => userController.signup(req, res));
router.post("/login", (req, res) => userController.login(req, res));

router.use(authMiddleware);

router.get("/profile", (req, res) => userController.getProfile(req, res));
router.patch("/profile", (req, res) => userController.updateProfile(req, res));
router.get("/all", (req, res) => userController.getAllUsers(req, res));

router.get("/students", (req, res) => userController.getAllStudents(req, res));
router.get("/faculties", (req, res) => userController.getAllFaculty(req, res));

router.get("/students/:id", (req, res) => userController.getStudentById(req, res));
router.patch("/students/:id", (req, res) => userController.updateStudent(req, res));
router.delete("/students/:id", (req, res) => userController.deleteStudent(req, res));

router.get("/:id", (req, res) => userController.getUserById(req, res));

module.exports = router;