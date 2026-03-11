import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import pe from './pe';
import det from './det';
import inic from './inic';
import vista from './vista';
import estilos from "./estilos";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen name="Inicio" component={inic} options={{title:"" , headerLeft:()=> null}} />
        <Stack.Screen name="Vista" component={vista} options={{headerLeft:()=> null}} />
        <Stack.Screen name="Perfil" component={pe} />
        <Stack.Screen name="Detalle" component={det} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 