import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";

export default function Perfil() {

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [registrado, setRegistrado] = useState(false);
  const [error, setError] = useState("");

  const validarCorreo = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@(gmail|hotmail|outlook|yahoo)\.com$/;
  return regex.test(email);
};
  const registrar = () => {
    if (nombre === "" || correo === "") {
      setError("Complete todos los campos");
      return;
    }
    if (!validarCorreo(correo)) {
      setError("Correo no válido");
      return;
    }
    setError("");
    setRegistrado(true);
  };
  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center", padding:20}}>
      {!registrado ? (
        <>
          {/*Estilo que tendra el registro de usuario*/}
          <Text style={{fontSize:24, marginBottom:20}}>Registro de Usuario</Text>
          <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre}
            style={{ borderWidth:1, width:"80%", padding:10, marginBottom:10, borderRadius:8}}/>

          {/*Estilo que tendra el mensaje de error si es que hay error*/}
          <TextInput placeholder="Correo" value={correo} onChangeText={setCorreo}
          style={{ borderWidth:1, width:"80%", padding:10, marginBottom:10, borderRadius:8 }}/>
          {error !== "" && (
            <Text style={{color:"red", marginBottom:10}}>{error}</Text>
          )}
          <Button title="Registrarse" onPress={registrar}/>
        </>
      ) : (
        <>
          <Text style={{fontSize:26, marginBottom:20}}>Perfil</Text>
          <Text style={{fontSize:18}}>Usuario registrado</Text>
          <Text style={{fontSize:18, marginTop:10}}> Nombre: {nombre} </Text>
          <Text style={{fontSize:18}}> Correo: {correo} </Text></>)}
    </View>
  );
}