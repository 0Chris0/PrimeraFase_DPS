import { View, Text, Image, ScrollView } from "react-native";
import estilos from "./estilos";

export default function Favoritos({ favoritos }) {

  return (
    <View style={estilos.container}>
      <ScrollView>

        {favoritos.length === 0 && (
          <Text style={{textAlign:"center", marginTop:30, fontSize:18}}>
            No tienes favoritos aún
          </Text>
        )}
        {favoritos.map((libro, index) => (
          <View key={index} style={estilos.card}>
            <View style={estilos.textoContainer}>
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