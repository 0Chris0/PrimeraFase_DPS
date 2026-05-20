import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function Resenas({ route, navigation }) {
  const params = route?.params || {};
  const libro = params.libro || null;

  const volumeInfo = libro?.volumeInfo || {};
  const libroId = libro?.id || 'default_id';

  const [calificacion, setCalificacion] = useState(5); 
  const [opinion, setOpinion] = useState('');

  useEffect(() => {
    if (libroId === 'default_id') return;

    const cargarResenaPrevia = async () => {
      try {
        const existentes = await AsyncStorage.getItem(`resena_${libroId}`);
        if (existentes) {
          const resenaGuardada = JSON.parse(existentes);
          setCalificacion(resenaGuardada.calificacion);
          setOpinion(resenaGuardada.opinion);
        }
      } catch (error) {
        console.error("Error al cargar la reseña:", error);
      }
    };
    cargarResenaPrevia();
  }, [libroId]);

  const enviarResena = async () => {
    if (!opinion || !opinion.trim()) {
      if (Platform.OS === 'web') {
        alert("Por favor, escribe un comentario antes de enviar tu reseña.");
      } else {
        Alert.alert("Campos vacíos", "Por favor, escribe un comentario antes de enviar tu reseña.");
      }
      return;
    }

    try {
      const objetoResena = {
        libroId: libroId,
        titulo: volumeInfo.title || "Sin título",
        calificacion: calificacion,
        opinion: opinion.trim(),
        fecha: new Date().toLocaleDateString()
      };

      await AsyncStorage.setItem(`resena_${libroId}`, JSON.stringify(objetoResena));
      
      try {
        const historialExistente = await AsyncStorage.getItem('todas_las_resenas');
        let listaHistorial = historialExistente ? JSON.parse(historialExistente) : [];
        listaHistorial = listaHistorial.filter(r => r.libroId !== libroId);
        listaHistorial.unshift(objetoResena);
        await AsyncStorage.setItem('todas_las_resenas', JSON.stringify(listaHistorial));
      } catch (errHistorial) {
        console.log("Aviso: No se pudo actualizar el historial global.");
      }

      if (Platform.OS === 'web') {
        alert("¡Éxito! Tu reseña ha sido guardada en tu legado literario.");
        navigation.goBack();
      } else {
        Alert.alert(
          "¡Éxito!", 
          "Tu reseña ha sido guardada en tu legado literario.", 
          [{ text: "OK", onPress: () => navigation.goBack() }],
          { cancelable: false }
        );
      }

    } catch (error) {
      console.error("Error crítico al guardar la reseña:", error);
    }
  };

  const cambiarCalificacion = (numeroEstrella) => {
    setCalificacion(numeroEstrella);
  };

  const renderEstrellasSeleccionables = () => {
    let estrellas = [];
    for (let i = 1; i <= 7; i++) {
      estrellas.push(
        <TouchableOpacity key={i} onPress={() => cambiarCalificacion(i)} activeOpacity={0.7}>
          <Ionicons 
            name={i <= calificacion ? "star" : "star-outline"} 
            size={28} 
            color="#d5a144" 
            style={{ marginRight: 4 }} 
          />
        </TouchableOpacity>
      );
    }
    return estrellas;
  };

  if (!libro) {
    return (
      <View style={{ flex: 1, backgroundColor: '#e6dec9', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'serif', color: '#4A3524', fontSize: 16 }}>Cargando datos del libro...</Text>
      </View>
    );
  }

  const urlPortada = volumeInfo.imageLinks?.thumbnail?.replace("http://", "https://") || 'https://via.placeholder.com/150';

  return (
    <View style={{ flex: 1, backgroundColor: '#05291C' }}>
      <StatusBar barStyle="light-content" backgroundColor="#05291C" translucent={true} />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={{ flex: 1, backgroundColor: '#e6dec9' }}
      >
        
        {/* --- CABECERA SUPERIOR CALIBRADA --- */}
        <View style={styles.cabeceraVerde}>
          <TouchableOpacity style={styles.botonAtras} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <Text style={styles.tituloHeader}>Legado Literario</Text>
          
          <View style={{ width: 34 }} />
        </View>

        <ImageBackground
          source={require("./assets/carta.png")}
          resizeMode="cover"
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            
            {/* --- TARJETA DEL LIBRO --- */}
            <View style={styles.tarjetaLibroContenedor}>
              <Image source={{ uri: urlPortada }} style={styles.portadaLibro} />
              <View style={styles.infoLibro}>
                <Text style={styles.tituloLibro} numberOfLines={2}>{volumeInfo.title || "Sin título"}</Text>
                <Text style={styles.autorLibro}>{volumeInfo.authors?.join(", ") || "Autor desconocido"}</Text>
                
                <View style={styles.estrellasInfoRow}>
                  {[1, 2, 3, 4, 5].map((e) => (
                    <Ionicons key={e} name="star" size={16} color="#d5a144" style={{ marginRight: 2 }} />
                  ))}
                </View>
              </View>
            </View>

            {/* --- DIVISOR "ESCRIBIR RESEÑA" --- */}
            <View style={styles.divisorContenedor}>
              <View style={styles.lineaDecorativa} />
              <Text style={styles.textoDivisor}>♦ Escribir reseña ♦</Text>
              <View style={styles.lineaDecorativa} />
            </View>

            {/* --- SECCIÓN SELECCIÓN DE ESTRELLAS --- */}
            <Text style={styles.labelSeccion}>Tu calificación:</Text>
            <View style={styles.contenedorEstrellasInteractivas}>
              {renderEstrellasSeleccionables()}
            </View>

            {/* --- ENTRADA DE TEXTO --- */}
            <View style={styles.inputContenedorBorde}>
              <TextInput
                style={styles.cajaTextoOpinion}
                placeholder="Escribe tu opinión sobre el libro..."
                placeholderTextColor="#7c6c58"
                multiline={true}
                numberOfLines={6}
                textAlignVertical="top"
                value={opinion}
                onChangeText={(texto) => setOpinion(texto)}
              />
            </View>

            {/* --- BOTÓN ENVIAR --- */}
            <TouchableOpacity 
              style={styles.botonEnviarResena} 
              activeOpacity={0.85}
              onPress={enviarResena}
            >
              <Text style={styles.textoBotonEnviar}>Enviar reseña</Text>
            </TouchableOpacity>

          </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  cabeceraVerde: {
    // Reducido a 25 para subirla sutilmente y dejarla en el punto perfecto
    marginTop: Platform.OS === 'ios' ? 35 : 25, 
    height: 60,
    backgroundColor: '#05291C', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 3,
    borderBottomColor: '#d5a144', 
  },
  botonAtras: {
    padding: 5,
    width: 34,
  },
  tituloHeader: {
    color: '#d5a144',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'serif',
    textAlign: 'center',
    flex: 1, 
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  tarjetaLibroContenedor: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#d5a144',
    alignItems: 'center',
    marginBottom: 20,
  },
  portadaLibro: {
    width: 75,
    height: 110,
    borderRadius: 6,
    resizeMode: 'cover',
    backgroundColor: '#F7EBD7',
  },
  infoLibro: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  tituloLibro: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: '#1a120b',
    marginBottom: 4,
  },
  autorLibro: {
    fontSize: 14,
    color: '#5c4d3c',
    marginBottom: 8,
  },
  estrellasInfoRow: {
    flexDirection: 'row',
  },
  divisorContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  lineaDecorativa: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(74, 53, 36, 0.3)',
  },
  textoDivisor: {
    fontSize: 15,
    fontFamily: 'serif',
    color: '#4A3524',
    fontWeight: '600',
    marginHorizontal: 10,
  },
  labelSeccion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3e3521',
    fontFamily: 'serif',
    marginBottom: 10,
  },
  contenedorEstrellasInteractivas: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 25,
  },
  inputContenedorBorde: {
    backgroundColor: '#eae1cb',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: '#d5a144',
    minHeight: 150,
    marginBottom: 30,
  },
  cajaTextoOpinion: {
    flex: 1,
    fontSize: 15,
    color: '#3e3521',
    fontFamily: 'serif',
    lineHeight: 22,
  },
  botonEnviarResena: {
    backgroundColor: '#05291C',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d5a144',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  textoBotonEnviar: {
    color: '#d5a144',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
  }
});