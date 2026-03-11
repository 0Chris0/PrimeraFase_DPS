import { View, Text, Button } from "react-native";

export default function Vista({navigation}) {
  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <Text style={{fontSize: 30, textAlign: "center", marginBottom: 30}}>Estas en la pantalla de Vista</Text>
      <View style={{marginBottom:10}}/>
      <Button title="Regresar a Inicio" onPress={() => navigation.navigate("Inicio")}/>
      <View style={{marginBottom:10}}/>
      <Button title="Ir a Perfil" onPress={() => navigation.navigate("Perfil")}/>
      <View style={{marginBottom:10}}/>
      <Button title="Ir a Detalles" onPress={() => navigation.navigate("Detalle")}/>
    </View>
  );
}