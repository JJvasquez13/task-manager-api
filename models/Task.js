const mongoose = require("mongoose");

function isDateTodayOrFuture(value) {
  const inputDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  inputDate.setHours(0, 0, 0, 0);
  return inputDate >= today;
}

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "El título es obligatorio"],
    trim: true,
    maxlength: [50, "El título no puede exceder los 50 caracteres"],
  },
  description: {
    type: String,
    required: [true, "La descripción es obligatoria"],
    trim: true,
    maxlength: [200, "La descripción no puede exceder los 200 caracteres"],
  },
  longDescription: {
    type: String,
    trim: true,
    maxlength: [
      2000,
      "La descripción extendida no puede exceder los 2000 caracteres",
    ],
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  startDate: {
    type: Date,
    required: [true, "La fecha de inicio es obligatoria"],
    validate: {
      validator: isDateTodayOrFuture,
      message: "La fecha de inicio debe ser hoy o futura",
    },
  },
  dueDate: {
    type: Date,
    required: [true, "La fecha de finalización es obligatoria"],
    validate: {
      validator: isDateTodayOrFuture,
      message: "La fecha de finalización debe ser hoy o futura",
    },
  },
  status: {
    type: String,
    enum: ["Sin iniciar", "En curso", "Completado"],
    default: "Sin iniciar",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "El ID del usuario es obligatorio"],
    ref: "User",
  },
});

module.exports = mongoose.model("Task", taskSchema);
