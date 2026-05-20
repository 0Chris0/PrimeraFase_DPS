import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Keyboard,
  ImageBackground,
  StatusBar,
} from "react-native";

import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function Buscar({ navigation }) {
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [generos, setGeneros] = useState([]);
  const [filtro, setFiltro] = useState(false);

  const API_KEY = "AIzaSyDOVKUZWIfcvc2xqBixFJ0uh_OvkSiFcco";

  useEffect(() => {
    fetchLibros("Libros recomendados", "", true);
  }, []);

  useEffect(() => {
    if (textoBusqueda.trim() === "" && filtro) {
      resetearBusqueda();
      return;
    }

    if (textoBusqueda.trim().length > 0) {
      const delayDebounceFn = setTimeout(() => {
        fetchLibros(textoBusqueda);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [textoBusqueda]);

  const fetchLibros = async (query, tipo = "", Inic = false) => {
    if (!query.trim()) return;

    setCargando(true);
    setError(null);

    if (!Inic) {
      setFiltro(true);
    }

    try {
      let q = tipo ? `${tipo}:"${query}"` : query;

      let url = `https://www.googleapis.com/books/v1/volumes?q=${q}&key=${API_KEY}&maxResults=20`;

      let response = await fetch(url);

      let data = await response.json();

      if (data.items) {
        setLibros(data.items);

        if (Inic) {
          const gens = [
            ...new Set(
              data.items.flatMap((item) => item.volumeInfo.categories || []),
            ),
          ].slice(0, 10);

          setGeneros(gens);
        }
      } else {
        setLibros([]);
      }
    } catch (err) {
      setError("Error de conexión.");
    } finally {
      setCargando(false);
    }
  };

  const resetearBusqueda = () => {
    setFiltro(false);
    setTextoBusqueda("");

    fetchLibros("Libros recomendados", "", true);

    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" />

      {/* FONDO */}
      <ImageBackground
        source={require("./assets/carta.png")}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        {/* HEADER */}
        <ImageBackground
          source={require("./assets/fondo.png")}
          resizeMode="cover"
          style={{
            width: "108%",
            alignSelf: "center",

            paddingTop: 12,
            paddingBottom: 10,
            paddingHorizontal: 14,

            overflow: "hidden",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                color: "#C89B2D",
                fontSize: 32,
                fontWeight: "bold",

                flex: 1,
                textAlign: "center",

                marginLeft: 35,
              }}
            >
              Legado Literario
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate("Perfil")}>
              <Ionicons name="person-circle" size={42} color="#F4E7C8" />
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* CONTENIDO */}
        <View
          style={{
            flex: 1,
            paddingHorizontal: 14,
          }}
        >
          {/* BUSCADOR */}
          <View
            style={{
              marginBottom: 18,
              marginTop: 28,
            }}
          >
            <View
              style={{
                height: 55,

                backgroundColor: "#F7EBD7",

                borderWidth: 2.5,
                borderColor: "#C79B2D",

                borderRadius: 14,

                flexDirection: "row",
                alignItems: "center",

                paddingHorizontal: 14,
              }}
            >
              <Ionicons
                name="search"
                size={24}
                color="#C79B2D"
                style={{
                  marginRight: 8,
                }}
              />

              <TextInput
                placeholder="Buscar libros..."
                placeholderTextColor="#8C7A63"
                value={textoBusqueda}
                onChangeText={setTextoBusqueda}
                style={{
                  flex: 1,
                  fontSize: 16,
                  color: "#4A3524",
                  height: 50,
                }}
              />
            </View>
          </View>

          {/* BOTON REGRESAR */}
          {filtro && (
            <TouchableOpacity
              onPress={resetearBusqueda}
              style={{
                marginBottom: 15,
                backgroundColor: "#857020",
                borderWidth: 2,
                borderColor: "#D4B24A",
                borderRadius: 12,
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                ← REGRESAR AL INICIO
              </Text>
            </TouchableOpacity>
          )}

          {/* GENEROS */}
          {!filtro && textoBusqueda === "" && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingRight: 20,
                paddingLeft: 5,
              }}
              style={{
                marginBottom: 16,
                // IMPORTANTE
                height: 60,
              }}
            >
              {generos.map((g, i) => (
                <TouchableOpacity
                  key={`gen-${i}`}
                  onPress={() => fetchLibros(g, "subject")}
                  style={{
                    marginRight: 12,
                  }}
                >
                  <ImageBackground
                    source={require("./assets/Generos.png")}
                    resizeMode="stretch"
                    imageStyle={{
                      // IMPORTANTE
                      borderRadius: 8,
                    }}
                    style={{
                      // ESTO EVITA QUE SE CORTE
                      alignSelf: "flex-start",

                      // CRECE SEGUN EL TEXTO
                      paddingHorizontal: 16,

                      // MAS ALTO
                      height: 45,

                      // TAMAÑO MINIMO
                      minWidth: 70,

                      justifyContent: "center",
                      alignItems: "center",

                      overflow: "visible",
                    }}
                  >
                    <Text
                      style={{
                        color: "#F4E8D0",

                        fontWeight: "bold",

                        fontSize: 14,

                        textAlign: "center",
                        paddingHorizontal: 10,
                      }}
                    >
                      {g}
                    </Text>
                  </ImageBackground>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          {/* LINEA DECORATIVA */}
          <View
            style={{
              alignItems: "center",
              marginBottom: 18,
              marginTop: 4,
            }}
          >
            <View
              style={{
                width: "92%",
                height: 3,

                backgroundColor: "#C79B2D",

                borderRadius: 20,
              }}
            />

            <Ionicons
              name="diamond"
              size={14}
              color="#C79B2D"
              style={{
                position: "absolute",
                top: -5,
                backgroundColor: "#EFE2CF",
                paddingHorizontal: 4,
              }}
            />
          </View>

          {/* CARGANDO */}
          {cargando && (
            <ActivityIndicator
              size="small"
              color="#857020"
              style={{
                marginVertical: 10,
              }}
            />
          )}

          {/* ERROR */}
          {error && (
            <Text
              style={{
                color: "red",
                textAlign: "center",
                marginBottom: 10,
              }}
            >
              {error}
            </Text>
          )}

          {/* LIBROS */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
              paddingTop: 8,
              paddingBottom: 30,
            }}
          >
            {libros.map((item, index) => (
              <TouchableOpacity
                key={item.id || `libro-${index}`}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate("Detalle", {
                    libro: item,
                  })
                }
              >
                <ImageBackground
                  source={require("./assets/cuadroLibro.png")}
                  resizeMode="stretch"
                  style={{
                    width: "100%",
                    alignSelf: "center",

                    minHeight: 122,

                    paddingVertical: 12,
                    paddingHorizontal: 6,

                    marginBottom: 18,

                    flexDirection: "row",
                    alignItems: "flex-start",

                    position: "relative",
                  }}
                >
                  {/* CORAZON */}
                  <Ionicons
                    name="heart"
                    size={26}
                    color="#8E8924"
                    style={{
                      position: "absolute",

                      top: 15,
                      right: 26,
                    }}
                  />

                  {/* IMAGEN */}
                  {item.volumeInfo.imageLinks?.thumbnail && (
                    <View
                      style={{
                        width: 60,
                        height: 85,

                        borderWidth: 1.5,
                        borderColor: "#8A6A16",

                        overflow: "hidden",

                        marginRight: 12,
                        marginLeft: 7,

                        marginTop: 7,
                      }}
                    >
                      <Image
                        source={{
                          uri: item.volumeInfo.imageLinks.thumbnail.replace(
                            "http://",
                            "https://",
                          ),
                        }}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        resizeMode="cover"
                      />
                    </View>
                  )}

                  {/* INFO */}
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      paddingRight: 68,
                    }}
                  >
                    {/* TITULO */}
                    <Text
                      numberOfLines={2}
                      style={{
                        color: "#C79B2D",

                        fontSize: 15,

                        fontWeight: "bold",

                        lineHeight: 20,
                      }}
                    >
                      {item.volumeInfo.title}
                    </Text>

                    {/* AUTOR */}
                    <Text
                      numberOfLines={2}
                      style={{
                        color: "#3D2F22",

                        fontSize: 12,

                        marginTop: 5,

                        marginBottom: 14,

                        lineHeight: 16,
                      }}
                    >
                      {item.volumeInfo.authors?.join(", ") ||
                        "Autor desconocido"}
                    </Text>
                  </View>

                  {/* BOTON */}
                  <View
                    style={{
                      position: "absolute",

                      right: 26,
                      bottom: 18,

                      backgroundColor: "#857020",

                      borderWidth: 2,
                      borderColor: "#D6B54B",

                      borderRadius: 10,

                      paddingVertical: 6,
                      paddingHorizontal: 14,
                    }}
                  >
                    <Text
                      style={{
                        color: "#F5E8D0",

                        fontWeight: "bold",

                        fontSize: 11,
                      }}
                    >
                      Ver Más
                    </Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
