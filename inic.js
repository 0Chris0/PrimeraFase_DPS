import { View, Text, Button, StyleSheet } from "react-native";
import  estilos  from "./estilos";

export default function Inicio({ navigation }) {
  return (
    <View style={estilos.container}>

      <View style={estilos.header}>
        <Text style={estilos.titulo}>Biblioteca Digital</Text>
      </View>

      <View style={estilos.card}>
        <Text style={estilos.libroTitulo}>Libro destacado</Text>
        <Text style={estilos.libroNombre}>El Principito</Text>
        <Text style={estilos.autor}>Antoine de Saint-Exupéry</Text>
      </View>

      <View style={estilos.botones}>
        <Button title="Ver Detalles" onPress={() => navigation.navigate("Detalle")} />
        <Button title="Ir a Perfil" onPress={() => navigation.navigate("Perfil")} />
        <Button title="Vista" onPress={() => navigation.navigate("Vista")} />
      </View>
    </View>
  );
}
