const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); 
const app = express();
const port = 3307;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Permite solo estos métodos
    allowedHeaders: 'Content-Type'  // Permite los encabezados necesarios
  }));





app.put('/tasks', (req, res) => {
  const  id = req.query.id;
  const  completed  = req.body;
  console.log('Body recibido: ', req.body);
  console.log(completed);
 

  // Actualizar la tarea en la base de datos
  db.query('UPDATE tasks SET completed = ? WHERE id = ?', [completed, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar la tarea:', err);
      return res.status(500).json({ error: 'Error al actualizar la tarea' });
    }
    res.json({ message: 'Tarea actualizada correctamente' });
  });
});


app.get('/tasks', (req, res) => {
  const selectedDate = req.query.date;
  const id = req.query.id;

  // Si se proporciona la fecha, filtrar por esa fecha
  if (selectedDate) {
    db.query('SELECT * FROM tasks WHERE DATE(created_at) = ?', [selectedDate], (err, rows) => {
      if (err) {
        console.error("No se ha podido acceder a la consulta");
        return res.status(500).json({ error: 'Error al obtener las tareas' });
      }
      res.json(rows);  // Enviar las tareas como respuesta en formato JSON
    });
  } else if(id){
    db.query('SELECT * FROM tasks WHERE id = ?', [id], (err, rows) => {
      if (err) {
        console.error('Error al obtener la tarea:', err);
        return res.status(500).json({ error: 'Error al obtener la tarea' });
      }
      res.json(rows)
    })}else{
      db.query('SELECT * FROM tasks', (err, rows) => {
        if (err) {
          console.error("No se ha podido acceder a la consulta");
          return res.status(500).json({ error: 'Error al obtener las tareas' });
        }
        res.json(rows);  // Enviar todas las tareas como respuesta en formato JSON
    });
  }
});




app.post("/tasks", (req, res) =>{
    const {task, completed, points} = req.body;
    db.query('INSERT INTO tasks (task, completed, points) VALUES (?, ?, ?)', [task, completed, points], (err, result) => {
      if (err) {
        console.error('Error al insertar la tarea:', err);
        return res.status(500).json({ error: 'Error al insertar la tarea' });
      }
      res.status(201).json({ message: 'Tarea creada correctamente', taskId: result.insertId });
    });

   
});


app.delete('/tasks', (req, res) => {
  const id = req.query.id;

  db.query('DELETE FROM tasks WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar la tarea:', err);
      return res.status(500).json({ error: 'Error al eliminar la tarea' });
    }
    res.json({ message: 'Tarea eliminada correctamente' });
  });
});



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
