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

export default function Login({ navigation, onLogin }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verContrasena, setVerContrasena] = useState(false);

  const ingresar = async () => {
    if (!correo || !contrasena) {
      Alert.alert("Error", "Por favor completa todos los campos.");
      return;
    }
    const correoGuardado = await SecureStore.getItemAsync("usuario_correo");
    const contrasenaGuardada = await SecureStore.getItemAsync("usuario_contrasena");
    if (correo === correoGuardado && contrasena === contrasenaGuardada) {
      await SecureStore.setItemAsync("sesion_activa", "true");
      onLogin();
    } else {
      Alert.alert("Error", "Correo o contraseña incorrectos.");
    }
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
        imageStyle={{ borderRadius: 20 }}
      >
        <ImageBackground
          source={require("./assets/carta.png")}
          style={styles.carta}
          imageStyle={{ borderRadius: 16 }}
        >
          <Text style={styles.titulo}>Iniciar sesión</Text>

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
                imageStyle={{ borderRadius: 7, opacity: 0.92 }}
              >
                <TextInput
                  placeholder="Contraseña"
                  value={contrasena}
                  onChangeText={setContrasena}
                  style={styles.input}
                  secureTextEntry={!verContrasena}
                  placeholderTextColor="#888"
                />
                <TouchableOpacity onPress={() => setVerContrasena(!verContrasena)}>
                  <Ionicons
                    name={verContrasena ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#1a1a1a"
                  />
                </TouchableOpacity>
              </ImageBackground>
            </LinearGradient>
          </View>

          <Text style={styles.olvide}>¿Olvidaste la contraseña?</Text>

          <View style={styles.botonWrapper}>
            <LinearGradient
              colors={["#A66712", "#CDA141", "#FDE77A", "#CDA141", "#A66712"]}
              locations={[0, 0.15, 0.5, 0.84, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.botonBorde}
            >
              <TouchableOpacity onPress={ingresar} activeOpacity={0.8}>
                <ImageBackground
                  source={require("./assets/carta.png")}
                  style={styles.botonInner}
                  imageStyle={{ borderRadius: 9, opacity: 0.4 }}
                >
                  <Text style={styles.botonTexto}>Ingresar</Text>
                </ImageBackground>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          <Text style={styles.linkTexto}>¿No tienes cuenta?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Registro")}>
            <Text style={styles.link}>Crear cuenta</Text>
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
    width: "94%",
    padding: 4,
    borderRadius: 20,
    overflow: "hidden",
  },
  carta: {
    width: "100%",
    borderRadius: 16,
    padding: 20,
    paddingTop: 30,
    paddingHorizontal: 35,
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
    width: "92%",
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  campoBorde: {
    padding: 2,
    borderRadius: 8,
  },
  campoInner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 7,
    paddingHorizontal: 12,
    paddingVertical: 12,
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
  olvide: {
    fontSize: 12,
    color: "#555",
    alignSelf: "flex-start",
    marginLeft: "4%",
    marginBottom: 16,
  },
  botonWrapper: {
    width: "92%",
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