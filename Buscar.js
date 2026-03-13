import { View, Text, TextInput, Image, ScrollView } from "react-native";
import { useState } from "react";
import estilos from "./estilos";
import { libros } from "./libros";

export default function Buscar() {

  const [busqueda, setBusqueda] = useState("");

  const resultados = libros.filter(libro =>
    libro.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );
  return (
    <View style={estilos.container}>
      <TextInput
        placeholder="Buscar libro..."
        value={busqueda}
        onChangeText={setBusqueda}
        style={{ borderWidth:1, margin:20, padding:10, borderRadius:5}}/>
      <ScrollView>
        {busqueda !== "" && resultados.length === 0 && (
          <View style={estilos.card}>
            <Text style={{fontSize:18}}>Libro no disponible en la biblioteca</Text>
          </View>
        )}
        {resultados.map((libro, index) => (

          <View key={index} style={estilos.card}>
            <View style={estilos.textoContainer}>
              <Text style={estilos.libroTitulo}>Resultado</Text>
              <Text style={estilos.libroNombre}>{libro.nombre}</Text>
              <Text style={estilos.autor}>{libro.autor}</Text>
              <Text style={estilos.texto}>{libro.texto}</Text>
            </View>
            <Image
              style={estilos.imagen}
              source={{ uri: libro.imagen }}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}