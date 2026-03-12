import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState } from "react";

import Inicio from './inic';
import Favoritos from './Favs';
import Perfil from './Perfil';

const Tab = createBottomTabNavigator();

export default function App() {

  const [favoritos, setFavoritos] = useState([]);

  return (
    <NavigationContainer>
      <Tab.Navigator>

        <Tab.Screen name="Inicio">
          {() => <Inicio favoritos={favoritos} setFavoritos={setFavoritos} />}
        </Tab.Screen>

        <Tab.Screen name="Favoritos">
          {() => <Favoritos favoritos={favoritos} />}
        </Tab.Screen>

        <Tab.Screen name="Perfil" component={Perfil} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}