# task-manager-api

Para iniciar esta api se inicia con:

Se debe clonar la rama Dev
ya que este es el que tiene los cambios reales de lo que se esta utilizando actualmente en la Api

Para clonarlo se utiliza:
git clone -b Dev https://github.com/JJvasquez13/task-manager-api.git

npm install
(Para descargar todas las dependencias necesarias para su funcionamineto)


Despues se crea un archivo .env en la raiz para tener una conexion con la base de datos y  la api de seguridad

.env Ejemplo

(Copiar esto y pegarlo en el archivo)
MONGO_URI=mongodb://localhost:27017/taskManager
PORT=5003
AUTH_API_URL=http://localhost:5002

Para iniciar la API utiliza:
npm start
