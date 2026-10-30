const userServices = require("../services/user.services");

class UserController {
  // 1. Signup: credentials + role (student or faculty)
  async signup(req, res) {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: "All fields are required (name, email, password, role)" });
      }
      if (!["student", "faculty"].includes(role)) {
        return res.status(400).json({ message: "Role must be 'student' or 'faculty'" });
      }

      const result = await userServices.signup({ name, email, password, role });
      res.status(201).json({ message: "Signup successful", ...result });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const result = await userServices.login(email, password);
      res.status(200).json({ message: "Login successful", ...result });
    } catch (error) {
      const status = error.message.includes("deleted") ? 403 : 401;
      res.status(status).json({ message: error.message });
    }
  }

  // 3. View own profile after login
  async getProfile(req, res) {
    try {
      const user = await userServices.getProfile(req.user.id);
      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update own profile (any logged-in user, both roles)
  async updateProfile(req, res) {
    try {
      const updated = await userServices.updateSelf(req.user.id, req.body);
      if (!updated) return res.status(404).json({ message: "User not found" });
      res.status(200).json({ message: "Profile updated", user: updated });
    } catch (error) {
      const status = error.code === 11000 ? 400 : 500;
      const message = error.code === 11000 ? "Email already in use" : error.message;
      res.status(status).json({ message });
    }
  }

  async getAllStudents(req, res) {
    try {
      if (req.user.role !== "faculty") {
        return res.status(403).json({ message: "Access denied: Only faculty can view all students" });
      }
      const students = await userServices.getAllStudents();
      res.status(200).json({ students });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllFaculty(req, res) {
    try {
      if (req.user.role !== "faculty") {
        return res.status(403).json({ message: "Access denied: Students cannot view faculty data" });
      }
      const faculties = await userServices.getAllFaculty();
      res.status(200).json({ faculties });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getAllUsers(req, res) {
    if(req.user.role !== "faculty") {
      return res.status(403).json({ message: "Access denied: Only faculty can view all users" });
    }
    try {
      const users = await userServices.getAllUsers();
      res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getStudentById(req, res) {
    try {
      const { id } = req.params;
      if (req.user.role === "student" && req.user.id !== id) {
        return res.status(403).json({ message: "Access denied: Students can only view their own profile" });
      }
      const student = await userServices.getStudentById(id);
      if (!student) return res.status(404).json({ message: "Student not found" });
      res.status(200).json({ student, user: student });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateStudent(req, res) {
    try {
      const { id } = req.params;
      if (req.user.role === "student" && req.user.id !== id) {
        return res.status(403).json({ message: "Access denied: You can only update your own profile" });
      }
      const updated = await userServices.updateStudent(id, req.body);
      if (!updated) return res.status(404).json({ message: "Student not found" });
      res.status(200).json({ message: "Student updated successfully", student: updated, user: updated });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteStudent(req, res) {
    try {
      const { id } = req.params;
      if (req.user.role !== "faculty") {
        return res.status(403).json({ message: "Access denied: Only faculty can delete students" });
      }
      const deleted = await userServices.softDelete(id);
      if (!deleted) return res.status(404).json({ message: "Student not found" });
      res.status(200).json({ message: "Student soft-deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await userServices.getProfile(id);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (req.user.role === "student" && req.user.id !== id) {
        return res.status(403).json({ message: "Access denied: Students can only view their own profile" });
      }
      if (req.user.role === "faculty" && user.role === "faculty" && req.user.id !== id) {
        return res.status(403).json({ message: "Access denied: Faculty cannot view other faculty profiles" });
      }

      res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserController();