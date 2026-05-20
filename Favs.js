import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ImageBackground,
  Platform,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function Favs({ navigation }) {
  const [favoritos, setFavoritos] = useState([]);
  const isFocused = useIsFocused();

  // CARGAR FAVORITOS
  const cargarFavoritos = async () => {
    try {
      const datos = await AsyncStorage.getItem('mis_favoritos');
      if (datos) {
        setFavoritos(JSON.parse(datos));
      } else {
        setFavoritos([]);
      }
    } catch (error) {
      console.error("Error al cargar favoritos", error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      cargarFavoritos();
    }
  }, [isFocused]);

  // ELIMINAR FAVORITO
  const eliminarFavorito = (id) => {
    Alert.alert(
      "Eliminar Favorito",
      "¿Deseas eliminar este libro de tus favoritos?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              const nuevaLista = favoritos.filter(item => item.id !== id);
              setFavoritos(nuevaLista);
              await AsyncStorage.setItem('mis_favoritos', JSON.stringify(nuevaLista));
            } catch (error) {
              console.error("Error al eliminar", error);
            }
          }
        }
      ]
    );
  };

  const renderItem = ({ item }) => {
    const volumeInfo = item.volumeInfo || {};
    const urlPortada = volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") || 'https://via.placeholder.com/150';

    return (
      <TouchableOpacity 
        style={styles.tarjetaLibro}
        activeOpacity={0.8}
        onPress={() => {
          if (navigation) {
            // Detección dinámica de ruta para evitar pantallas rojas
            const navState = navigation.getState();
            const rutasDisponibles = navState?.routeNames || [];
            const rutaDetalleCorrecta = rutasDisponibles.find(name => 
              name.toLowerCase().includes('detalle') || name.toLowerCase().includes('book')
            );

            if (rutaDetalleCorrecta) {
              navigation.navigate(rutaDetalleCorrecta, { libro: item });
            } else {
              navigation.navigate('DetalleLibro', { libro: item });
            }
          }
        }}
      >
        <Image source={{ uri: urlPortada }} style={styles.portada} />
        
        <View style={styles.infoContainer}>
          <Text style={styles.titulo} numberOfLines={2}>{volumeInfo.title || "Sin título"}</Text>
          <Text style={styles.autor} numberOfLines={1}>
            {volumeInfo.authors ? volumeInfo.authors.join(", ") : "Autor desconocido"}
          </Text>
        </View>

        {/* Botón Eliminar Estilizado */}
        <TouchableOpacity 
          style={styles.botonEliminar} 
          onPress={() => eliminarFavorito(item.id)}
        >
          <Ionicons name="heart-dislike-outline" size={24} color="#8b0000" />
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
          <Text style={styles.tituloPantalla}>Mis Favoritos</Text>

          {favoritos.length === 0 ? (
            <View style={styles.contenedorVacio}>
              <Ionicons name="heart-outline" size={60} color="#7c6c58" />
              <Text style={styles.textoVacio}>No has agregado favoritos todavía.</Text>
            </View>
          ) : (
            <FlatList
              data={favoritos}
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
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
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
    justifyContent: 'center',
    alignItems: 'center',
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
