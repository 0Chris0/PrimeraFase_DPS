import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Alert,
  StatusBar,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";

export default function Registro({ navigation, onLogin }) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const registrar = async () => {
    if (!nombre || !correo || !contrasena || !confirmar) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }
    if (contrasena !== confirmar) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }
    await SecureStore.setItemAsync("usuario_nombre", nombre);
    await SecureStore.setItemAsync("usuario_correo", correo);
    await SecureStore.setItemAsync("usuario_contrasena", contrasena);
    await SecureStore.setItemAsync("sesion_activa", "true");
    onLogin();
  };

  return (
    <ImageBackground source={require("./assets/fondo.png")} style={styles.fondo}>
      <StatusBar hidden />

      <View style={styles.logoWrapper}>
        <Image source={require("./assets/dorado.png")} style={styles.doradoGlow} />
        <Image source={require("./assets/logo.png")} style={styles.logo} />
      </View>

      {/* Contenedor principal de la tarjeta */}
      <View style={styles.contenedorTarjeta}>
        
        {/* Capa de atrás: El borde dorado que sobresale */}
        <ImageBackground
          source={require("./assets/borde.png")}
          style={styles.bordeCartaAbsoluto}
          resizeMode="stretch"
        />

        {/* Capa del frente: El pergamino beige que contiene el formulario */}
        <ImageBackground
          source={require("./assets/carta.png")}
          style={styles.carta}
          resizeMode="stretch"
        >
          <View style={styles.contenidoInterno}>
            <Text style={styles.titulo}>Crear Cuenta</Text>

            {/* Campo: Nombre Completo */}
            <View style={styles.campoInner}>
              <TextInput
                placeholder="Nombre Completo"
                value={nombre}
                onChangeText={setNombre}
                style={styles.input}
                placeholderTextColor="#7A6F5D"
              />
            </View>

            {/* Campo: Correo */}
            <View style={styles.campoInner}>
              <Ionicons name="mail" size={18} color="#5C5343" style={styles.icono} />
              <TextInput
                placeholder="Correo electrónico"
                value={correo}
                onChangeText={setCorreo}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#7A6F5D"
              />
            </View>

            {/* Campo: Contraseña */}
            <View style={styles.campoInner}>
              <Ionicons name="lock-closed" size={18} color="#5C5343" style={styles.icono} />
              <TextInput
                placeholder="Contraseña"
                value={contrasena}
                onChangeText={setContrasena}
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#7A6F5D"
              />
            </View>

            {/* Campo: Confirmar Contraseña */}
            <View style={styles.campoInner}>
              <Ionicons name="lock-closed" size={18} color="#5C5343" style={styles.icono} />
              <TextInput
                placeholder="Confirmar contraseña"
                value={confirmar}
                onChangeText={setConfirmar}
                style={styles.input}
                secureTextEntry
                placeholderTextColor="#7A6F5D"
              />
            </View>

            {/* Botón Registrarse */}
            <TouchableOpacity onPress={registrar} activeOpacity={0.8} style={styles.botonTouch}>
              <LinearGradient
                colors={["#A06F2A", "#E4C175", "#B98B43", "#8A5819"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.botonGradient}
              >
                <Text style={styles.botonTexto}>Registrarse</Text>
              </LinearGradient>
            </TouchableOpacity>

            <Text style={styles.linkTexto}>¿Ya tienes cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Iniciar sesión</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -15, 
    zIndex: 10,
    width: "100%",
  },
  doradoGlow: {
    position: "absolute",
    width: 280,
    height: 200,
    resizeMode: "contain",
    top: -20,
  },
  logo: {
    width: 150,
    height: 110,
    resizeMode: "contain",
  },
  contenedorTarjeta: {
    width: "82%",         // Ancho de la tarjeta en pantalla
    alignSelf: "center",
    position: "relative",
    marginTop: 0,
  },
  bordeCartaAbsoluto: {
    position: "absolute",
    // Modifica estos números (ej. -15 o -20) si quieres que el borde dorado sea todavía más grande
    top: -12,           
    bottom: -22,
    left: -12,
    right: -12,
    zIndex: 1,
  },
  carta: {
    width: "100%",
    zIndex: 2,
    overflow: "hidden",
  },
  contenidoInterno: {
    width: "100%",
    paddingVertical: 35,
    paddingHorizontal: 22, // Mantiene los inputs alineados dentro del pergamino
    alignItems: "center",
    zIndex: 3,
  },
  titulo: {
    fontSize: 28,
    marginBottom: 24,
    color: "#3E3019", 
    fontFamily: "serif",
    textAlign: "center",
    fontWeight: "bold",
  },
  campoInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E2D4BD", 
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    width: "100%", 
    marginBottom: 14,
  },
  icono: {
    marginRight: 10,
    opacity: 0.7,
  },
  input: {
    fontSize: 15,
    color: "#3E3019",
    flex: 1,
    fontFamily: "serif",
  },
  botonTouch: {
    width: "100%",
    marginTop: 10,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F7DF9B", 
    overflow: "hidden",
  },
  botonGradient: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  botonTexto: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "serif",
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  linkTexto: {
    fontSize: 13,
    color: "#5C5343",
    marginBottom: 4,
    fontFamily: "serif",
  },
  link: {
    fontSize: 14,
    color: "#9A752C",
    textDecorationLine: "underline",
    fontFamily: "serif",
    fontWeight: "bold",
  },
});
