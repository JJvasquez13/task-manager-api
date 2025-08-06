const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const validateTask = require("../middleware/validateTask");
const auth = require("../middleware/auth");
const csrfProtection = require("../middleware/csrf");
const rateLimit = require("../middleware/rateLimit");

router.get("/", auth, rateLimit, taskController.getAllTasks);
router.get("/:id", auth, rateLimit, taskController.getTaskById);
router.get("/by-title/:title", auth, rateLimit, taskController.getTaskByTitle);
router.post(
  "/",
  auth,
  csrfProtection,
  rateLimit,
  validateTask,
  taskController.createTask
);
router.put(
  "/:id",
  auth,
  csrfProtection,
  rateLimit,
  validateTask,
  taskController.updateTask
);
router.delete(
  "/:id",
  auth,
  csrfProtection,
  rateLimit,
  taskController.deleteTask
);

module.exports = router;
