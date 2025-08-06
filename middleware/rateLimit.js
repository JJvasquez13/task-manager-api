const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 solicitudes por IP
  message: {
    status: "error",
    message: "Demasiadas solicitudes, intenta de nuevo más tarde",
  },
});

module.exports = limiter;
