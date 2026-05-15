import {
  View,
  Text,
  Image,
  Button,
  ScrollView
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import AsyncStorage from '@react-native-async-storage/async-storage';

import estilos from './estilos';

export default function DetalleLibro({ route }) {

  // RECIBIR DATOS
  const { libro } = route.params;

  const guardarEnFavoritos = async () => {

    try {

      const actuales =
        await AsyncStorage.getItem('mis_favoritos');

      let lista =
        actuales ? JSON.parse(actuales) : [];

      // EVITAR DUPLICADOS
      if (!lista.find(item => item.id === libro.id)) {

        lista.push(libro);

        await AsyncStorage.setItem(
          'mis_favoritos',
          JSON.stringify(lista)
        );

        alert("Libro agregado");

      } else {

        alert("Ya está guardado");
      }

    } catch (error) {

      console.error(error);
    }
  };

  return (

    <ScrollView style={estilos.container}>

      <View
        style={{
          alignItems: 'center',
          padding: 20
        }}
      >

        {libro.volumeInfo.imageLinks?.thumbnail && (

          <Image
            source={{
              uri:
                libro.volumeInfo.imageLinks.thumbnail.replace(
                  "http://",
                  "https://"
                )
            }}

            style={{
              width: 180,
              height: 250,
              marginBottom: 20
            }}
          />

        )}

        <Text style={estilos.libroNombre}>
          {libro.volumeInfo.title}
        </Text>

        <Text style={estilos.autor}>
          {libro.volumeInfo.authors?.join(", ")}
        </Text>

        <Text style={estilos.texto}>
          {libro.volumeInfo.description || "Sin descripción"}
        </Text>

        <Button
          title="Agregar a Favoritos"
          onPress={guardarEnFavoritos}
        />

      </View>

    </ScrollView>
  );
}