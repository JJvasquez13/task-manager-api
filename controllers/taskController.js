const Task = require("../models/Task");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

// Helper function to format Date to DD/MM/YYYY
function formatDateToDDMMYYYY(date) {
  if (!date || isNaN(new Date(date).getTime())) return null;
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    // Format dates in response
    const formattedTasks = tasks.map((task) => ({
      ...task.toObject(),
      startDate: formatDateToDDMMYYYY(task.startDate),
      dueDate: formatDateToDDMMYYYY(task.dueDate),
      createdAt: formatDateToDDMMYYYY(task.createdAt),
    }));
    logger.info(
      `Obtenidas ${tasks.length} tareas para usuario: ${req.user.id}`
    );
    res.json(formattedTasks);
  } catch (error) {
    logger.error(
      `Error al obtener tareas para usuario ${req.user.id}: ${error.message}`
    );
    res.status(500).json({
      status: "error",
      message: "Error al obtener las tareas",
      error: error.message,
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) {
      logger.warn(
        `Tarea no encontrada: ${req.params.id} para usuario ${req.user.id}`
      );
      return res
        .status(404)
        .json({ status: "error", message: "Tarea no encontrada" });
    }
    // Format dates in response
    const formattedTask = {
      ...task.toObject(),
      startDate: formatDateToDDMMYYYY(task.startDate),
      dueDate: formatDateToDDMMYYYY(task.dueDate),
      createdAt: formatDateToDDMMYYYY(task.createdAt),
    };
    logger.info(`Tarea obtenida: ${req.params.id} para usuario ${req.user.id}`);
    res.json(formattedTask);
  } catch (error) {
    logger.error(`Error al obtener tarea ${req.params.id}: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "Error al obtener la tarea",
      error: error.message,
    });
  }
};

const getTaskByTitle = async (req, res) => {
  try {
    const task = await Task.findOne({
      title: new RegExp("^" + req.params.title + "$", "i"),
      userId: req.user.id,
    });
    if (!task) {
      logger.warn(
        `Tarea no encontrada por título: ${req.params.title} para usuario ${req.user.id}`
      );
      return res
        .status(404)
        .json({ status: "error", message: "Tarea no encontrada" });
    }
    // Format dates in response
    const formattedTask = {
      ...task.toObject(),
      startDate: formatDateToDDMMYYYY(task.startDate),
      dueDate: formatDateToDDMMYYYY(task.dueDate),
      createdAt: formatDateToDDMMYYYY(task.createdAt),
    };
    logger.info(
      `Tarea obtenida por título: ${req.params.title} para usuario ${req.user.id}`
    );
    res.json(formattedTask);
  } catch (error) {
    logger.error(
      `Error al obtener tarea por título ${req.params.title}: ${error.message}`
    );
    res.status(500).json({
      status: "error",
      message: "Error al obtener la tarea",
      error: error.message,
    });
  }
};

const createTask = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      logger.warn("ID de usuario no disponible en createTask");
      return res
        .status(400)
        .json({ status: "error", message: "ID de usuario no disponible" });
    }
    const taskData = {
      ...req.body,
      userId: new mongoose.Types.ObjectId(req.user.id),
    };
    const task = new Task(taskData);
    const savedTask = await task.save();
    // Format dates in response
    const formattedTask = {
      ...savedTask.toObject(),
      startDate: formatDateToDDMMYYYY(savedTask.startDate),
      dueDate: formatDateToDDMMYYYY(savedTask.dueDate),
      createdAt: formatDateToDDMMYYYY(savedTask.createdAt),
    };
    logger.info(`Tarea creada: ${savedTask._id} para usuario ${req.user.id}`);
    res.status(201).json(formattedTask);
  } catch (error) {
    logger.error(
      `Error al crear tarea para usuario ${req.user.id}: ${error.message}`
    );
    res.status(400).json({
      status: "error",
      message: "Error al crear la tarea",
      error: error.message,
    });
  }
};

const updateTask = async (req, res) => {
  try {
    // Optional: Validate startDate <= dueDate
    if (req.body.startDate && req.body.dueDate) {
      const startDate = new Date(req.body.startDate);
      const dueDate = new Date(req.body.dueDate);
      if (startDate > dueDate) {
        logger.warn(
          `Intento de actualizar tarea ${req.params.id} con startDate posterior a dueDate`
        );
        return res.status(400).json({
          status: "error",
          message:
            "La fecha de inicio no puede ser posterior a la fecha de finalización",
        });
      }
    }
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      logger.warn(
        `Tarea no encontrada para actualizar: ${req.params.id} para usuario ${req.user.id}`
      );
      return res
        .status(404)
        .json({ status: "error", message: "Tarea no encontrada" });
    }
    // Format dates in response
    const formattedTask = {
      ...task.toObject(),
      startDate: formatDateToDDMMYYYY(task.startDate),
      dueDate: formatDateToDDMMYYYY(task.dueDate),
      createdAt: formatDateToDDMMYYYY(task.createdAt),
    };
    logger.info(
      `Tarea actualizada: ${req.params.id} para usuario ${req.user.id}`
    );
    res.json(formattedTask);
  } catch (error) {
    logger.error(
      `Error al actualizar tarea ${req.params.id}: ${error.message}`
    );
    res.status(400).json({
      status: "error",
      message: "Error al actualizar la tarea",
      error: error.message,
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!task) {
      logger.warn(
        `Tarea no encontrada para eliminar: ${req.params.id} para usuario ${req.user.id}`
      );
      return res
        .status(404)
        .json({ status: "error", message: "Tarea no encontrada" });
    }
    logger.info(
      `Tarea eliminada: ${req.params.id} para usuario ${req.user.id}`
    );
    res.json({ status: "success", message: "Tarea eliminada correctamente" });
  } catch (error) {
    logger.error(`Error al eliminar tarea ${req.params.id}: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "Error al eliminar la tarea",
      error: error.message,
    });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  getTaskByTitle,
  createTask,
  updateTask,
  deleteTask,
};
