const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 
const app = express();
const port = 3307;

// Crear la conexión a la base de datos
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'sasa1234',
  database: 'tododatabase'
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Habilitar CORS para todas las rutas
app.use(cors({
    origin: 'http://127.0.0.1:8080', // Permite solicitudes desde este origen
    methods: 'GET, POST',  // Permite solo estos métodos
    allowedHeaders: 'Content-Type'  // Permite los encabezados necesarios
  }));

// Ruta para obtener las tareas de hoy
app.get('/tasks', (req, res) => {
  db.query('SELECT * FROM tasks WHERE DATE(created_at) = CURDATE()', (err, rows) => {
    if (err) {
      console.error("No se ha podido acceder a la consulta");
      return res.status(500).json({ error: 'Error al obtener las tareas' });
    }
    
    // Enviar los resultados al cliente
    res.json(rows);  // Enviar las tareas como respuesta en formato JSON
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
