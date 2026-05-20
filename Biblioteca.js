import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
  ImageBackground,
  Platform,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons';

export default function Biblioteca({ navigation }) {
  const [librosBiblioteca, setLibrosBiblioteca] = useState([]);
  const isFocused = useIsFocused(); 

  const cargarBiblioteca = async () => {
    try {
      const datos = await AsyncStorage.getItem('mi_biblioteca');
      if (datos !== null) {
        setLibrosBiblioteca(JSON.parse(datos));
      }
    } catch (error) {
      console.error("Error al cargar la biblioteca:", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      cargarBiblioteca();
    }
  }, [isFocused]);

  const eliminarDeBiblioteca = async (id) => {
    try {
      const nuevaLista = librosBiblioteca.filter(libro => libro.id !== id);
      setLibrosBiblioteca(nuevaLista);
      await AsyncStorage.setItem('mi_biblioteca', JSON.stringify(nuevaLista));
    } catch (error) {
      console.error(error);
    }
  };

  const renderItem = ({ item }) => {
    const volumeInfo = item.volumeInfo || {};
    const urlPortada = volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") || 'https://via.placeholder.com/150';

    return (
      <TouchableOpacity 
        style={styles.tarjetaLibro}
        onPress={() => {
          if (navigation) {
            // 1. OBTENEMOS EL ESTADO COMPLETO DEL NAVEGADOR
            const navState = navigation.getState();
            
            // 2. EXTRAEMOS LOS NOMBRES DE TODAS LAS PANTALLAS DISPONIBLES EN TU APP
            const rutasDisponibles = navState?.routeNames || [];
            
            // 3. BUSCAMOS CUÁL DE TUS PANTALLAS CONTIENE LA PALABRA "Detalle" o "Book"
            // (Esto mapea automáticamente si le pusiste 'Detalles', 'DetalleLibro', 'BookDetail', etc.)
            const rutaDetalleCorrecta = rutasDisponibles.find(name => 
              name.toLowerCase().includes('detalle') || name.toLowerCase().includes('book')
            );

            if (rutaDetalleCorrecta) {
              // Si la encuentra de forma dinámica, navega usando el nombre real de tu App.js
              console.log("Ruta detectada automáticamente:", rutaDetalleCorrecta);
              navigation.navigate(rutaDetalleCorrecta, { libro: item });
            } else {
              // PLAN DE EMERGENCIA: Si por alguna razón no lee el state, probamos con la ruta por defecto
              // Pero esta vez usamos un condicional seguro para evitar que rompa la pantalla
              const primeraRutaExistente = rutasDisponibles[0] || 'DetalleLibro';
              
              // Te muestra en consola tus rutas reales para que copies el nombre exacto
              console.log("Rutas instaladas en tu App.js:", rutasDisponibles);
              
              alert(
                `¡Casi listo! Tus pantallas registradas son: ${rutasDisponibles.join(', ')}. Modifica el archivo Biblioteca.js para usar una de ellas.`
              );
            }
          } else {
            alert("Error: El componente de navegación no está disponible.");
          }
        }}
      >
        <Image source={{ uri: urlPortada }} style={styles.portada} />
        <View style={styles.infoContainer}>
          <Text style={styles.titulo} numberOfLines={2}>{volumeInfo.title || "Sin título"}</Text>
          <Text style={styles.autor} numberOfLines={1}>{volumeInfo.authors?.join(", ") || "Autor desconocido"}</Text>
        </View>
        
        <TouchableOpacity style={styles.botonEliminar} onPress={() => eliminarDeBiblioteca(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#8b0000" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#e6dec9' }}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <ImageBackground 
        source={require("./assets/carta.png")} 
        resizeMode="cover" 
        style={{ flex: 1 }}
      >
        <SafeAreaView style={styles.contenedorSafe}>
          <Text style={styles.tituloPantalla}>Mi Biblioteca</Text>
          
          {librosBiblioteca.length === 0 ? (
            <View style={styles.contenedorVacio}>
              <Ionicons name="book-outline" size={60} color="#7c6c58" />
              <Text style={styles.textoVacio}>Aún no has añadido libros a tu biblioteca.</Text>
            </View>
          ) : (
            <FlatList
              data={librosBiblioteca}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listaContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorSafe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 20,
  },
  tituloPantalla: {
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: '#4A3524',
    textAlign: 'center',
    marginBottom: 20,
  },
  listaContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  tarjetaLibro: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(74, 53, 36, 0.15)',
  },
  portada: {
    width: 60,
    height: 90,
    borderRadius: 6,
    resizeMode: 'cover',
    backgroundColor: '#F7EBD7',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a120b',
    fontFamily: 'serif',
  },
  autor: {
    fontSize: 13,
    color: '#5c4d3c',
    marginTop: 4,
  },
  botonEliminar: {
    padding: 10,
  },
  contenedorVacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  textoVacio: {
    fontSize: 16,
    color: '#7c6c58',
    textAlign: 'center',
    marginTop: 15,
    fontStyle: 'italic',
  }
});