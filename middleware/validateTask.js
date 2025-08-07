const { body, validationResult } = require("express-validator");

const validateTask = [
  body("title")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ max: 50 })
    .withMessage("El título no puede exceder los 50 caracteres")
    .trim()
    .escape(),
  body("description")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ max: 200 })
    .withMessage("La descripción no puede exceder los 200 caracteres")
    .trim()
    .escape(),
  body("longDescription")
    .optional()
    .isLength({ max: 2000 })
    .withMessage(
      "La descripción extendida no puede exceder los 2000 caracteres"
    )
    .trim()
    .escape(),
  body("startDate")
    .notEmpty()
    .withMessage("La fecha de inicio es obligatoria")
    .isISO8601()
    .withMessage("La fecha de inicio debe ser una fecha válida")
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);
      if (inputDate < today) {
        throw new Error("La fecha de inicio debe ser hoy o futura");
      }
      return true;
    }),
  body("dueDate")
    .notEmpty()
    .withMessage("La fecha de finalización es obligatoria")
    .isISO8601()
    .withMessage("La fecha de finalización debe ser una fecha válida")
    .custom((value) => {
      const inputDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      inputDate.setHours(0, 0, 0, 0);
      if (inputDate < today) {
        throw new Error("La fecha de finalización debe ser hoy o futura");
      }
      return true;
    }),
  body("status")
    .optional()
    .isIn(["Sin iniciar", "En curso", "Completado"])
    .withMessage('El estado debe ser "Sin iniciar", "En curso" o "Completado"'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ status: "error", errors: errors.array() });
    }
    next();
  },
];

module.exports = validateTask;
