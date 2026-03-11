import { View, Text, Button } from "react-native";

export default function Pe({navigation}) {
  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <Text style={{fontSize: 30, textAlign: "center", marginBottom: 30}}>Estas en la pantalla del Perfil</Text>
        <View style={{marginBottom:10}}/>
        <Button title="Ir a Vista" onPress={() => navigation.navigate("Vista")}/>
    </View>
  );
}