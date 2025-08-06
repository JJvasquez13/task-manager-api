const mongoose = require("mongoose");

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
  dueDate: {
    type: Date,
    required: [true, "La fecha de finalización es obligatoria"],
    validate: {
      validator: function (value) {
        return value >= new Date();
      },
      message: "La fecha de finalización debe ser futura",
    },
  },
  status: {
    type: String,
    enum: ["en curso", "completado"],
    default: "en curso",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "El ID del usuario es obligatorio"],
    ref: "User",
  },
});

module.exports = mongoose.model("Task", taskSchema);
