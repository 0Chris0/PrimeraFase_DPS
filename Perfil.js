import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";

import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";

import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";

export default function Perfil({ onLogout }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();

  const [mostrarCamara, setMostrarCamara] = useState(false);
  const [tipoCamara, setTipoCamara] = useState("front");

  const [fotoPerfil, setFotoPerfil] = useState(null);

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");

  const [totalLibros, setTotalLibros] = useState(0);
  const [totalResenas, setTotalResenas] = useState(0);
  const [totalFavoritos, setTotalFavoritos] = useState(0);

  // 📍 ubicación bonita
  const [ubicacion, setUbicacion] = useState(null);
  const [ubicacionTexto, setUbicacionTexto] = useState("");
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  useEffect(() => {
    if (isFocused) {
      cargarDatos();
      cargarEstadisticas();
      cargarFotoPerfil();
    }
  }, [isFocused]);

  // ---------------- FOTO PERFIL ----------------
  const cargarFotoPerfil = async () => {
    const foto = await AsyncStorage.getItem("foto_perfil");
    if (foto) setFotoPerfil(foto);
  };

  // ---------------- CÁMARA ----------------
  const abrirCamara = async () => {
    try {
      if (!permission) return;

      if (permission.granted) {
        setMostrarCamara(true);
        return;
      }

      const res = await requestPermission();

      if (res.granted) {
        setMostrarCamara(true);
      } else {
        alert("No permitiste el acceso a la cámara.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const cambiarCamara = () => {
    setTipoCamara((actual) =>
      actual === "back" ? "front" : "back"
    );
  };

  const tomarFoto = async () => {
    if (!cameraRef.current) return;

    const foto = await cameraRef.current.takePictureAsync();

    setFotoPerfil(foto.uri);
    await AsyncStorage.setItem("foto_perfil", foto.uri);

    setMostrarCamara(false);
  };

  // ---------------- UBICACIÓN BONITA ----------------
  const obtenerUbicacion = async () => {
    try {
      setCargandoUbicacion(true);

      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        alert("No permitiste acceso a la ubicación.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setUbicacion(location.coords);

      const { latitude, longitude } = location.coords;

      const geo = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (geo.length > 0) {
        const lugar = geo[0];

        const ciudad =
          lugar.city || lugar.region || "Ciudad desconocida";

        const pais = lugar.country || "";

        setUbicacionTexto(`${ciudad}, ${pais}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setCargandoUbicacion(false);
    }
  };

  // ---------------- DATOS ----------------
  const cargarDatos = async () => {
    const nombreGuardado =
      await SecureStore.getItemAsync("usuario_nombre");

    const correoGuardado =
      await SecureStore.getItemAsync("usuario_correo");

    if (correoGuardado) {
      setNombre(nombreGuardado || "Usuario");
      setCorreo(correoGuardado);
    }
  };

  const cargarEstadisticas = async () => {
    const libros = await AsyncStorage.getItem("mi_biblioteca");
    const favoritos = await AsyncStorage.getItem("mis_favoritos");
    const resenas = await AsyncStorage.getItem("todas_las_resenas");

    setTotalLibros(libros ? JSON.parse(libros).length : 0);
    setTotalFavoritos(favoritos ? JSON.parse(favoritos).length : 0);
    setTotalResenas(resenas ? JSON.parse(resenas).length : 0);
  };

  const cerrarSesion = async () => {
    await SecureStore.deleteItemAsync("sesion_activa");
    onLogout();
  };

  // ---------------- CÁMARA UI ----------------
  if (mostrarCamara) {
    return (
      <View style={{ flex: 1 }}>
        <CameraView ref={cameraRef} style={{ flex: 1 }} facing={tipoCamara}>

          <TouchableOpacity
            style={styles.botonCerrarCamara}
            onPress={() => setMostrarCamara(false)}
          >
            <Ionicons name="close" size={30} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonGirar}
            onPress={cambiarCamara}
          >
            <Ionicons name="camera-reverse" size={30} color="#FFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.botonCaptura}
            onPress={tomarFoto}
          >
            <View style={styles.circuloInterno} />
          </TouchableOpacity>

        </CameraView>
      </View>
    );
  }

  // ---------------- UI PRINCIPAL (TU DISEÑO ORIGINAL) ----------------
  return (
    <ImageBackground
      source={require("./assets/carta.png")}
      style={styles.background}
    >
      <ImageBackground
        source={require("./assets/fondo.png")}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Mi perfil</Text>
      </ImageBackground>

      <View style={styles.container}>
        <View style={styles.card}>

          {/* FOTO */}
          <View style={styles.avatarContainer}>
            <Image
              source={require("./assets/logo.png")}
              style={styles.logoLibro}
            />

            <TouchableOpacity onPress={abrirCamara}>
              <Image
                source={
                  fotoPerfil
                    ? { uri: fotoPerfil }
                    : require("./assets/perfil.png")
                }
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>

          {/* NOMBRE */}
          <View style={styles.nameBox}>
            <Text style={styles.userNameText}>{nombre}</Text>
          </View>

          {/* SUB */}
          <View style={styles.subBox}>
            <Text style={styles.subText}>Amante de la lectura</Text>
          </View>

          {/* UBICACIÓN */}
          <TouchableOpacity
            onPress={obtenerUbicacion}
            style={{ marginBottom: 10 }}
          >
            <Text style={{ fontSize: 12, color: "#4A3428" }}>
              {cargandoUbicacion
                ? "Obteniendo ubicación..."
                : ubicacionTexto || "📍 Mi ubicación"}
            </Text>
          </TouchableOpacity>

          {/* STATS */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Ionicons name="book" size={22} color="#7B5E00" />
              <Text style={styles.statVal}>{totalLibros}</Text>
              <Text style={styles.statLabel}>libros</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="star" size={22} color="#D4A017" />
              <Text style={styles.statVal}>{totalResenas}</Text>
              <Text style={styles.statLabel}>reseñas</Text>
            </View>

            <View style={styles.statBox}>
              <Ionicons name="heart" size={22} color="#5A4632" />
              <Text style={styles.statVal}>{totalFavoritos}</Text>
              <Text style={styles.statLabel}>favoritos</Text>
            </View>
          </View>

          {/* LIBROS */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Biblioteca")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="book" size={20} color="#F0C541" />
              <Text style={styles.menuText}>mis libros</Text>
            </View>
            <Ionicons name="chevron-forward" size={26} color="#F0C541" />
          </TouchableOpacity>

          {/* FAVORITOS */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Favs")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="heart" size={20} color="#F0C541" />
              <Text style={styles.menuText}>favoritos</Text>
            </View>
            <Ionicons name="chevron-forward" size={26} color="#F0C541" />
          </TouchableOpacity>

          {/* LOGOUT */}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={cerrarSesion}
          >
            <Text style={styles.logoutText}>Cerrar sesión</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  header: {
    height: 75,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 38,
    color: "#D9B24C",
    fontWeight: "bold",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  card: {
    width: "95%",
    backgroundColor: "#F5E8D7",
    borderRadius: 35,
    paddingTop: 35,
    paddingBottom: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 6,
    borderColor: "#123524",
  },

  avatarContainer: {
    position: "absolute",
    top: -70,
    alignSelf: "center",
    width: 95,
    height: 95,
    borderRadius: 50,
   
    borderWidth: 5,
    borderColor: "#D4A017",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  avatar: {
    width: 87,
    height: 87,
    borderRadius: 50,
    resizeMode: "cover",
  },

  logoLibro: {
    position: "absolute",
    top: -28,
    width: 50,
    height: 50,
    resizeMode: "contain",
    zIndex: 20,
  },

  nameBox: {
    backgroundColor: "#5E7A5E",
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 7,
    width: "72%",
    alignItems: "center",
  },

  userNameText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 13,
  },

  subBox: {
    backgroundColor: "#6B8E6B",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  subText: {
    color: "#FFF",
    fontSize: 11,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "#EFE2CF",
    borderRadius: 7,
    paddingVertical: 7,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#D9C1A5",
  },

  statBox: {
    alignItems: "center",
  },

  statVal: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#4A3428",
  },

  statLabel: {
    fontSize: 9,
    color: "#4A3428",
  },

  menuItem: {
    width: "100%",
    backgroundColor: "#5E7A5E",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#F0C541",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuText: {
    color: "#F8F3E7",
    marginLeft: 12,
    fontSize: 17,
    fontWeight: "500",
  },

  logoutButton: {
    marginTop: 12,
    backgroundColor: "#B5792E",
    paddingVertical: 8,
    width: "60%",
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#E8C547",
  },

  logoutText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },

  botonCerrarCamara: {
    position: "absolute",
    top: 60,
    left: 20,

    backgroundColor: "rgba(0,0,0,0.5)",

    width: 50,
    height: 50,

    borderRadius: 25,

    justifyContent: "center",
    alignItems: "center",
  },

  botonGirar: {
    position: "absolute",
    top: 60,
    right: 20,

    backgroundColor: "rgba(0,0,0,0.5)",

    width: 50,
    height: 50,

    borderRadius: 25,

    justifyContent: "center",
    alignItems: "center",
  },

  botonCaptura: {
    position: "absolute",

    bottom: 40,

    alignSelf: "center",

    width: 85,
    height: 85,

    borderRadius: 50,

    borderWidth: 5,
    borderColor: "#FFF",

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(255,255,255,0.2)",
  },

  circuloInterno: {
    width: 60,
    height: 60,

    borderRadius: 50,

    backgroundColor: "#FFF",
  },
});
