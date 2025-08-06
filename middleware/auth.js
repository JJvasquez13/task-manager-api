const axios = require("axios");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      logger.warn("No autorizado: Token no proporcionado");
      return res.status(401).json({
        status: "error",
        message: "No autorizado, token no proporcionado",
      });
    }

    // Validar el token con la API de seguridad
    const response = await axios.get(
      `${process.env.AUTH_API_URL}/users/profile`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );

    // Extraer el usuario
    const user = response.data.data?.user || response.data.user;
    if (!user) {
      throw new Error("No se encontró el objeto user en la respuesta");
    }

    const userId = user._id || user.id;
    if (!userId) {
      throw new Error("No se encontró el ID del usuario en la respuesta");
    }

    // Almacenar el usuario autenticado en req.user
    req.user = {
      id: new mongoose.Types.ObjectId(userId), // Usar 'new' para ObjectId
      ...user,
    };

    logger.info(`Usuario autenticado: ${req.user.id} (${req.user.email})`);
    next();
  } catch (error) {
    logger.error(
      `Error al validar token: ${
        error.response?.data?.message || error.message
      }`
    );
    res.status(401).json({
      status: "error",
      message: "No autorizado, token inválido",
      error: error.message,
    });
  }
};

module.exports = auth;
