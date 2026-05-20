import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import { CommonActions } from '@react-navigation/native';

const { width } = Dimensions.get('window');

export default function DetalleLibro({ route, navigation }) {
  const { libro } = route.params;
  const [pestanaActiva, setPestanaActiva] = useState('resumen');

  // Mapeo seguro de los datos de la API de Google Books
  const volumeInfo = libro.volumeInfo || {};
  const titulo = volumeInfo.title || "Sin título";
  const autores = volumeInfo.authors?.join(", ") || "Autor desconocido";
  const descripcion = volumeInfo.description || "Sin descripción disponible para este ejemplar.";
  const paginas = volumeInfo.pageCount ? `${volumeInfo.pageCount} páginas` : "No especificado";
  const categorias = volumeInfo.categories?.join(", ") || "General";
  
  // --- CORRECCIÓN DEL IDIOMA ---
  const diccionarioIdiomas = {
    es: 'Español',
    en: 'Inglés',
    fr: 'Francés',
    it: 'Italiano',
    de: 'Alemán',
    pt: 'Portugués'
  };
  
  const codigoIdioma = volumeInfo.language;
  const idioma = diccionarioIdiomas[codigoIdioma] || (codigoIdioma ? codigoIdioma.toUpperCase() : "No especificado");

  const linkLectura = volumeInfo.previewLink || volumeInfo.infoLink;
  const urlPortada = volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") || 'https://via.placeholder.com/150';

  const abrirLibro = async () => {
    if (linkLectura) {
      try {
        await WebBrowser.openBrowserAsync(linkLectura, {
          toolbarColor: '#4A3524',
          controlsColor: '#ffffff',
          showTitle: true,
          enableBarCollapsing: true,
        });
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar la vista de lectura.");
      }
    } else {
      alert("Lo sentimos, este ejemplar no cuenta con un enlace de lectura digital.");
    }
  };

  const guardarEnFavoritos = async () => {
    try {
      const actuales = await AsyncStorage.getItem('mis_favoritos');
      let lista = actuales ? JSON.parse(actuales) : [];

      if (!lista.find(item => item.id === libro.id)) {
        lista.push(libro);
        await AsyncStorage.setItem('mis_favoritos', JSON.stringify(lista));
        alert("¡Agregado a tus favoritos!");
      } else {
        alert("Este libro ya se encuentra en tus favoritos.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const guardarEnBiblioteca = async () => {
    try {
      const actuales = await AsyncStorage.getItem('mi_biblioteca');
      let lista = actuales ? JSON.parse(actuales) : [];

      if (!lista.find(item => item.id === libro.id)) {
        lista.push(libro);
        await AsyncStorage.setItem('mi_biblioteca', JSON.stringify(lista));
        alert("¡Añadido con éxito a tu biblioteca!");
      } else {
        alert("Este libro ya está en tu biblioteca.");
      }
    } catch (error) {
      console.error(error);
      alert("Hubo un error al guardar en la biblioteca.");
    }
  };

  const renderEstrellas = () => {
    let estrellas = [];
    for (let i = 1; i <= 5; i++) {
      estrellas.push(
        <Ionicons key={i} name="star" size={16} color="#d5a144" style={{ marginRight: 2 }} />
      );
    }
    return estrellas;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#e6dec9' }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <ImageBackground
        source={require("./assets/carta.png")}
        resizeMode="cover"
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.safeAreaContenedor}>
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
          >
            
            {/* --- BLOQUE SUPERIOR --- */}
            <View style={styles.bloqueSuperiorRow}>
              <View style={styles.portadaContainer}>
                <Image source={{ uri: urlPortada }} style={styles.libroCover} />
              </View>

              <View style={styles.metadatosHeaderColumn}>
                <Text style={styles.libroTitulo} numberOfLines={3}>{titulo}</Text>
                <Text style={styles.libroAutor}>{autores}</Text>
                
                <View style={styles.calificacionRow}>
                  {renderEstrellas()}
                  <Text style={styles.calificacionNumero}>4.8</Text>
                </View>
                <Text style={styles.resenasSubtexto}>(45,732 reseñas)</Text>

                <TouchableOpacity 
                  style={styles.botonLeerAhora} 
                  activeOpacity={0.8}
                  onPress={abrirLibro}
                >
                  <Text style={styles.textoBotonLeer}>Leer ahora</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* --- SELECTOR DE PESTAÑAS --- */}
            <View style={styles.pestanasContainerRow}>
              <TouchableOpacity 
                style={[styles.pestanaOpcion, pestanaActiva === 'resumen' && styles.pestanaActivaLinea]}
                onPress={() => setPestanaActiva('resumen')}
              >
                <Text style={[styles.pestanaTexto, pestanaActiva === 'resumen' && styles.pestanaTextoActivo]}>Resumen</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.pestanaOpcion, pestanaActiva === 'resena' && styles.pestanaActivaLinea]}
                onPress={() => setPestanaActiva('resena')}
              >
                <Text style={[styles.pestanaTexto, pestanaActiva === 'resena' && styles.pestanaTextoActivo]}>Reseña</Text>
              </TouchableOpacity>
            </View>

            {/* --- CONTENIDO --- */}
            {pestanaActiva === 'resumen' ? (
              <View style={styles.seccionContenido}>
                <Text style={styles.tituloSeccion}>Descripción</Text>
                <Text style={styles.descripcionTexto} numberOfLines={6}>
                  {descripcion.replace(/<[^>]*>/g, '')}
                </Text>
                <TouchableOpacity><Text style={styles.botonVerMas}>Ver más</Text></TouchableOpacity>
              </View>
            ) : (
              <View style={styles.seccionContenido}>
                <Text style={styles.tituloSeccion}>Reseñas de la comunidad</Text>
                <Text style={[styles.descripcionTexto, { fontStyle: 'italic' }]}>
                  "Una obra magistral. La ambientación gótica te atrapa desde las primeras páginas..." - Usuario Anónimo
                </Text>
              </View>
            )}

            <View style={styles.divisorLinea} />

            {/* --- DETALLES --- */}
            <Text style={[styles.tituloSeccion, { paddingHorizontal: 20, marginBottom: 15 }]}>Detalles del Libro</Text>
            
            <View style={styles.detallesAccionesGrid}>
              <View style={styles.columnaInfoTecnica}>
                <View style={styles.itemInfoFila}>
                  <Ionicons name="pencil-sharp" size={18} color="#4A3524" style={styles.iconoMargen} />
                  <Text style={styles.textoEtiqueta} numberOfLines={1}>Autor: <Text style={styles.textoValor}>{autores}</Text></Text>
                </View>

                <View style={styles.itemInfoFila}>
                  <Ionicons name="book-outline" size={18} color="#4A3524" style={styles.iconoMargen} />
                  <Text style={styles.textoEtiqueta} numberOfLines={1}>Género: <Text style={styles.textoValor}>{categorias}</Text></Text>
                </View>

                <View style={styles.itemInfoFila}>
                  <Ionicons name="document-text-outline" size={18} color="#4A3524" style={styles.iconoMargen} />
                  <Text style={styles.textoEtiqueta} numberOfLines={1}>Páginas: <Text style={styles.textoValor}>{paginas}</Text></Text>
                </View>

                <View style={styles.itemInfoFila}>
                  <Ionicons name="earth-outline" size={18} color="#4A3524" style={styles.iconoMargen} />
                  <Text style={styles.textoEtiqueta} numberOfLines={1}>Idioma: <Text style={styles.textoValor}>{idioma}</Text></Text>
                </View>
              </View>

              <View style={styles.columnaBotonesAccion}>
                <TouchableOpacity style={styles.botonAccionRedondo} onPress={guardarEnFavoritos}>
                  <Ionicons name="heart" size={16} color="#4A3524" style={{ marginRight: 6 }} />
                  <Text style={styles.textoBotonAccion}>Añadir a favoritos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botonAccionRedondo} onPress={guardarEnBiblioteca}>
                  <Ionicons name="library-outline" size={16} color="#4A3524" style={{ marginRight: 6 }} />
                  <Text style={styles.textoBotonAccion}>Añadir a biblioteca</Text>
                </TouchableOpacity>

                {/* BOTÓN CON ACCIÓN ULTRA-SEGURA PARA EVITAR PANTALLAS ROJAS DE CONSOLA */}
                <TouchableOpacity 
                  style={styles.botonAccionRedondo}
                  onPress={() => {
                    if (navigation) {
                      // Usamos CommonActions para forzar la ruta sin importar las pestañas inferiores
                      navigation.dispatch(
                        CommonActions.navigate({
                          name: 'Resenas',
                          params: { libro: libro },
                        })
                      );
                    } else {
                      alert("Error: El componente de navegación no está inicializado.");
                    }
                  }}
                >
                  <Ionicons name="chatbox-ellipses-outline" size={16} color="#4A3524" style={{ marginRight: 6 }} />
                  <Text style={styles.textoBotonAccion}>Escribir Reseña</Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaContenedor: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0, 
  },
  scrollContainer: {
    paddingBottom: 50,
    paddingTop: 10, 
  },
  bloqueSuperiorRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  portadaContainer: {
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 2, height: 4 },
  },
  libroCover: {
    width: 125,
    height: 185,
    borderRadius: 12,
    resizeMode: 'cover',
    backgroundColor: '#F7EBD7',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  metadatosHeaderColumn: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  libroTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a120b',
    fontFamily: 'serif',
    lineHeight: 26,
    marginBottom: 4,
  },
  libroAutor: {
    fontSize: 15,
    color: '#5c4d3c',
    marginBottom: 8,
  },
  calificacionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calificacionNumero: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3e3521',
  },
  resenasSubtexto: {
    fontSize: 12,
    color: '#7c6c58',
    marginTop: 2,
    marginBottom: 12,
  },
  botonLeerAhora: {
    backgroundColor: '#d5a144',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#9e7326',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  textoBotonLeer: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  pestanasContainerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#d3c5a9',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  pestanaOpcion: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    bottom: -1,
  },
  pestanaActivaLinea: {
    borderBottomWidth: 3,
    borderBottomColor: '#4A3524',
  },
  pestanaTexto: {
    fontSize: 15,
    color: '#7c6c58',
    fontWeight: '600',
  },
  pestanaTextoActivo: {
    color: '#4A3524',
    fontWeight: 'bold',
  },
  seccionContenido: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  tituloSeccion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3e3521',
    fontFamily: 'serif',
    marginBottom: 6,
  },
  descripcionTexto: {
    fontSize: 13.5,
    color: '#5c4d3c',
    lineHeight: 20,
    textAlign: 'justify',
  },
  botonVerMas: {
    alignSelf: 'flex-end',
    color: '#9e7326',
    fontSize: 13,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  divisorLinea: {
    height: 1,
    backgroundColor: '#d3c5a9',
    marginHorizontal: 20,
    marginVertical: 15,
  },
  detallesAccionesGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  columnaInfoTecnica: {
    width: '48%',
  },
  columnaBotonesAccion: {
    width: '48%',
    alignItems: 'stretch',
  },
  itemInfoFila: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconoMargen: {
    marginRight: 8,
    width: 20,
    textAlign: 'center',
  },
  textoEtiqueta: {
    fontSize: 12.5,
    color: '#7c6c58',
    fontWeight: '600',
    flex: 1,
  },
  textoValor: {
    color: '#3e3521',
    fontWeight: 'normal',
  },
  botonAccionRedondo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(213, 161, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(74, 53, 36, 0.4)',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  textoBotonAccion: {
    fontSize: 11,
    color: '#4A3524',
    fontWeight: 'bold',
  },
});
