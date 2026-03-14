import { View, Text, Image, ScrollView, TextInput, Button } from "react-native";
import { useState, useEffect } from "react";
import estilos from "./estilos";

export default function Inicio({ navigation, favoritos, setFavoritos }) {

  const [busqueda, setBusqueda] = useState("");
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    const url = "http://10.0.2.2:3000/libros";//IP del emulador NO LO BORREN

    fetch(url)
      .then(respuesta => respuesta.json())
      .then(data => setLibros(data))
      .catch(error => console.log("Error al traer libros:", error));
      }, []);

        const resultados = libros.filter(libro =>
        libro.nombre.toLowerCase().includes(busqueda.toLowerCase())
        );
  return (
    <View style={estilos.container}>
      <TextInput placeholder="Buscar libro" value={busqueda} onChangeText={setBusqueda}
        style={{ borderWidth: 1, margin: 15, padding: 10, borderRadius: 8, backgroundColor: "white"}}/>
      <Text>Libros cargados: {libros.length}</Text>

      <ScrollView>
        {busqueda !== "" && resultados.length === 0 && (
          <View style={estilos.card}>
            <Text style={{fontSize:18}}>Libro no disponible</Text>
          </View>)}

        {(busqueda === "" ? libros : resultados).map((libro, index) => (
          <View key={index} style={estilos.card}>
            <View style={estilos.textoContainer}>
              <Text style={estilos.libroTitulo}>Libro destacado</Text>
              <Text style={estilos.libroNombre}>{libro.nombre}</Text>
              <Text style={estilos.autor}>{libro.autor}</Text>
              <Text style={estilos.texto}>{libro.texto}</Text>

              <Button title="Agregar a favoritos" onPress={() => setFavoritos([...favoritos, libro])}/>
            </View>
            <Image style={estilos.imagen} source={{ uri: libro.imagen }}/>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}