import { View, Text, TextInput, Image, ScrollView, ActivityIndicator, TouchableOpacity, Button, SafeAreaView, Keyboard } from "react-native";
import { useState, useEffect } from "react";
import estilos from "./estilos"; 

export default function Buscar({ navigation, route }) {
  const [textoBusqueda, setTextoBusqueda] = useState(""); 
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [generos, setGeneros] = useState([]);
  const [autores, setAutores] = useState([]);
  const [filtro, setFiltro] = useState(false); 
  const PantallaBusqueda = route.name === "BuscarLibros"; 
  const API_KEY = "AIzaSyDOVKUZWIfcvc2xqBixFJ0uh_OvkSiFcco"; //Este es el codigo de para que la API funcione 

  useEffect(() => {
    fetchLibros("Libros recomendados", "", true);
  }, []);

  useEffect(() => {
    // Esto es para cuando borramos la busqueda nos manda a la pantalla de inicio sin hacer tab en regresar
    if (textoBusqueda.trim() === "" && filtro) {
      resetearBusqueda();
      return;
    }
    //El DelayDebounceFn es para que la API no se sobrecargue cuando se hace una peticion nueva 
    if (textoBusqueda.trim().length > 0) {
      const delayDebounceFn = setTimeout(() => {
        fetchLibros(textoBusqueda);
      }, 300); //Este es el tiempo que tarda en hacer la peticion
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
          const gens = [...new Set(data.items.flatMap(item => item.volumeInfo.categories || []))].slice(0, 10);
          const auts = [...new Set(data.items.flatMap(item => item.volumeInfo.authors || []))].slice(0, 10);
          setGeneros(gens);
          setAutores(auts);
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
      <View style={{ flex: 1, padding: 10 }}>
        
        <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 35 }}>Legado Literario</Text>

        {PantallaBusqueda && (
          <View style={{ marginVertical: 10 }}>
            <TextInput
              placeholder="Escribe aquí..."
              value={textoBusqueda}
              onChangeText={setTextoBusqueda}
              style={{ borderWidth: 1, padding: 10, backgroundColor: 'white' }}
            />
          </View>
        )}

        {/*Este es el boton de regresar si hay algo en el cuadro de busqueda*/}
        {filtro && (
          <TouchableOpacity 
            onPress={resetearBusqueda} 
            style={{ marginBottom: 10, padding: 10, backgroundColor: '#ddd', borderRadius: 5 }}
          >
            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>← REGRESAR AL INICIO</Text>
          </TouchableOpacity>
        )}

        {/*Se muestran los autores y generos si no hay nada en el cuadro de busqueda*/}
        {!filtro && textoBusqueda === "" && (
          <View style={{ marginVertical: 10 }}>
            <Text style={{fontWeight: 'bold'}}>Géneros:</Text>
            <ScrollView horizontal style={{ marginBottom: 10 }}>
              {generos.map((g, i) => (
                <TouchableOpacity 
                  key={`gen-${i}`} 
                  onPress={() => fetchLibros(g, "subject")} 
                  style={{ marginRight: 10, padding: 5, backgroundColor: '#f0f0f0', borderWidth: 1 }}>
                  <Text>{g}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={{fontWeight: 'bold'}}>Autores:</Text>
            <ScrollView horizontal>
              {autores.map((a, i) => (
                <TouchableOpacity 
                  key={`aut-${i}`} 
                  onPress={() => fetchLibros(a, "inauthor")} 
                  style={{ marginRight: 10, padding: 5, backgroundColor: '#f0f0f0', borderWidth: 1 }}>
                  <Text>{a}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {cargando && <ActivityIndicator size="small" color="#000" style={{ marginVertical: 5 }} />}

        <ScrollView keyboardShouldPersistTaps="handled">
          {libros.map((item, index) => (
            <TouchableOpacity 
              key={item.id || `libro-${index}`} 
              onPress={() => navigation.navigate('Detalle', { libro: item })}
            >
              <View style={estilos.card}>
                <View style={estilos.textoContainer}>
                  <Text style={{fontWeight: 'bold'}}>{item.volumeInfo.title}</Text>
                  <Text style={{ fontSize: 12, color: 'gray' }}>
                    {item.volumeInfo.authors?.join(", ") || "Autor desconocido"}
                  </Text>
                </View>
                {item.volumeInfo.imageLinks?.thumbnail && (
                  <Image 
                    style={estilos.imagen} 
                    source={{ uri: item.volumeInfo.imageLinks.thumbnail.replace("http://", "https://") }} 
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}