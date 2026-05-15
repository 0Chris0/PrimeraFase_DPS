import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';

import { useState, useEffect } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { useIsFocused } from '@react-navigation/native';

import estilos from './estilos';

import { Ionicons } from '@expo/vector-icons';


export default function Favs() {

  const [favoritos, setFavoritos] = useState([]);

  const isFocused = useIsFocused();


  // CARGAR FAVORITOS
  const cargarFavoritos = async () => {

    try {

      const datos =
        await AsyncStorage.getItem('mis_favoritos');

      if (datos) {

        setFavoritos(JSON.parse(datos));

      } else {

        setFavoritos([]);
      }

    } catch (error) {

      console.error(
        "Error al cargar favoritos",
        error
      );
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

      "¿Deseas eliminar este libro?",

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

              // FILTRAR LISTA
              const nuevaLista =
                favoritos.filter(
                  item => item.id !== id
                );

              // ACTUALIZAR ESTADO
              setFavoritos(nuevaLista);

              // GUARDAR EN STORAGE
              await AsyncStorage.setItem(
                'mis_favoritos',
                JSON.stringify(nuevaLista)
              );

            } catch (error) {

              console.error(
                "Error al eliminar",
                error
              );
            }
          }
        }
      ]
    );
  };


  return (

    <View style={estilos.container}>

      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          padding: 15,
          textAlign: 'center'
        }}
      >
        Mis Libros Guardados
      </Text>


      {favoritos.length === 0 ? (

        <Text
          style={{
            textAlign: 'center',
            marginTop: 50,
            color: 'gray'
          }}
        >
          No has agregado favoritos todavía.
        </Text>

      ) : (

        <FlatList

          data={favoritos}

          keyExtractor={(item) => item.id}

          renderItem={({ item }) => (

            <View style={estilos.card}>

              {/* INFORMACIÓN */}
              <View
                style={[
                  estilos.textoContainer,
                  { flex: 1 }
                ]}
              >

                <Text style={estilos.libroNombre}>
                  {item.volumeInfo.title}
                </Text>

                <Text style={estilos.autor}>
                  {
                    item.volumeInfo.authors
                      ? item.volumeInfo.authors.join(", ")
                      : "Autor desconocido"
                  }
                </Text>

              </View>


              {/* IMAGEN */}
              {item.volumeInfo.imageLinks?.thumbnail && (

                <Image
                  source={{
                    uri:
                      item.volumeInfo.imageLinks.thumbnail.replace(
                        "http://",
                        "https://"
                      )
                  }}

                  style={estilos.imagen}
                />

              )}


              {/* BOTÓN ELIMINAR */}
              <TouchableOpacity

                onPress={() =>
                  eliminarFavorito(item.id)
                }

                style={{
                  marginLeft: 10,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >

                <Ionicons
                  name="trash"
                  size={28}
                  color="red"
                />

              </TouchableOpacity>

            </View>

          )}

        />

      )}

    </View>
  );
}