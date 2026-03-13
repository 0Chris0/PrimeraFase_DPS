const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use('/img', express.static('img'));

// Base de datos temporal
let libros = [
{
  id:1,
  nombre: "Sapiens",
  autor: "Yuval Noah Harari",
  texto: "Historia de la humanidad desde los primeros Homo sapiens.",
  imagen: "http://10.0.2.2:3000/img/img1.jpg"
},
{
  id:2,
  nombre: "El psicoanalista",
  autor: "John Katzenbach",
  texto: "Un thriller psicológico sobre una amenaza misteriosa.",
  imagen: "http://10.0.2.2:3000/img/img2.jpg"
},
{
  id:3,
  nombre: "Fahrenheit 451",
  autor: "Ray Bradbury",
  texto: "Un futuro donde los libros están prohibidos.",
  imagen: "http://10.0.2.2:3000/img/img3.jpg"
},
{
  id:4,
  nombre: "La sombra del viento",
  autor: "Carlos Ruiz Zafón",
  texto: "Historia de misterio en Barcelona.",
  imagen: "http://10.0.2.2:3000/img/img4"
},
{
  id:5,
  nombre: "El Hobbit",
  autor: "J.R.R. Tolkien",
  texto: "Bilbo Bolsón vive una aventura para recuperar un tesoro custodiado por un dragón.",
  imagen: "http://10.0.2.2:3000/img/img5.jpg"
},
{
  id:6,
  nombre: "El nombre del viento",
  autor: "Patrick Rothfuss",
  texto: "La historia de Kvothe, un mago legendario.",
  imagen: "http://10.0.2.2:3000/img/img6.jpg"
}

];
//PROCESO DE MOSTRAR LOS LIBROS

// Obtiene los libros disponibles
app.get("/libros", (peticion, respuesta) => {
  respuesta.json(libros);
});

// Busca los libros
app.get("/libros/buscar/:nombre", (peticion, respuesta) => {

  const nombre = peticion.params.nombre.toLowerCase();
  const resultado = libros.filter(libro =>
    libro.nombre.toLowerCase().includes(nombre)
  );
  respuesta.json(resultado);
});

// Registro de los usuario
let usuarios = [];

app.post("/registro", (peticion, respuesta) => {

  const { nombre, correo } = peticion.body;

  if(!nombre || !correo){
    return respuesta.status(400).json({mensaje:"Datos incompletos"});
  }

  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre,
    correo
  };

  usuarios.push(nuevoUsuario);

  respuesta.json({
    mensaje:"Usuario registrado",
    usuario:nuevoUsuario
  });
});

app.listen(3000, "0.0.0.0", () => {
    console.log("Servidor corriendo en puerto 3000");
});