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

      <ImageBackground
        source={require("./assets/borde.png")}
        style={styles.bordeCarta}
        resizeMode="stretch"
        imageStyle={{ borderRadius: 20 }}
      >
        <ImageBackground
          source={require("./assets/carta.png")}
          style={styles.carta}
          resizeMode="stretch"
          imageStyle={{ borderRadius: 16 }}
        >
          <Text style={styles.titulo}>Crear Cuenta</Text>

          <View style={styles.campoWrapper}>
            <LinearGradient
              colors={["#A66712", "#CDA141", "#FDE77A", "#CDA141", "#A66712"]}
              locations={[0, 0.15, 0.5, 0.84, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.campoBorde}
            >
              <ImageBackground
                source={require("./assets/carta.png")}
                style={styles.campoInner}
                resizeMode="stretch"
                imageStyle={{ borderRadius: 7, opacity: 0.92 }}
              >
                <Ionicons name="person-outline" size={18} color="#1a1a1a" style={styles.icono} />
                <TextInput
                  placeholder="Nombre Completo"
                  value={nombre}
                  onChangeText={setNombre}
                  style={styles.input}
                  placeholderTextColor="#888"
                />
              </ImageBackground>
            </LinearGradient>
          </View>

          <View style={styles.campoWrapper}>
            <LinearGradient
              colors={["#A66712", "#CDA141", "#FDE77A", "#CDA141", "#A66712"]}
              locations={[0, 0.15, 0.5, 0.84, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.campoBorde}
            >
              <ImageBackground
                source={require("./assets/carta.png")}
                style={styles.campoInner}
                resizeMode="stretch"
                imageStyle={{ borderRadius: 7, opacity: 0.92 }}
              >
                <Ionicons name="mail-outline" size={18} color="#1a1a1a" style={styles.icono} />
                <TextInput
                  placeholder="Correo electrónico"
                  value={correo}
                  onChangeText={setCorreo}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#888"
                />
              </ImageBackground>
            </LinearGradient>
          </View>

          <View style={styles.campoWrapper}>
            <LinearGradient
              colors={["#A66712", "#CDA141", "#FDE77A", "#CDA141", "#A66712"]}
              locations={[0, 0.15, 0.5, 0.84, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.campoBorde}
            >
              <ImageBackground
                source={require("./assets/carta.png")}
                style={styles.campoInner}
                resizeMode="stretch"
                imageStyle={{ borderRadius: 7, opacity: 0.92 }}
              >
                <Ionicons name="lock-closed-outline" size={18} color="#1a1a1a" style={styles.icono} />
                <TextInput
                  placeholder="Contraseña"
                  value={contrasena}
                  onChangeText={setContrasena}
                  style={styles.input}
                  secureTextEntry
                  placeholderTextColor="#888"
                />
              </ImageBackground>
            </LinearGradient>
          </View>

          <View style={styles.campoWrapper}>
            <LinearGradient
              colors={["#A66712", "#CDA141", "#FDE77A", "#CDA141", "#A66712"]}
              locations={[0, 0.15, 0.5, 0.84, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.campoBorde}
            >
              <ImageBackground
                source={require("./assets/carta.png")}
                style={styles.campoInner}
                resizeMode="stretch"
                imageStyle={{ borderRadius: 7, opacity: 0.92 }}
              >
                <Ionicons name="lock-closed-outline" size={18} color="#1a1a1a" style={styles.icono} />
                <TextInput
                  placeholder="Confirmar contraseña"
                  value={confirmar}
                  onChangeText={setConfirmar}
                  style={styles.input}
                  secureTextEntry
                  placeholderTextColor="#888"
                />
              </ImageBackground>
            </LinearGradient>
          </View>

          <View style={styles.botonWrapper}>
            <LinearGradient
              colors={["#A66712", "#CDA141", "#FDE77A", "#CDA141", "#A66712"]}
              locations={[0, 0.15, 0.5, 0.84, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.botonBorde}
            >
              <TouchableOpacity onPress={registrar} activeOpacity={0.8}>
                <ImageBackground
                  source={require("./assets/carta.png")}
                  style={styles.botonInner}
                  resizeMode="stretch"
                  imageStyle={{ borderRadius: 9, opacity: 0.4 }}
                >
                  <Text style={styles.botonTexto}>Registrarse</Text>
                </ImageBackground>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <Text style={styles.linkTexto}>¿Ya tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Iniciar sesión</Text>
          </TouchableOpacity>

        </ImageBackground>
      </ImageBackground>

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
    marginBottom: -45,
    zIndex: 10,
  },
  doradoGlow: {
    position: "absolute",
    width: 300,
    height: 240,
    resizeMode: "contain",
  },
  logo: {
    width: 150,
    height: 130,
    resizeMode: "contain",
    zIndex: 2,
  },
  bordeCarta: {
    width: "90%",
    padding: 3.5,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
    marginBottom: 40,
  },
  carta: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    paddingTop: 35,
    paddingHorizontal: 20,
    alignItems: "center",
    overflow: "hidden",
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1a1a1a",
    fontFamily: "serif",
  },
  campoWrapper: {
    width: "100%",
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  campoBorde: {
    padding: 1.5,
    borderRadius: 8,
  },
  campoInner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 7,
    paddingHorizontal: 12,
    height: 48,
    overflow: "hidden",
    width: "100%",
  },
  icono: {
    marginRight: 8,
  },
  input: {
    fontSize: 14,
    color: "#1a1a1a",
    flex: 1,
  },
  botonWrapper: {
    width: "100%",
    marginBottom: 18,
    marginTop: 6,
    borderRadius: 10,
    overflow: "hidden",
  },
  botonBorde: {
    padding: 2,
    borderRadius: 10,
  },
  botonInner: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    overflow: "hidden",
    width: "100%",
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  linkTexto: {
    fontSize: 13,
    color: "#555",
    marginBottom: 4,
  },
  link: {
    fontSize: 14,
    color: "#c9a84c",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});