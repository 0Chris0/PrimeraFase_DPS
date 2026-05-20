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

  try {
    const correoGuardado = await SecureStore.getItemAsync("usuario_correo");
    const contrasenaGuardada = await SecureStore.getItemAsync("usuario_contrasena");

    console.log("Guardado:", correoGuardado, contrasenaGuardada);
    console.log("Ingresado:", correo, contrasena);

    if (!correoGuardado || !contrasenaGuardada) {
      Alert.alert("Error", "No hay usuario registrado.");
      return;
    }

    const correoNormalizado = correo.trim().toLowerCase();
    const correoDB = correoGuardado.trim().toLowerCase();

    if (
      correoNormalizado === correoDB &&
      contrasena === contrasenaGuardada
    ) {
      await SecureStore.setItemAsync("sesion_activa", "true");
      onLogin();
    } else {
      Alert.alert("Error", "Correo o contraseña incorrectos.");
    }
  } catch (error) {
    console.log("Error login:", error);
    Alert.alert("Error", "Error al iniciar sesión.");
  }
};

  return (
    <ImageBackground
      source={require("./assets/fondo.png")}
      style={styles.fondo}
    >
      <StatusBar hidden />

      {/* ================= LOGO ================= */}
      <View style={styles.logoWrapper}>
        <Image
          source={require("./assets/dorado.png")}
          style={styles.doradoGlow}
        />

        <Image
          source={require("./assets/logo.png")}
          style={styles.logo}
        />
      </View>

      {/* ================= BORDE DORADO ================= */}
      <ImageBackground
        source={require("./assets/borde.png")}
        style={styles.bordeCarta}
        imageStyle={{ borderRadius: 30, resizeMode: "stretch" }}
        
      >
        {/* ================= CARTA ================= */}
        <View style={styles.carta}>

          {/* TEXTURA / DEGRADADO */}
          <Image
            source={require("./assets/carta.png")}
            style={styles.texturaCarta}
          />

          <Text style={styles.titulo}>
            Iniciar sesión
          </Text>

          {/* ================= INPUT CORREO ================= */}
          <View style={styles.campoWrapper}>
            <LinearGradient
              colors={[
                "#A66712",
                "#CDA141",
                "#FDE77A",
                "#CDA141",
                "#A66712",
              ]}
              locations={[0, 0.15, 0.5, 0.84, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.campoBorde}
            >
              <ImageBackground
                source={require("./assets/carta.png")}
                style={styles.campoInner}
                imageStyle={{
                  borderRadius: 12,
                  opacity: 0.95,
                }}
              >
                <Ionicons
                  name="mail-outline"
                  size={22}
                  color="#5c4631"
                  style={styles.icono}
                />

                <TextInput
                  placeholder="Correo electrónico"
                  value={correo}
                  onChangeText={setCorreo}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#7b6c5c"
                />
              </ImageBackground>
            </LinearGradient>
          </View>

          {/* ================= INPUT CONTRASEÑA ================= */}
          <View style={styles.campoWrapper}>
            <LinearGradient
              colors={[
                "#A66712",
                "#CDA141",
                "#FDE77A",
                "#CDA141",
                "#A66712",
              ]}
              locations={[0, 0.15, 0.5, 0.84, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.campoBorde}
            >
              <ImageBackground
                source={require("./assets/carta.png")}
                style={styles.campoInner}
                imageStyle={{
                  borderRadius: 12,
                  opacity: 0.95,
                }}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color="#5c4631"
                  style={styles.icono}
                />

                <TextInput
                  placeholder="Contraseña"
                  value={contrasena}
                  onChangeText={setContrasena}
                  style={styles.input}
                  secureTextEntry={!verContrasena}
                  placeholderTextColor="#7b6c5c"
                />

                <TouchableOpacity
                  onPress={() =>
                    setVerContrasena(!verContrasena)
                  }
                >
                  <Ionicons
                    name={
                      verContrasena
                        ? "eye-off-outline"
                        : "eye-outline"
                    }
                    size={24}
                    color="#5c4631"
                  />
                </TouchableOpacity>
              </ImageBackground>
            </LinearGradient>
          </View>

          {/* ================= OLVIDE ================= */}
          <Text style={styles.olvide}>
            ¿Olvidaste la contraseña?
          </Text>

          {/* ================= BOTÓN ================= */}
          <View style={styles.botonWrapper}>
            <LinearGradient
              colors={[
                "#A66712",
                "#CDA141",
                "#FDE77A",
                "#CDA141",
                "#A66712",
              ]}
              locations={[0, 0.15, 0.5, 0.84, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.botonBorde}
            >
              <TouchableOpacity
                onPress={ingresar}
                activeOpacity={0.8}
              >
                <ImageBackground
                  source={require("./assets/carta.png")}
                  style={styles.botonInner}
                  imageStyle={{
                    borderRadius: 14,
                    opacity: 0.45,
                  }}
                >
                  <Text style={styles.botonTexto}>
                    Ingresar
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* ================= LINKS ================= */}
          <Text style={styles.linkTexto}>
            ¿No tienes cuenta?
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Registro")
            }
          >
            <Text style={styles.link}>
              Crear cuenta
            </Text>
          </TouchableOpacity>

        </View>
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

  /* ================= LOGO ================= */

  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -35,
    zIndex: 20,
  },

  doradoGlow: {
    position: "absolute",
    width: 260,
    height: 220,
    resizeMode: "contain",
  },

  logo: {
    width: 145,
    height: 125,
    resizeMode: "contain",
  },

  /* ================= BORDE DORADO ================= */

  bordeCarta: {
  width: 330,
  paddingTop: 6,
  paddingHorizontal: 6,
  paddingBottom: 15,  // ← Cambia el padding general por esto para empujar la carta beige hacia arriba
  borderRadius: 30,
  overflow: "hidden", // ← Asegura que el contenedor actúe como una máscara

  resizeMode: "stretch",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 10,
  },
  shadowOpacity: 0.35,
  shadowRadius: 15,
  elevation: 12,
},
  /* ================= CARTA ================= */

 carta: {
  width: "99%",
  alignSelf: "center",
  // Mantenemos tus radios superiores, pero aseguramos los inferiores
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  borderBottomLeftRadius: 24,  // ← Crucial para que curve abajo
  borderBottomRightRadius: 24, // ← Crucial para que curve abajo
  
  paddingTop: 65,
  paddingBottom: 15,           // ← Le damos un poco más de espacio abajo al texto "Crear cuenta"
  paddingHorizontal: 28,
  alignItems: "center",
  overflow: "hidden",          // ← Mantiene la textura dentro de la carta

  backgroundColor: "#efe7da",

  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.15,
  shadowRadius: 5,
  elevation: 5,
},
  texturaCarta: {
    position: "absolute",
    width: "122%",
    height: "122%",
    opacity: 0.55,
    top: 0,
    borderRadius: 24,
  },

  /* ================= TITULO ================= */

  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#3b2414",
    marginBottom: 20,
    fontFamily: "serif",

    textShadowColor: "rgba(255,255,255,0.4)",
    textShadowOffset: {
      width: 0,
      height: 1,
    },
    textShadowRadius: 2,
  },

  /* ================= INPUTS ================= */

  campoWrapper: {
    width: "100%",
    marginBottom: 18,
    borderRadius: 14,
    overflow: "hidden",
  },

  campoBorde: {
    padding: 2,
    borderRadius: 14,
  },

  campoInner: {
    flexDirection: "row",
    alignItems: "center",
    height: 58,
    paddingHorizontal: 18,
    borderRadius: 12,
    overflow: "hidden",
  },

  icono: {
    marginRight: 12,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#3d2a1d",
  },

  /* ================= OLVIDE ================= */

  olvide: {
    width: "100%",
    fontSize: 13,
    color: "#4e4033",
    marginTop: 2,
    marginBottom: 28,
    paddingLeft: 5,
  },

  /* ================= BOTON ================= */

  botonWrapper: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },

  botonBorde: {
    padding: 3,
    borderRadius: 16,
  },

  botonInner: {
    height: 58,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  botonTexto: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",

    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 4,
  },

  /* ================= LINKS ================= */

  linkTexto: {
    fontSize: 14,
    color: "#4e4033",
    marginBottom: 4,
  },

  link: {
    fontSize: 15,
    color: "#b8860b",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
