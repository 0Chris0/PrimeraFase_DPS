import { View, Text, Image, StyleSheet, ImageBackground } from "react-native";
import { useEffect } from "react";
import { StatusBar } from "react-native";

export default function Splash({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ImageBackground source={require('./assets/fondo.png')} style={styles.fondo}>
      <StatusBar hidden />

      {/* dorado.png detrás del logo */}
      <View style={styles.logoWrapper}>
        <Image source={require('./assets/dorado.png')} style={styles.doradoGlow} />
        <Image source={require('./assets/logo.png')} style={styles.logo} />
      </View>

      <Text style={styles.titulo}>Legado Literario</Text>
      <Text style={styles.subtitulo}>Descubre los mejores libros</Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fondo: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logoWrapper: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  doradoGlow: { position: 'absolute', width: 320, height: 280, resizeMode: 'contain' },
  logo: { width: 180, height: 160, resizeMode: 'contain', zIndex: 2 },
  titulo: {
    fontSize: 34, fontWeight: 'bold', color: '#D4AF37',
    fontStyle: 'italic', fontFamily: 'serif',
    textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4,
  },
  subtitulo: { fontSize: 14, color: '#c9a84c', marginTop: 8, fontStyle: 'italic' },
});
