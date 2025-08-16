const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const taskRoutes = require("./routes/task");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const yaml = require("js-yaml");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const cors = require("cors");

dotenv.config();

const app = express();

const FRONTEND_URL = "http://localhost:5173"; // Ajusta aquí el puerto correcto

// CORS: debe ir antes de cualquier middleware que use cookies o CSRF
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "X-XSRF-TOKEN"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Protección CSRF
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});
app.use(csrfProtection);

// Enviar la cookie XSRF-TOKEN para que el frontend pueda leer el token CSRF
app.use((req, res, next) => {
  if (req.method === "GET") {
    res.cookie("XSRF-TOKEN", req.csrfToken(), {
      httpOnly: false, // <--- para que JS del frontend pueda leerla
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  }
  next();
});

// Rutas
app.use("/tasks", taskRoutes);

// Documentación Swagger
const swaggerDocument = yaml.load(fs.readFileSync("./swagger.yaml", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ status: "error", message: "invalid csrf token" });
  }
  res.status(500).json({ status: "error", message: "Algo salió mal", error: err.message });
});

// Conexión a MongoDB y arranque del servidor
const PORT = process.env.PORT || 5003;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  })
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

module.exports = app;
